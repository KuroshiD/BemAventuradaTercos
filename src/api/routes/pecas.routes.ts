import { Router } from 'express';
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

router.use(authMiddleware);

router.get('/pecas/:categoria', getPecasByCategory);
router.post('/pecas/:categoria', createPecaHandler);
router.put('/pecas/:categoria/:id', updatePecaHandler);
router.delete('/pecas/:categoria/:id', deletePecaHandler);
router.patch('/pecas/:categoria/:id/price', updatePecaPriceHandler);
router.patch('/pecas/:categoria/:id/status', updatePecaStatusHandler);

export default router;
