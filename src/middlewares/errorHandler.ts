import { Errback, NextFunction, Request, Response } from "express";

export default function errorHandler(error, req: Request, res: Response, next: NextFunction ) {
  if(error.message) {
    return res.status(error.type).send(error.message)
  }

  console.log(error)
  return res.sendStatus(500)
}