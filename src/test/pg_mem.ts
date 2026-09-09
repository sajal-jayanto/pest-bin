import { DataType, newDb } from "pg-mem";
import type { DataSource } from "typeorm";
import { Content } from "../entities/content.entitiy.ts";
import { setDataSource } from "../db/index.ts";

const ENTITIES = [Content];

const useFakeDb = async (): Promise<DataSource> => {
  const db = newDb();

  db.public.registerFunction({
    name: "version",
    returns: DataType.text,
    implementation: () => "PostgreSQL 14.2 (pg-mem)",
  });
  db.public.registerFunction({
    name: "current_database",
    returns: DataType.text,
    implementation: () => "pgmem",
  });

  db.public.interceptQueries((sql) => {
    if (/obj_description|col_description|pg_get_constraintdef/i.test(sql)) return [];
    return null;
  });

  const ds: DataSource = db.adapters.createTypeormDataSource({
    type: "postgres",
    entities: ENTITIES,
    synchronize: true,
  });
  await ds.initialize();
  setDataSource(ds);
  return ds;
};

export { useFakeDb };
