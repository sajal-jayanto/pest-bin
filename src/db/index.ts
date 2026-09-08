import { DataSource, EntityTarget, ObjectLiteral, Repository } from "typeorm";
import { logger } from "../utils/logger.ts";

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

let dbPromise: Promise<DataSource> | null = null;

const getDataSource = (): Promise<DataSource> => {
  if (!dbPromise) {
    try {
      dbPromise = DataBaseConnection
        .initialize()
        .catch((err) => { 
          dbPromise = null; 
          throw err;
        });
      
      logger.info("✅ Connected to database successfully.");
    
    } catch (error) {
      console.error("❌ Database connection failed.");
      console.error(error);

      Deno.exit(1);
    }
  }
  return dbPromise;
}

const getRepository = async <T extends ObjectLiteral>
  ( entity: EntityTarget<T> ) : Promise<Repository<T>> => {
  const ds = await getDataSource();
  return ds.getRepository(entity);
}

export { DataBaseConnection , getDataSource, getRepository };