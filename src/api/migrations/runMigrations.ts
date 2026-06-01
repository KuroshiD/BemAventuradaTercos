import 'reflect-metadata';
import { AppDataSource } from '../../data-source';

const runMigrations = async (): Promise<void> => {
  console.log('Starting TypeORM migrations...');
  await AppDataSource.initialize();
  await AppDataSource.runMigrations();
  console.log('Migrations finished.');
  await AppDataSource.destroy();
};

runMigrations().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
