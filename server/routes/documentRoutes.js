import express from 'express';
import multer from 'multer';
import { uploadDocument, getDocuments, getDocument, deleteDocument, downloadDocument } from '../controllers/documentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

router.use(protect);

router.route('/')
  .get(getDocuments)
  .post(upload.single('document'), uploadDocument);

router.route('/:id')
  .get(getDocument)
  .delete(deleteDocument);

router.get('/:id/download', downloadDocument);

export default router;