import joi from "joi"

export const cardActivationSchema = joi.object({
  id: joi.number().required(),
  securityCode: joi.number().required(),
  password: joi.string().required()
})