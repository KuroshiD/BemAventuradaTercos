import { AppDataSource } from '../../data-source';
import { GalleryItem } from '../entities/GalleryItem';
import {
  CreateGalleryItemRequest,
  GalleryItemStatus,
  UpdateGalleryItemRequest,
} from '../types/gallery.types';

const galleryRepository = () => AppDataSource.getRepository(GalleryItem);

export const listGalleryItems = async (): Promise<GalleryItem[]> => {
  return galleryRepository().find();
};

export const createGalleryItem = async (
  data: CreateGalleryItemRequest
): Promise<GalleryItem> => {
  const item = galleryRepository().create({
    id: data.id ?? Math.random().toString(36).slice(2, 10),
    title: data.title,
    imageUrl: data.imageUrl,
    description: data.description ?? '',
    status: data.status ?? 'active',
  });

  return galleryRepository().save(item);
};

export const updateGalleryItem = async (
  id: string,
  data: UpdateGalleryItemRequest
): Promise<GalleryItem | undefined> => {
  const existingItem = await galleryRepository().findOne({ where: { id } });

  if (!existingItem) {
    return undefined;
  }

  galleryRepository().merge(existingItem, {
    title: data.title,
    imageUrl: data.imageUrl,
    description: data.description,
    status: data.status,
  });

  return galleryRepository().save(existingItem);
};

export const deleteGalleryItem = async (id: string): Promise<boolean> => {
  const result = await galleryRepository().delete({ id });
  return (result.affected ?? 0) > 0;
};

export const updateGalleryItemStatus = async (
  id: string,
  status: GalleryItemStatus
): Promise<GalleryItem | undefined> => {
  const existingItem = await galleryRepository().findOne({ where: { id } });

  if (!existingItem) {
    return undefined;
  }

  existingItem.status = status;
  return galleryRepository().save(existingItem);
};
