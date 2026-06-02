export type GalleryItemStatus = 'active' | 'inactive';

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
  status: GalleryItemStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGalleryItemRequest {
  id?: string;
  title: string;
  imageUrl: string;
  description?: string;
  status?: GalleryItemStatus;
}

export interface UpdateGalleryItemRequest {
  title?: string;
  imageUrl?: string;
  description?: string;
  status?: GalleryItemStatus;
}
