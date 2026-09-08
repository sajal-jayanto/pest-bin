import "reflect-metadata";
import { DataSource } from "typeorm";

const DataBaseConnection = new DataSource({
  type: "postgres",
  host: Deno.env.get("DB_HOST"),
  port: Number(Deno.env.get("DB_PORT") ?? 5432),
  username: Deno.env.get("DB_USER"),
  password: Deno.env.get("DB_PASSWORD"),
  database: Deno.env.get("DB_NAME"),
  entities: ["./src/entities/**/*.ts"],
  
  synchronize: false,
  logging: false,
});

export { DataBaseConnection };