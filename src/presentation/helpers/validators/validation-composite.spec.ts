import { MissingParamError } from '../../errors'
import { ValidationComposite } from './validation-composite'
import { Validation } from '../../protocols/validator'

interface SutTypes{
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeValidationStubs = (): Validation => {
  class ValidationStubs implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStubs()
}

const makeSut = (): SutTypes => {
  const validationStubs = [
    makeValidationStubs(),
    makeValidationStubs()
  ]
  const sut = new ValidationComposite(validationStubs)
  return {
    sut,
    validationStubs
  }
}

describe('ValidationComposite', () => {
  test('should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))

    const error = sut.validate({ field: 'any_value' })

    expect(error).toEqual(new MissingParamError('field'))
  })

  test('should return the first error if more than one validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))

    const error = sut.validate({ field: 'any_value' })

    expect(error).toEqual(new Error())
  })

  test('should not return if validation succeeds', () => {
    const { sut } = makeSut()

    const error = sut.validate({ field: 'any_value' })

    expect(error).toBeFalsy()
  })
})
