import { Router } from 'express';
import multer from 'multer';
import {
  createPecaHandler,
  deletePecaHandler,
  getPecasByCategory,
  updatePecaHandler,
  updatePecaPriceHandler,
  updatePecaStatusHandler,
} from '../controllers/pecas.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
const uploadSingle: any = upload.single('image');

router.use(authMiddleware);

router.get('/pecas/:categoria', getPecasByCategory);
router.post('/pecas/:categoria', uploadSingle, createPecaHandler);
router.put('/pecas/:categoria/:id', uploadSingle, updatePecaHandler);
router.delete('/pecas/:categoria/:id', deletePecaHandler);
router.patch('/pecas/:categoria/:id/price', updatePecaPriceHandler);
router.patch('/pecas/:categoria/:id/status', updatePecaStatusHandler);

export default router;
