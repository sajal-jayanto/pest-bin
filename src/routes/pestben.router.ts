import { Router, type Request, type Response } from "express";
import { StatusCodes } from "http-status-codes";
import { randomString } from "../utils/logger.ts";
import { HttpError } from "../middlewares/error.middleware.ts";
import { validate } from "../middlewares/validate.middleware.ts";
import { pestbenFetchSchema, pestbenSaveSchema } from "../schemas/pestBen.schema.ts";
import { Content } from "../entities/content.entitiy.ts";
import { getDataSource, getRepository } from "../db/index.ts";
import { EntityManager } from "typeorm";
import lodash from "lodash";

export const pestBenRouter = Router();

const contentRepo = await getRepository(Content);
const DB = await getDataSource();

pestBenRouter.get("/get-slug", (_req: Request, res: Response) => {
  const slug = randomString();
  if(lodash.isEmpty(slug)) {
    throw new HttpError("sorry can't generate slug." , StatusCodes.BAD_GATEWAY);
  }
  
  res.status(StatusCodes.OK).json({ slug, message: "slug created successfully" })
})

pestBenRouter.get(
  "/fetch/:identifier",
  validate({ params: pestbenFetchSchema }),
  async (req: Request , res: Response) => {

    const { identifier } = req.params;
    const content = await contentRepo.findOneBy({ identifier });

    if(!content) {
      throw new HttpError(`No content found on ${identifier}`, StatusCodes.NOT_FOUND)
    }

    res.status(StatusCodes.OK).json({ content });
  }
);

pestBenRouter.post(
  "/save", 
  validate({ body : pestbenSaveSchema }), 
  async (req: Request, res: Response) => {

    const { identifier , bio } = req.body;
    const isPresent = await contentRepo.findOneBy({ identifier });
    
    if(isPresent){
      await DB.transaction(async (tx: EntityManager) => {
        const content = await tx.findOne(Content, {
          where: { identifier: identifier },
          lock: { mode: "pessimistic_write" },
        });

        if(!content) {
          throw new HttpError(`No content found on ${identifier}`, StatusCodes.NOT_FOUND)
        }

        content.bio = bio;
        await tx.save(content);
      });
      return res.status(StatusCodes.OK).json({ 
        message : "Content updated successfully." 
      });  
    } 

    const content = await contentRepo.save(
      contentRepo.create({ identifier, bio })
    );
    return res.status(StatusCodes.CREATED).json({ 
      content, 
      message : "Content created successfully." 
    });
  }
);
