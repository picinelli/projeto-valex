import { NextFunction, Request, Response } from "express";

export async function validateApiKeyAndCardType(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const API = req.headers["x-api-key"];
  const body = req.body;

  if (!API) return res.status(400).send("Insira uma chave API!");
  if (
    body.type !== "groceries" &&
    body.type !== "restaurant" &&
    body.type !== "transport" &&
    body.type !== "education" &&
    body.type !== "health"
  ) {
    return res.status(400).send("Insira um tipo de cartão válido!")
  }
  
    next();
}
