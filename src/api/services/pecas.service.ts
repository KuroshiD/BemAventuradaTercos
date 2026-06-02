import { AppDataSource } from '../../data-source';
import { PecaItem } from '../entities/PecaItem';
import {
  CreatePecaRequest,
  PecaCategory,
  PecaStatus,
  UpdatePecaRequest,
} from '../types/pecas.types';

const pecaRepository = () => AppDataSource.getRepository(PecaItem);

export const listPecasByCategory = async (category: PecaCategory): Promise<PecaItem[]> => {
  return pecaRepository().find({ where: { category } });
};

export const createPeca = async (
  category: PecaCategory,
  data: CreatePecaRequest
): Promise<PecaItem> => {
  const item = pecaRepository().create({
    id: Math.random().toString(36).slice(2, 10),
    category,
    name: data.name,
    material: data.material,
    price: data.price,
    status: data.status ?? 'active',
    color: data.color,
    shine: data.shine ?? false,
  });

  return pecaRepository().save(item);
};

export const updatePeca = async (
  category: PecaCategory,
  id: string,
  data: UpdatePecaRequest
): Promise<PecaItem | undefined> => {
  const existing = await pecaRepository().findOne({ where: { id, category } });

  if (!existing) {
    return undefined;
  }

  pecaRepository().merge(existing, {
    name: data.name,
    material: data.material,
    price: data.price,
    status: data.status,
    color: data.color,
    shine: data.shine,
  });

  return pecaRepository().save(existing);
};

export const deletePeca = async (category: PecaCategory, id: string): Promise<boolean> => {
  const result = await pecaRepository().delete({ id, category });
  return (result.affected ?? 0) > 0;
};

export const updatePecaPrice = async (
  category: PecaCategory,
  id: string,
  price: number
): Promise<PecaItem | undefined> => {
  const existing = await pecaRepository().findOne({ where: { id, category } });

  if (!existing) {
    return undefined;
  }

  existing.price = price;
  return pecaRepository().save(existing);
};

export const updatePecaStatus = async (
  category: PecaCategory,
  id: string,
  status: PecaStatus
): Promise<PecaItem | undefined> => {
  const existing = await pecaRepository().findOne({ where: { id, category } });

  if (!existing) {
    return undefined;
  }

  existing.status = status;
  return pecaRepository().save(existing);
};
