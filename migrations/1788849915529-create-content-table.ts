import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateContentTable1788849915529 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "content" (
        "id"         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        "identifier" varchar(255) NOT NULL,
        "bio" text,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }

}
