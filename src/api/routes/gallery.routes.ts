import { Router } from 'express';
import {
  createGalleryItemHandler,
  deleteGalleryItemHandler,
  getGalleryItems,
  updateGalleryItemHandler,
  updateGalleryItemStatusHandler,
} from '../controllers/gallery.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/galeria', getGalleryItems);
router.post('/galeria', createGalleryItemHandler);
router.put('/galeria/:id', updateGalleryItemHandler);
router.delete('/galeria/:id', deleteGalleryItemHandler);
router.patch('/galeria/:id/status', updateGalleryItemStatusHandler);

export default router;
