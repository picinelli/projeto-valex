import { Router } from "express";
import { activateCard, blockCard, createCard } from "../controllers/cardsController.js";
import { validateApiKeyAndCardType } from "../middlewares/validateApiKeyAndCardTypeMiddleware.js";

const cardsRouter = Router()

cardsRouter.post("/create-card", validateApiKeyAndCardType, createCard)
cardsRouter.post("/activate-card", activateCard)
cardsRouter.post("/block-card", blockCard)

export default cardsRouter