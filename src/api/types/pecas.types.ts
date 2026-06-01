export type PecaCategory = 'micancas' | 'passantes' | 'entremeios' | 'crucifixos';
export type PecaStatus = 'active' | 'hidden';

export interface PecaItem {
  id: string;
  category: PecaCategory;
  name: string;
  material: string;
  price: number;
  status: PecaStatus;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePecaRequest {
  name: string;
  material: string;
  price: number;
  status?: PecaStatus;
  color?: string;
}

export interface UpdatePecaRequest {
  name?: string;
  material?: string;
  price?: number;
  status?: PecaStatus;
  color?: string;
}
