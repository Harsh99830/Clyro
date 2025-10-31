import express from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client, ListObjectsV2Command, CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors());

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

// Multer storage config
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.R2_BUCKET_NAME,
    acl: "public-read",
    key: function (req, file, cb) {
      cb(null, `uploads/${Date.now()}-${file.originalname}`);
    },
  }),
});

// Route to upload file
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({
    message: "File uploaded successfully!",
    fileUrl: req.file.location,
  });
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
    
    // Filter for common image file types
    const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);
    
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
