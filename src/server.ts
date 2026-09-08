import createApp from "./app.ts";
import { logger } from "./utils/logger.ts";

const app = createApp();

const startServer = () => {
  const defaultPort = "3000";
  const PORT = Deno.env.get("PORT") ?? defaultPort;
  app.listen(PORT, () => {  logger.info(`🚀 Server is running on port ${PORT}`) });
};

startServer();
