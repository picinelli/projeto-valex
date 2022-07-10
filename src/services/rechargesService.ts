import * as cardRepository from "../repositories/cardRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import isCardExpired from "../utils/checkCardExpiration.js";
import throwError from "../utils/throwError.js";

export async function rechargeCard(rechargeInfo: {cardId: number, amount: number}) {
  const {amount, cardId} = rechargeInfo
  const card = await cardRepository.findById(cardId)

  if(amount < 1) throwError("Insert a minimum amount of 1")
  if(!card) throwError("Card was not found!")
  if(!card.password) throwError("You must activate your card")
  if(isCardExpired(card.expirationDate)) throwError("Your card is expired")

  await rechargeRepository.insert(rechargeInfo)
}