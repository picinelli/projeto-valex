import { Router } from "express";
import { activateCard, createCard } from "../controllers/cardsController.js";
import { validateApiKeyAndCardType } from "../middlewares/validateApiKeyAndCardTypeMiddleware.js";

const cardsRouter = Router()

cardsRouter.post("/create-card", validateApiKeyAndCardType, createCard)
cardsRouter.post("/activate-card", activateCard)

export default cardsRouter