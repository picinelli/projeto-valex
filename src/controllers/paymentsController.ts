import { Request, Response } from "express";
import { paymentSchema } from "../schemas/index.js";
import validateSchema from "../utils/schemaValidation.js";
import * as paymentService from "../services/paymentService.js";

export async function paymentTransaction(req: Request, res: Response) {
  const paymentInfo: {
    cardId: number;
    password: string;
    businessId: number;
    amount: number;
  } = req.body;

  validateSchema(paymentSchema, paymentInfo)

  await paymentService.paymentTransaction(paymentInfo)

  res.status(200).send("Pagamento efetuado com sucesso");
}
