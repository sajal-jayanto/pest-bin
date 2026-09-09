import createApp from "./app.ts";
import { connectDatabase } from "./db/index.ts";
import { logger } from "./utils/logger.ts";

const app = createApp();

const startServer = async () => {
  try {
    const defaultPort = "3000";
    const PORT = Deno.env.get("PORT") ?? defaultPort;
    
    await connectDatabase();
    app.listen(PORT, () => {  
      logger.info(`🚀 Server is running on port ${PORT}`) 
    });
  } catch (error) {
    console.error("❌ Startup aborted: database is not connected.");
    console.error(error);
    Deno.exit(1);
  }
};

startServer();
