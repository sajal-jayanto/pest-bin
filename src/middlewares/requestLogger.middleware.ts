import { type Request, type Response } from "express";
import { pinoHttp } from "pino-http";
import { logger } from "../utils/logger.ts";

const requestLogger = pinoHttp({
  logger,
  serializers: {
    req: (req: Request) => ({ method: req.method, url: req.url }),
    res: (res: Response) => ({ statusCode: res.statusCode }),
  },
  customLogLevel: (_req: Request, res: Response, err) => {
    if (err || res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
});

export { requestLogger };