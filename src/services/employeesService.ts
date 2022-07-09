import * as cardRepository from "../repositories/cardRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import throwError from "../utils/throwError.js";

export async function getBalanceAndTransactions(id: string) {
  const cardId = parseInt(id)
  const transactions = await paymentRepository.findByCardId(cardId)
  const recharges = await rechargeRepository.findByCardId(cardId)

  if(!transactions) throwError("Error on fetch transactions")
  if(!recharges) throwError("Error on fetch recharges")

  const transactionsAmount = getSumOfAmount(transactions)
  const rechargesAmount = getSumOfAmount(recharges)

  const balanceAndTransactions = {
    "balance": rechargesAmount - transactionsAmount,
    "transactions": transactions,
    "recharges": recharges
  }

  return balanceAndTransactions
}

function getSumOfAmount(arr: any[]) {
  let sum = 0
  arr.forEach(e => {sum+= e.amount});
  return sum
}