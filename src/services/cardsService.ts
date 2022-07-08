import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import Cryptr from "cryptr";

import {
  Card,
  CardInsertData,
  findByTypeAndEmployeeId,
  insert,
} from "../repositories/cardRepository.js";
import { Company, findByApiKey } from "../repositories/companyRepository.js";
import { Employee, findById } from "../repositories/employeeRepository.js";

export async function createCard(
  body: {
    employeeId: number;
    type: "groceries" | "restaurant" | "transport" | "education" | "health";
  },
  API: string
) {
  const company = await findByApiKey(API);
  const user = await findById(body.employeeId);
  const cardType = await findByTypeAndEmployeeId(body.type, body.employeeId);

  const cryptr = new Cryptr(process.env.CRYPTR_PASS);

  validateInfo(company, user, cardType);

  const cardholderName = createUserCardName(user.fullName);
  const number = faker.finance.creditCardNumber("63[7-9]#-####-####-###L");
  const expirationDate = dayjs().add(5, "years").format("MM/YY");
  const securityCode = cryptr.encrypt(faker.finance.creditCardCVV());

  const cardInfo: CardInsertData = {
    employeeId: body.employeeId,
    number,
    cardholderName,
    securityCode,
    expirationDate,
    password: null,
    isVirtual: false,
    originalCardId: null,
    isBlocked: true,
    type: body.type,
  };
  return await insert(cardInfo);
}

function validateInfo(company: Company, user: Employee, cardType: Card) {
  if (!company) {
    throw {
      type: 404,
      message: "Company not identified!",
    };
  }
  if (!user) {
    throw {
      type: 404,
      message: "User not identified!",
    };
  }
  if (cardType) {
    throw {
      type: 400,
      message: "Card Type already exists!",
    };
  }
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
