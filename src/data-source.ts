import 'reflect-metadata';
import { DataSource } from 'typeorm';
import env from './env';
import { GalleryItem } from './api/entities/GalleryItem';
import { PecaItem } from './api/entities/PecaItem';
import { CreateGalleryAndPecaTables1685620000000 } from './api/migrations/1685620000000-CreateGalleryAndPecaTables';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.db_host,
  port: env.db_port,
  username: env.db_user,
  password: env.db_pass,
  database: env.db,
  entities: [GalleryItem, PecaItem],
  migrations: [CreateGalleryAndPecaTables1685620000000],
  synchronize: false,
  logging: false,
});
