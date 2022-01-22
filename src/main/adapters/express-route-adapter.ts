import { Controller, HttpRequest } from '../../presentation/protocols'
import { Request, Response } from 'express'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse = await controller.handle(httpRequest)
    // TODO: Create a test for condition below
    if (httpResponse.statusCode === 500) {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
