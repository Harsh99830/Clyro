
// Initialize S3 client for Cloudflare R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// Delete an image
const deleteImage = async (req, res) => {
  try {
    const { key, folder } = req.body;

    if (!key || !folder) {
      return res.status(400).json({ error: 'Missing required fields: key and folder are required' });
    }

    // Delete from S3
    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${folder}/${key}`,
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));

    // Delete from database
    await prisma.image.deleteMany({
      where: {
        key: key,
        folder: folder,
      },
    });

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image', details: error.message });
  }
};

export { deleteImage };
