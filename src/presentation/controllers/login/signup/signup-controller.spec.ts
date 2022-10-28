import { SignUpController } from './singup-controller'
import { EmailInUseError, MissingParamError, ServerError } from '../../../errors'
import { AddAccount, AddAccountModel, AccountModel, HttpRequest, Validation } from './signup-controller-protocols'
import { badRequest, forbidden, serverError } from '../../../helpers/http/http-helper'
import { Authentication, AuthenticationModel } from '../login/login-controller-protocols'

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }
  return new AuthenticationStub()
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication()
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub
  }
}

describe('SingUp Controller', () => {
  it('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')

    await sut.handle(makeFakeRequest())

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  it('should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(null))
  })

  it('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({ accessToken: 'any_token' })
  })

  it('should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')

    await sut.handle(makeFakeRequest())

    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })

  it('should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  it('should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(new Promise(resolve => resolve(null)))

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  test('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')

    await sut.handle(makeFakeRequest())

    const { email, password } = makeFakeRequest().body

    expect(authSpy).toHaveBeenCalledWith({ email, password })
  })

  test('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
