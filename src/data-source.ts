import 'reflect-metadata';
import { DataSource } from 'typeorm';
import env from './env';
import { GalleryItem } from './api/entities/GalleryItem';
import { PecaItem } from './api/entities/PecaItem';
import { CreateGalleryAndPecaTables1685620000000 } from './api/migrations/1685620000000-CreateGalleryAndPecaTables';
import { AddShineToPecaItems1686000000000 } from './api/migrations/1686000000000-AddShineToPecaItems';
import { AddImageToPecaItems1686000000001 } from './api/migrations/1686000000001-AddImageToPecaItems';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.db_host,
  port: env.db_port,
  username: env.db_user,
  password: env.db_pass,
  database: env.db,
  entities: [GalleryItem, PecaItem],
  migrations: [
    CreateGalleryAndPecaTables1685620000000,
    AddShineToPecaItems1686000000000,
    AddImageToPecaItems1686000000001,
  ],
  synchronize: false,
  logging: false,
});
