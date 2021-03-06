import joi from "joi"

export const cardActivationSchema = joi.object({
  id: joi.number().required(),
  securityCode: joi.number().required(),
  password: joi.string().required()
})

export const cardTransactionsSchema = joi.object({
  id: joi.number().required(),
})

export const cardBlockSchema = joi.object({
  id: joi.number().required(),
  password: joi.string().required()
})

export const cardRechargeSchema = joi.object({
  cardId: joi.number().required(),
  amount: joi.number().required()
})

export const paymentSchema = joi.object({
  cardId: joi.number().required(),
  password: joi.string().required(),
  businessId: joi.number().required(),
  amount: joi.number().required()
})

export const paymentOnlineSchema = joi.object({
  number: joi.string().required(),
  cardholderName: joi.string().required(),
  expirationDate: joi.string().required(),
  securityCode: joi.string().required(),
  businessId: joi.number().required(),
  amount: joi.number().required(),
})

export const virtualCardCreationSchema = joi.object({
  originalCardId: joi.number().required(),
  password: joi.string().required()
})

export const cardDeleteSchema = joi.object({
  id: joi.number().required(),
  password: joi.string().required()
})