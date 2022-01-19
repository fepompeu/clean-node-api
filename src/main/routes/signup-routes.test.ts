import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {
  test('should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Felipe',
        email: 'felipe@mail.com',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(200)
  })
})
