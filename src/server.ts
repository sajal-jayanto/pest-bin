import createApp from "./app.ts";
import { DataBaseConnection } from "./db/index.ts";
import { logger } from "./utils/logger.ts";

const app = createApp();

const startServer = async () => {
  const defaultPort = "3000";
  const PORT = Deno.env.get("PORT") ?? defaultPort;

  try {
    
    await DataBaseConnection.initialize();
    logger.info("✅ Connected to database successfully.");
    
    app.listen(PORT, () => { 
      logger.info(`🚀 Server is running on port ${PORT}`) 
    });

  } catch (error) {
    
    console.error("❌ Database connection failed.");
    console.error(error);
    
    Deno.exit(1);
  }
};

startServer();
