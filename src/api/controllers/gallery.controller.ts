import { Request, Response } from 'express';
import {
  createGalleryItem,
  deleteGalleryItem,
  listGalleryItems,
  updateGalleryItem,
  updateGalleryItemStatus,
} from '../services/gallery.service';
import { CreateGalleryItemRequest, GalleryItemStatus, UpdateGalleryItemRequest } from '../types/gallery.types';

const isValidStatus = (value: unknown): value is GalleryItemStatus => {
  return value === 'active' || value === 'inactive';
};

export const getGalleryItems = async (_req: Request, res: Response): Promise<void> => {
  const items = await listGalleryItems();
  res.json(items);
};

export const createGalleryItemHandler = async (req: Request, res: Response): Promise<void> => {
  const { title, imageUrl, description, status } = req.body as CreateGalleryItemRequest;

  if (!title || !imageUrl) {
    res.status(400).json({ error: 'Os campos title e imageUrl são obrigatórios.' });
    return;
  }

  if (status !== undefined && !isValidStatus(status)) {
    res.status(400).json({ error: 'Status inválido. Use "active" ou "inactive".' });
    return;
  }

  const item = await createGalleryItem({ title, imageUrl, description, status });
  res.status(201).json(item);
};

export const updateGalleryItemHandler = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, imageUrl, description, status } = req.body as UpdateGalleryItemRequest;

  if (status !== undefined && !isValidStatus(status)) {
    res.status(400).json({ error: 'Status inválido. Use "active" ou "inactive".' });
    return;
  }

  const item = await updateGalleryItem(id, { title, imageUrl, description, status });

  if (!item) {
    res.status(404).json({ error: 'Item não encontrado.' });
    return;
  }

  res.json(item);
};

export const deleteGalleryItemHandler = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const deleted = await deleteGalleryItem(id);

  if (!deleted) {
    res.status(404).json({ error: 'Item não encontrado.' });
    return;
  }

  res.json({ message: 'Item de galeria removido com sucesso.' });
};

export const updateGalleryItemStatusHandler = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body as { status?: GalleryItemStatus };

  if (!isValidStatus(status)) {
    res.status(400).json({ error: 'Status inválido. Use "active" ou "inactive".' });
    return;
  }

  const item = await updateGalleryItemStatus(id, status);

  if (!item) {
    res.status(404).json({ error: 'Item não encontrado.' });
    return;
  }

  res.json(item);
};
