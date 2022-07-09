import { Request, Response } from "express";
import { cardActivationSchema } from "../schemas/index.js";
import * as cardService from "../services/cardsService.js"
import validateSchema from "../utils/schemaValidation.js";

export async function createCard(req: Request, res: Response) {
  const API = req.header("x-api-key");
  const body: {
    employeeId: number,
    type: "groceries" | "restaurant" | "transport" | "education" | "health"
  } = req.body;

  await cardService.createCard(body, API)
  res.sendStatus(201)
}

export async function activateCard(req: Request, res: Response) {
  const cardInfo: {id: number, securityCode: string, password: string} = req.body
  validateSchema(cardActivationSchema, req.body)

  await cardService.activateCard(cardInfo)

  res.sendStatus(200)
}