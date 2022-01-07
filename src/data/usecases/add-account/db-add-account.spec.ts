import { DbAddAccount } from './db-add-account'

const accountData = {
  name: 'any_name',
  email: 'any_email',
  password: 'any_password'
}

describe('DbAddAccount Usecase', () => {
  test('should call Encrypter with correct password ', async () => {
    class EncrypterStub {
      async encrypt (value: string): Promise<string> {
        return await new Promise(resolve => resolve('hashed_password'))
      }
    }
    const encrypterStup = new EncrypterStub()
    const sut = new DbAddAccount(encrypterStup)
    const encryptSpy = jest.spyOn(encrypterStup, 'encrypt')
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
  })
})
