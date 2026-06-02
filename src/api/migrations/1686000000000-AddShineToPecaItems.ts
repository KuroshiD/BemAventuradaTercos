import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddShineToPecaItems1686000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE peca_item
      ADD COLUMN IF NOT EXISTS shine BOOLEAN NOT NULL DEFAULT FALSE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE peca_item
      DROP COLUMN IF EXISTS shine;
    `);
  }
}
