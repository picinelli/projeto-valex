import { Request, Response } from "express";
import { cardActivationSchema, cardBlockSchema, cardDeleteSchema, virtualCardCreationSchema } from "../schemas/index.js";
import * as cardService from "../services/cardsService.js"
import validateSchema from "../utils/schemaValidation.js";

export async function createCard(req: Request, res: Response) {
  const API = req.header("x-api-key");
  const body: {
    employeeId: number,
    type: "groceries" | "restaurant" | "transport" | "education" | "health"
  } = req.body;

  const securityCode = await cardService.createCard(body, API)
  
  res.status(201).send(securityCode)
}

export async function createVirtualCard(req: Request, res: Response) {
  const body: {
    originalCardId: number,
    password: string
  } = req.body;

  validateSchema(virtualCardCreationSchema, body)

  const securityCode = await cardService.createVirtualCard(body)

  res.status(201).send(securityCode)
}

export async function deleteVirtualCard(req: Request, res: Response) {
  const cardInfo: {id: number, password: string} = req.body
  validateSchema(cardDeleteSchema, cardInfo)

  await cardService.deleteCard(cardInfo)

  res.status(200).send("The card was deleted successfully!")
}

export async function activateCard(req: Request, res: Response) {
  const cardInfo: {id: number, securityCode: string, password: string} = req.body
  validateSchema(cardActivationSchema, req.body)

  await cardService.activateCard(cardInfo)

  res.status(200).send("The card was activated successfully!")
}

export async function blockCard(req: Request, res: Response) {
  const cardInfo: {id: number, password: string} = req.body
  validateSchema(cardBlockSchema, cardInfo)

  await cardService.blockCardById(cardInfo)
  
  res.status(200).send("The card was blocked successfully!")
}

export async function unblockCard(req: Request, res: Response) {
  const cardInfo: {id: number, password: string} = req.body
  validateSchema(cardBlockSchema, cardInfo)

  await cardService.unblockCardById(cardInfo)
  res.status(200).send("The card was unlocked successfully!")
}