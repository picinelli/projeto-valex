import { Request, Response } from "express";
import * as cardService from "../services/cardsService.js"

export async function createCard(req: Request, res: Response) {
  const API = req.header("x-api-key");
  const body: {
    employeeId: number,
    type: "groceries" | "restaurant" | "transport" | "education" | "health"
  } = req.body;

  await cardService.createCard(body, API)

  res.sendStatus(201)
}
