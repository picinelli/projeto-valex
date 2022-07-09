import { Request, Response } from "express";
import { cardTransactionsSchema } from "../schemas/index.js";
import validateSchema from "../utils/schemaValidation.js";
import * as employeesService from "../services/employeesService.js"

export async function getBalanceAndTransactions(req: Request, res: Response) {
  const id = req.header("id")
  validateSchema(cardTransactionsSchema, {id})

  const balanceAndTransactions = await employeesService.getBalanceAndTransactions(id)
  
  res.send(balanceAndTransactions)
}