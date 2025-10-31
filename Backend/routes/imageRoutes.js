import express from 'express';
import { deleteImage } from '../controllers/imageController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Delete an image
router.delete('/', verifyToken, deleteImage);

export default router;
