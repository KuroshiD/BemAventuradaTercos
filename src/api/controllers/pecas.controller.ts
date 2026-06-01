import { Request, Response } from 'express';
import {
  createPeca,
  deletePeca,
  listPecasByCategory,
  updatePeca,
  updatePecaPrice,
  updatePecaStatus,
} from '../services/pecas.service';
import {
  CreatePecaRequest,
  PecaCategory,
  PecaStatus,
  UpdatePecaRequest,
} from '../types/pecas.types';

const VALID_CATEGORIES: PecaCategory[] = ['micancas', 'passantes', 'entremeios', 'crucifixos'];
const VALID_STATUSES: PecaStatus[] = ['active', 'hidden'];

const isValidCategory = (value: unknown): value is PecaCategory =>
  typeof value === 'string' && VALID_CATEGORIES.includes(value as PecaCategory);

const isValidStatus = (value: unknown): value is PecaStatus =>
  typeof value === 'string' && VALID_STATUSES.includes(value as PecaStatus);

export const getPecasByCategory = async (req: Request, res: Response): Promise<void> => {
  const category = req.params.categoria;

  if (!isValidCategory(category)) {
    res.status(400).json({ error: 'Categoria inválida.' });
    return;
  }

  res.json(await listPecasByCategory(category));
};

export const createPecaHandler = async (req: Request, res: Response): Promise<void> => {
  const category = req.params.categoria;
  const { name, material, price, status, color } = req.body as CreatePecaRequest;

  if (!isValidCategory(category)) {
    res.status(400).json({ error: 'Categoria inválida.' });
    return;
  }

  if (!name || !material || price === undefined || Number.isNaN(Number(price))) {
    res.status(400).json({ error: 'Os campos name, material e price são obrigatórios.' });
    return;
  }

  if (status !== undefined && !isValidStatus(status)) {
    res.status(400).json({ error: 'Status inválido. Use "active" ou "hidden".' });
    return;
  }

  const item = await createPeca(category, {
    name,
    material,
    price: Number(price),
    status,
    color,
  });

  res.status(201).json(item);
};

export const updatePecaHandler = async (req: Request, res: Response): Promise<void> => {
  const category = req.params.categoria;
  const { id } = req.params;
  const { name, material, price, status, color } = req.body as UpdatePecaRequest;

  if (!isValidCategory(category)) {
    res.status(400).json({ error: 'Categoria inválida.' });
    return;
  }

  if (status !== undefined && !isValidStatus(status)) {
    res.status(400).json({ error: 'Status inválido. Use "active" ou "hidden".' });
    return;
  }

  if (price !== undefined && Number.isNaN(Number(price))) {
    res.status(400).json({ error: 'Preço inválido.' });
    return;
  }

  const item = await updatePeca(category, id, {
    name,
    material,
    price: price !== undefined ? Number(price) : undefined,
    status,
    color,
  });

  if (!item) {
    res.status(404).json({ error: 'Item não encontrado.' });
    return;
  }

  res.json(item);
};

export const deletePecaHandler = async (req: Request, res: Response): Promise<void> => {
  const category = req.params.categoria;
  const { id } = req.params;

  if (!isValidCategory(category)) {
    res.status(400).json({ error: 'Categoria inválida.' });
    return;
  }

  const deleted = await deletePeca(category, id);

  if (!deleted) {
    res.status(404).json({ error: 'Item não encontrado.' });
    return;
  }

  res.json({ message: 'Peça removida com sucesso.' });
};

export const updatePecaPriceHandler = async (req: Request, res: Response): Promise<void> => {
  const category = req.params.categoria;
  const { id } = req.params;
  const { price } = req.body as { price?: number };

  if (!isValidCategory(category)) {
    res.status(400).json({ error: 'Categoria inválida.' });
    return;
  }

  if (price === undefined || Number.isNaN(Number(price))) {
    res.status(400).json({ error: 'Preço inválido.' });
    return;
  }

  const item = await updatePecaPrice(category, id, Number(price));

  if (!item) {
    res.status(404).json({ error: 'Item não encontrado.' });
    return;
  }

  res.json(item);
};

export const updatePecaStatusHandler = async (req: Request, res: Response): Promise<void> => {
  const category = req.params.categoria;
  const { id } = req.params;
  const { status } = req.body as { status?: PecaStatus };

  if (!isValidCategory(category)) {
    res.status(400).json({ error: 'Categoria inválida.' });
    return;
  }

  if (!isValidStatus(status)) {
    res.status(400).json({ error: 'Status inválido. Use "active" ou "hidden".' });
    return;
  }

  const item = await updatePecaStatus(category, id, status);

  if (!item) {
    res.status(404).json({ error: 'Item não encontrado.' });
    return;
  }

  res.json(item);
};
