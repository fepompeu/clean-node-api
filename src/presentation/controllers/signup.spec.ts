import { SignUpControler } from './singup'

describe('SingUp Controller', () => {
  it('should return 400 if no name is provided', () => {
    const sut = new SignUpControler()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})