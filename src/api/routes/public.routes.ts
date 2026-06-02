import { Router } from 'express';
import { getPublicGalleryItems } from '../controllers/gallery.controller';
import { getPublicPecasByCategory } from '../controllers/pecas.controller';

const router = Router();

router.get('/galeria', getPublicGalleryItems);
router.get('/pecas/:categoria', getPublicPecasByCategory);

export default router;
