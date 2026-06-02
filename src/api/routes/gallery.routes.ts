import { Router } from 'express';
import multer from 'multer';
import {
  createGalleryItemHandler,
  deleteGalleryItemHandler,
  getGalleryItems,
  updateGalleryItemHandler,
  updateGalleryItemStatusHandler,
} from '../controllers/gallery.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
const uploadSingle: any = upload.single('image');

router.use(authMiddleware);

router.get('/galeria', getGalleryItems);
router.post('/galeria', uploadSingle, createGalleryItemHandler);
router.put('/galeria/:id', uploadSingle, updateGalleryItemHandler);
router.delete('/galeria/:id', deleteGalleryItemHandler);
router.patch('/galeria/:id/status', updateGalleryItemStatusHandler);

export default router;
