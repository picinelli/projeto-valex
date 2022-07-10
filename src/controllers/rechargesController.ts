import { Request, Response } from "express";
import { cardRechargeSchema } from "../schemas/index.js";
import * as rechargesService from "../services/rechargesService.js"
import validateSchema from "../utils/schemaValidation.js";

export async function rechargeCard(req: Request, res: Response) {
  const rechargeInfo: {cardId: number, amount: number} = req.body

  validateSchema(cardRechargeSchema, rechargeInfo)

  await rechargesService.rechargeCard(rechargeInfo)
  
  res.status(200).send("The card was recharged successfully!")
}