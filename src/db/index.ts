import { DataSource, EntityTarget, ObjectLiteral, Repository } from "typeorm";
import { logger } from "../utils/logger.ts";

let dbPromise: Promise<DataSource> | null = null;
const connectDatabase = (): Promise<DataSource> => getDataSource();

const DataBaseConnection = new DataSource({
  type: "postgres",
  host: Deno.env.get("DB_HOST"),
  port: Number(Deno.env.get("DB_PORT") ?? 5432),
  username: Deno.env.get("DB_USER"),
  password: Deno.env.get("DB_PASSWORD"),
  database: Deno.env.get("DB_NAME"),
  entities: ["./src/entities/**/*.ts"],
  migrations: ["./migrations/*.ts"],

  synchronize: false,
  logging: false,
});

const getDataSource = (): Promise<DataSource> => {
  if (!dbPromise) {
    dbPromise = DataBaseConnection
      .initialize()
      .then((ds) => {
        logger.info("✅ Connected to database successfully.");
        return ds;
      })
      .catch((err) => {
        dbPromise = null;
        throw new Error("❌ Database connection failed.", { cause: err });
      });
  }
  return dbPromise;
}

const getRepository = async <T extends ObjectLiteral>
  ( entity: EntityTarget<T> ) : Promise<Repository<T>> => {
  const ds = await getDataSource();
  return ds.getRepository(entity);
}

export { connectDatabase, DataBaseConnection, getDataSource, getRepository };