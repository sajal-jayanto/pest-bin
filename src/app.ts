import express, { type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { requestLogger } from "./middlewares/requestLogger.middleware.ts";
import { notFoundHandler } from "./middlewares/notFound.middleware.ts";
import { errorHandler } from "./middlewares/error.middleware.ts";
import { StatusCodes } from "http-status-codes";
import { pestBenRouter } from "./routes/pestben.router.ts";

const app = express();

const createApp = () => {
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);

  app.get("/health", (_req: Request, res: Response) => {
    res.status(StatusCodes.OK).json({ 
      status : "ok",
      time: new Date().toISOString(),
      uptime: `${Math.trunc(process.uptime())}s`
    });
  });

  app.use("pestben", pestBenRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export default createApp;