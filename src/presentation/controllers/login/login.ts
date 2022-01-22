import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.password) {
      return await new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
    } else {
      return await new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
    }
  }
}
