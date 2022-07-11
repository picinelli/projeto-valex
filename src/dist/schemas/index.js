import joi from "joi";
export var cardActivationSchema = joi.object({
    id: joi.number().required(),
    securityCode: joi.number().required(),
    password: joi.string().required()
});
export var cardTransactionsSchema = joi.object({
    id: joi.number().required()
});
export var cardBlockSchema = joi.object({
    id: joi.number().required(),
    password: joi.string().required()
});
export var cardRechargeSchema = joi.object({
    cardId: joi.number().required(),
    amount: joi.number().required()
});
export var paymentSchema = joi.object({
    cardId: joi.number().required(),
    password: joi.string().required(),
    businessId: joi.number().required(),
    amount: joi.number().required()
});
export var paymentOnlineSchema = joi.object({
    number: joi.string().required(),
    cardholderName: joi.string().required(),
    expirationDate: joi.string().required(),
    securityCode: joi.string().required(),
    businessId: joi.number().required(),
    amount: joi.number().required()
});
export var virtualCardCreationSchema = joi.object({
    originalCardId: joi.number().required(),
    password: joi.string().required()
});
export var cardDeleteSchema = joi.object({
    id: joi.number().required(),
    password: joi.string().required()
});
