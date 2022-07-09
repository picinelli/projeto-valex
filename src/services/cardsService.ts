import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import Cryptr from "cryptr";
import bcrypt from "bcrypt";

import * as cardRepository from "../repositories/cardRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import throwError from "../utils/throwError.js";

export async function createCard(
  body: {
    employeeId: number;
    type: "groceries" | "restaurant" | "transport" | "education" | "health";
  },
  API: string
) {
  const company = await companyRepository.findByApiKey(API);
  const user = await employeeRepository.findById(body.employeeId);
  const cardType = await cardRepository.findByTypeAndEmployeeId(
    body.type,
    body.employeeId
  );

  const cryptr = new Cryptr(process.env.CRYPTR_PASS);

  validateInfo(company, user, cardType);

  const cardholderName = createUserCardName(user.fullName);
  const number = faker.finance.creditCardNumber("63[7-9]#-####-####-###L");
  const expirationDate = dayjs().add(5, "years").format("MM/YY");
  const securityCode = faker.finance.creditCardCVV()
  const encryptedSecurityCode = cryptr.encrypt(securityCode)

  const cardInfo: cardRepository.CardInsertData = {
    employeeId: body.employeeId,
    number,
    cardholderName,
    securityCode: encryptedSecurityCode,
    expirationDate,
    password: null,
    isVirtual: false,
    originalCardId: null,
    isBlocked: true,
    type: body.type,
  };

  await cardRepository.insert(cardInfo);
  return securityCode
}

export async function activateCard(cardInfo: {
  id: number;
  securityCode: string;
  password: string;
}) {
  const { id, securityCode, password } = cardInfo;
  const saltRounds = 10
  const hashPassword = bcrypt.hashSync(password, saltRounds);

  const card = await cardRepository.findById(id);
  if (!card) throwError("Card not identified!");

  await validateActivationCardInfo(card, securityCode, password);
  await cardRepository.update(card.id, {isBlocked: false, password: hashPassword})
}

//Utils and validation functions
function validateInfo(
  company: companyRepository.Company,
  user: employeeRepository.Employee,
  cardType: cardRepository.Card
) {
  if (!company) throwError("Company not identified!");
  if (!user) throwError("User not identified!");
  if (cardType) throwError("Card Type already exists!");
}

function createUserCardName(name: string) {
  const arr = name.split(" ");
  const lastName = arr.length - 1;
  arr[0] = arr[0].toUpperCase();
  arr[lastName] = arr[lastName].toUpperCase();

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].length < 3) {
      arr.splice(i, 1);
    }
    if (i !== 0 && i !== arr.length - 1) {
      arr[i] = arr[i][0].toUpperCase();
    }
  }
  return arr.join(" ");
}

async function validateActivationCardInfo(
  card: cardRepository.Card,
  securityCode: string,
  password: string
) {

  const cryptr = new Cryptr(process.env.CRYPTR_PASS);
  const decryptedCVC = cryptr.decrypt(card.securityCode);
  const numberedPass = +password

  if (isCardExpired(card.expirationDate)) throwError("This card is expired!");
  if (card.password) throwError("This card is already activated!");
  if (decryptedCVC !== securityCode) throwError("Security code is incorrect!");
  if (password.length !== 4) throwError("Password size incorrect (4)");
  if(typeof(numberedPass) !== 'number') throwError("Password must be 4 numbers");
}

function isCardExpired(date: string) {
  const month = parseInt(date.split("/")[0]);
  const year = parseInt(date.split("/")[1]) + 2000;
  const expirationDate = new Date(year, month);
  const now = new Date();

  if (now >= expirationDate) return true;
  return false;
}
