import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

let accountCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('should return 200 on signup', async () => {
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

  describe('POST /login', () => {
    test('should return 200 on login', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'Felipe',
        email: 'felipe@mail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'felipe@mail.com',
          password: '123'
        })
        .expect(200)
    })

    test('should return 401 when login fails', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'felipe@mail.com',
          password: '123'
        })
        .expect(401)
    })
  })
})
