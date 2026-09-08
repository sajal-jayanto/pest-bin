import { Router, type Request, type Response } from "express";
import { StatusCodes } from "http-status-codes";

export const pestBenRouter = Router();

pestBenRouter.post("/save", (_req: Request, res: Response) => {
  res.status(StatusCodes.CREATED).json({});
});
