import supertest from "supertest";
import app from "../app.js";
import { connection } from "../database.js";
import cardsFactory from "./factories/cardsFactory.js";

beforeEach(async () => {
  return await connection.query(`DELETE FROM cards WHERE "employeeId" = 1`)
})

describe("Create card Endpoint tests", () => {
  it("Given non-existent employeeId, should return 400", async () => {
    const status = await supertest(app)
      .post("/create-card")
      .set({ "x-api-key": "zadKLNx.DzvOVjQH01TumGl2urPjPQSxUbf67vs0" })
      .send({ employeeId: -50000000 });
    expect(status.statusCode).toBe(400);
  });

  it("Given wrong company API key, should return 400", async () => {
    const status = await supertest(app)
      .post("/create-card")
      .set({ "x-api-key": "wrongkey" });

    expect(status.statusCode).toBe(400);
  });

  it("Given wrong type of card type, should return 400", async () => {
    const status = await supertest(app)
      .post("/create-card")
      .set({ "x-api-key": "zadKLNx.DzvOVjQH01TumGl2urPjPQSxUbf67vs0" })
      .send({ employeeId: 1, type: "wrongtype" });
    expect(status.statusCode).toBe(400);
  });

  it("Given valid card info, should return 201", async () => {
    const cardInfo = cardsFactory.createCardInfo()
    const status = await supertest(app)
    .post("/create-card")
    .set({ "x-api-key": "zadKLNx.DzvOVjQH01TumGl2urPjPQSxUbf67vs0" })
    .send(cardInfo);

  expect(status.statusCode).toBe(201);
  })

  it("Given already created card type, should return 400", async () => {
    const cardInfo = cardsFactory.createCardInfo()
    await supertest(app)
    .post("/create-card")
    .set({ "x-api-key": "zadKLNx.DzvOVjQH01TumGl2urPjPQSxUbf67vs0" })
    .send(cardInfo);

    const secondCardCreation = await supertest(app)
    .post("/create-card")
    .set({ "x-api-key": "zadKLNx.DzvOVjQH01TumGl2urPjPQSxUbf67vs0" })
    .send(cardInfo);

  expect(secondCardCreation.statusCode).toBe(400);
  })
});

