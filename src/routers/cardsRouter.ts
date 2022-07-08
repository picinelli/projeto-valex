import { Router } from "express";
import { createCard } from "../controllers/cardsController.js";
import { validateApiKeyAndCardType } from "../middlewares/validateApiKeyAndCardTypeMiddleware.js";

const cardsRouter = Router()

cardsRouter.post("/create-card", validateApiKeyAndCardType, createCard)

export default cardsRouter