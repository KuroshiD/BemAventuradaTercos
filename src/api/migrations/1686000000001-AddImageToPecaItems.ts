import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddImageToPecaItems1686000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE peca_item
      ADD COLUMN IF NOT EXISTS image_url TEXT;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE peca_item
      DROP COLUMN IF EXISTS image_url;
    `);
  }
}
