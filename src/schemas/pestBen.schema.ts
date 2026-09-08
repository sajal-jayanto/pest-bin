import { z } from "zod";

export const pestbenSaveSchema = z.object({
  identifier: z
    .string({ error: "'identifier' is required" })
    .trim()
    .min(16, "'identifier' length can't less then 16."),
  bio: z
    .string({ error: "'bio' is required" })
    .trim()
    .min(1, "'bio' can't be empty."),
});


export const pestbenFetchSchema = z.object({
  identifier: z
    .string({ error: "'identifier' is required" })
    .trim()
    .min(16, "'identifier' length can't less then 16."),
})