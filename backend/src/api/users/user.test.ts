import request from 'supertest'
import app from '../../app'
import { client } from '../../database'
import { Users } from './user.model'

beforeEach(async () => {
  try {
    await Users.drop()
  } catch (error) {}
})

describe('GET /api/v1/users', () => {
  test('response with an array of users', () =>
    request(app)
      .get('/api/v1/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('length')
      }))
})

describe('GET /api/v1/users', () => {
  test('response with an array of users', () =>
    request(app)
      .get('/api/v1/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('length')
      }))
})

describe('POST /api/v1/users', () => {
  test('response with an error if the user is invalid', () =>
    request(app)
      .post('/api/v1/users')
      .set('Accept', 'application/json')
      .send({})
      .expect('Content-Type', /json/)
      .expect(422)
      .then((response) => {
        expect(response.body).toHaveProperty('message')
      }))
})
