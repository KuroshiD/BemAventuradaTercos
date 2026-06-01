import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGalleryAndPecaTables1685620000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS gallery_item (
        id VARCHAR PRIMARY KEY,
        title VARCHAR NOT NULL,
        image_url VARCHAR NOT NULL,
        description TEXT DEFAULT '',
        status VARCHAR NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS peca_item (
        id VARCHAR PRIMARY KEY,
        category VARCHAR NOT NULL,
        name VARCHAR NOT NULL,
        material VARCHAR NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        status VARCHAR NOT NULL,
        color VARCHAR,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS peca_item;');
    await queryRunner.query('DROP TABLE IF EXISTS gallery_item;');
  }
}
