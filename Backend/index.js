import express from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client, ListObjectsV2Command, CopyObjectCommand, DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// Enable CORS for all routes (use explicit header middleware as a fallback for some hosting providers)
app.use(cors());

// Fallback: explicitly set CORS headers for all responses. Some platforms/proxies may strip
// the automatic headers added by the `cors` package, so this ensures the Access-Control-* headers
// are always present. Configure allowed origins via `CORS_ALLOWED_ORIGINS` (comma-separated)
// in production (or leave unset to allow all origins).
app.use((req, res, next) => {
  const allowedEnv = process.env.CORS_ALLOWED_ORIGINS || '*';
  const allowedOrigins = allowedEnv === '*' ? ['*'] : allowedEnv.split(',').map(s => s.trim());
  const origin = req.headers.origin;

  if (!origin) {
    // non-browser requests (curl, server-side) - allow
    res.header('Access-Control-Allow-Origin', '*');
  } else if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    // do not set the header if origin not allowed
  }

  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Respond to preflight requests quickly
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// Debugging middleware: log origin, url, status and content-type after response finishes.
// This helps diagnose CORB issues by showing when the server returns HTML (or missing JSON headers).
app.use((req, res, next) => {
  const origin = req.headers.origin || '-';
  res.on('finish', () => {
    const ct = res.getHeader('content-type') || '-';
    console.log(`[CORS DEBUG] ${new Date().toISOString()} ${req.method} ${req.originalUrl} status=${res.statusCode} origin=${origin} content-type=${ct}`);
  });
  next();
});

// Ensure API routes have a JSON content-type by default if none is set. This won't change
// the body (useful when a proxy returns HTML error pages — those will still be HTML and
// show up in logs which helps debugging CORB). Do not force JSON for non-API routes.
app.use('/api', (req, res, next) => {
  if (!res.getHeader('content-type')) {
    res.setHeader('Content-Type', 'application/json');
  }
  next();
});

// Parse JSON bodies
app.use(express.json());

// Initialize R2 client
const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// Test R2 connection
async function testR2Connection() {
  console.log('🔍 Attempting to connect to Cloudflare R2...');
  console.log(`🔗 Endpoint: ${process.env.R2_ENDPOINT || 'Not set'}`);
  console.log(`🔑 Access Key ID: ${process.env.R2_ACCESS_KEY_ID ? 'Set' : 'Not set'}`);
  console.log(`🪣 Bucket: ${process.env.R2_BUCKET_NAME || 'Not set'}`);
  
  if (!process.env.R2_BUCKET_NAME) {
    console.error('❌ R2_BUCKET_NAME is not set in .env');
    return;
  }

  try {
    // Try to list objects in the specific bucket (requires less permissions)
    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
      MaxKeys: 1 // Only check if we can list at least 1 object
    });
    
    await s3.send(listCommand);
    console.log(`✅ Successfully connected to Cloudflare R2 and accessed bucket: ${process.env.R2_BUCKET_NAME}`);
    
  } catch (error) {
    console.error('❌ Failed to connect to Cloudflare R2');
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      statusCode: error.$metadata?.httpStatusCode,
      region: error.$metadata?.region,
      endpoint: error.$metadata?.endpoint
    });
    
    if (error.name === 'NoSuchBucket') {
      console.error(`❌ Bucket "${process.env.R2_BUCKET_NAME}" does not exist or you don't have access to it`);
    } else if (error.$metadata?.httpStatusCode === 403) {
      console.error('🚫 Permission denied. Your API key needs these permissions:');
      console.error('1. Go to Cloudflare Dashboard → R2 → Manage R2 → API Tokens');
      console.error('2. Edit your token and ensure it has these permissions for your bucket:');
      console.error('   - Object: Read & Write');
      console.error('   - Bucket: Read & Write');
    } else if (error.message.includes('credentials')) {
      console.error('🔒 Authentication failed. Please check your R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('🌐 Network error: Could not resolve the endpoint. Please check your R2_ENDPOINT');
    }
  }
}

// Test the connection when the server starts
testR2Connection();

// Multer memory storage for handling file in memory before uploading to R2
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to upload file to a specific folder
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const folder = req.body.folder || 'uploads';
    const fileName = `${Date.now()}-${req.file.originalname}`;
    const key = folder ? `${folder}/${fileName}` : fileName;

    const params = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read'
    };

    // Upload to R2
    const command = new PutObjectCommand(params);
    await s3.send(command);

    // Construct the public URL
    const fileUrl = `https://${process.env.R2_PUBLIC_DOMAIN || `${process.env.R2_BUCKET_NAME}.r2.cloudflarestorage.com`}/${key}`;

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        name: fileName,
        url: fileUrl,
        key: key,
        size: req.file.size,
        type: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload file',
      details: error.message
    });
  }
});

// Route to list all folders in the bucket
app.get("/api/folders", async (req, res) => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
      Delimiter: '/',
      MaxKeys: 1000
    });

    const response = await s3.send(command);
    
    // Extract folders from CommonPrefixes
    const folders = (response.CommonPrefixes || []).map(prefix => ({
      name: prefix.Prefix.replace(/\/$/, ''), // Remove trailing slash
      path: prefix.Prefix
    }));

    res.json({
      success: true,
      count: folders.length,
      folders: folders
    });
  } catch (error) {
    console.error('Error listing folders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list folders',
      details: error.message
    });
  }
});

// Route to update a folder name
app.put('/api/folders/:id', async (req, res) => {
  try {
    const { id: oldFolderName } = req.params;
    const { name: newFolderName } = req.body;

    if (!oldFolderName || !newFolderName) {
      return res.status(400).json({
        success: false,
        error: 'Both old folder name and new folder name are required'
      });
    }

    // List all objects with the old folder prefix
    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
      Prefix: oldFolderName.endsWith('/') ? oldFolderName : `${oldFolderName}/`,
    });

    const { Contents } = await s3.send(listCommand);

    if (!Contents || Contents.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Folder not found'
      });
    }

    // Copy each file to the new location and delete the old one
    for (const item of Contents) {
      const oldKey = item.Key;
      const newKey = oldKey.replace(
        oldFolderName.endsWith('/') ? oldFolderName : `${oldFolderName}/`,
        newFolderName.endsWith('/') ? newFolderName : `${newFolderName}/`
      );

      // Copy the object to the new location
      await s3.send(new CopyObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        CopySource: `/${process.env.R2_BUCKET_NAME}/${oldKey}`,
        Key: newKey,
        ACL: 'public-read'
      }));

      // Delete the old object
      await s3.send(new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: oldKey
      }));
    }

    res.json({
      success: true,
      message: 'Folder renamed successfully',
      oldName: oldFolderName,
      newName: newFolderName
    });
  } catch (error) {
    console.error('Error renaming folder:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to rename folder',
      details: error.message
    });
  }
});

// Route to delete a folder and all its contents
app.delete('/api/folders/:id', async (req, res) => {
  try {
    const { id: folderName } = req.params;

    if (!folderName) {
      return res.status(400).json({
        success: false,
        error: 'Folder name is required'
      });
    }

    // List all objects with the folder prefix
    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
      Prefix: folderName.endsWith('/') ? folderName : `${folderName}/`,
    });

    const { Contents } = await s3.send(listCommand);

    if (!Contents || Contents.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Folder not found or is empty'
      });
    }

    // Delete all objects in the folder
    const deletePromises = Contents.map(item => 
      s3.send(new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: item.Key
      }))
    );

    await Promise.all(deletePromises);

    res.json({
      success: true,
      message: 'Folder and all its contents deleted successfully',
      folder: folderName,
      deletedItems: Contents.length
    });
  } catch (error) {
    console.error('Error deleting folder:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete folder',
      details: error.message
    });
  }
});

// Route to create a new folder
app.post('/api/folders', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ 
        success: false,
        error: 'Folder name is required and must be a non-empty string' 
      });
    }

    // Sanitize folder name
    const sanitizedName = name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if folder already exists in R2
    const listParams = {
      Bucket: process.env.R2_BUCKET_NAME,
      Prefix: `${sanitizedName}/`,
      MaxKeys: 1
    };

    const objects = await s3.send(new ListObjectsV2Command(listParams));
    
    if (objects.Contents && objects.Contents.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'A folder with this name already exists'
      });
    }

    // Create a placeholder file to represent the folder in R2
    const params = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: `${sanitizedName}/.keep`,  // Hidden file to represent the folder
      Body: '',
      ContentType: 'application/x-www-form-urlencoded'
    };

    await s3.send(new PutObjectCommand(params));

    res.status(201).json({
      success: true,
      message: 'Folder created successfully',
      data: {
        name: sanitizedName,
        path: `${sanitizedName}/`
      }
    });
  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create folder',
      details: error.message
    });
  }
});

// Route to delete an image
app.delete("/api/images", async (req, res) => {
  try {
    const { key, folder } = req.body;
    
    if (!key || !folder) {
      return res.status(400).json({ error: 'Missing required fields: key and folder are required' });
    }

    // Delete from R2
    const deleteParams = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: `${folder}/${key}`,
    };

    await s3.send(new DeleteObjectCommand(deleteParams));
    
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image', details: error.message });
  }
});

// Route to list images in a specific folder
app.get("/api/images", async (req, res) => {
  try {
    const { folder } = req.query;
    
    if (!folder) {
      return res.status(400).json({
        success: false,
        error: 'Folder parameter is required',
        example: '/api/images?folder=event-name'
      });
    }

    // Ensure folder name ends with a slash
    const folderName = folder.endsWith('/') ? folder : `${folder}/`;
    
    const command = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
      Prefix: folderName,
      Delimiter: '/'
    });

    const response = await s3.send(command);
    
    if (!response.Contents) {
      return res.json({
        success: true,
        count: 0,
        images: []
      });
    }
    
    // Filter for common image and video file types so the API returns playable media (images + videos)
    const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.webm', '.ogg', '.mov']);
    
    const images = response.Contents
      .filter(item => {
        // Skip directories and hidden files
        if (item.Key.endsWith('/') || item.Key.includes('/.')) return false;
        
        const extension = item.Key.toLowerCase().substring(item.Key.lastIndexOf('.'));
        return imageExtensions.has(extension);
      })
      .map(item => {
        // Construct the public URL for R2
        const publicUrl = new URL(process.env.R2_PUBLIC_URL || `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`);
        publicUrl.pathname = `/${item.Key}`;
        
        return {
          name: item.Key.split('/').pop(), // Get just the filename
          url: publicUrl.toString(),
          lastModified: item.LastModified,
          size: item.Size,
          type: item.Key.split('.').pop().toLowerCase()
        };
      });

    res.json({
      success: true,
      count: images.length,
      images: images
    });
  } catch (error) {
    console.error('Error listing images:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list images',
      details: error.message
    });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access image list at: http://localhost:${PORT}/api/images`);
  console.log('Available routes:');
  console.log(`- GET  http://localhost:${PORT}/api/images`);
  console.log(`- POST http://localhost:${PORT}/upload`);
});
