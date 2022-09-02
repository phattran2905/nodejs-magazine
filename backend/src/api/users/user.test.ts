import request from 'supertest'
import app from '../../app'
import { Users } from './user.model'

beforeAll(async () => {
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

let id = ''

describe('POST /api/v1/users', () => {
  test('response with errors if the user is invalid', () =>
    request(app)
      .post('/api/v1/users')
      .set('Accept', 'application/json')
      .send({})
      .expect('Content-Type', /json/)
      .expect(422)
      .then((response) => {
        expect(response.body).toHaveProperty('message')
        expect(response.body.message.username).toHaveProperty('_errors')
        expect(response.body.message.email).toHaveProperty('_errors')
      }))

  test('response with the user object', () =>
    request(app)
      .post('/api/v1/users')
      .set('Accept', 'application/json')
      .send({
        username: 'jennie',
        email: 'jennie@blackpink.com',
        password: '123',
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        console.log(response.body)
        expect(response.body).toHaveProperty('_id')
        id = response.body._id
        expect(response.body).toHaveProperty('username')
        expect(response.body.username).toBe('jennie')
        expect(response.body).toHaveProperty('email')
        expect(response.body.email).toBe('jennie@blackpink.com')
        expect(response.body).toHaveProperty('token')
      }))
})

describe('GET /api/v1/users/:id', () => {
  test('response with a single user', () =>
    request(app)
      .put(`/api/v1/users/${id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('_id')
        expect(response.body._id).toBe(id)
        expect(response.body).toHaveProperty('username')
        expect(response.body.username).toBe('jennie')
        expect(response.body).toHaveProperty('email')
        expect(response.body.email).toBe('jennie@blackpink.com')
        // expect(response.body).toHaveProperty('token')
      }))

  test('response with an invalid ObjectId error', (done) => {
    request(app)
      .get(`/api/v1/users/fake-id`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422, done)
  })

  test('response with an not found error', (done) => {
    request(app)
      .get(`/api/v1/users/63101c1dde6f2fedc669bc0c`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done)
  })
})

describe('PUT /api/v1/users/:id', () => {
  test('response with a updated user', () =>
    request(app)
      .put(`/api/v1/users/${id}`)
      .send({
        username: 'rosie',
        email: 'rosie@blackpink.com',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('_id')
        expect(response.body._id).toBe(id)
        expect(response.body).toHaveProperty('username')
        expect(response.body.username).toBe('rosie')
        expect(response.body).toHaveProperty('email')
        expect(response.body.email).toBe('rosie@blackpink.com')
      }))

  test('response with an invalid ObjectId error', (done) => {
    request(app)
      .put(`/api/v1/users/fake-id`)
      .send({})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422, done)
  })
  test('response with a not found error', (done) => {
    request(app)
      .put(`/api/v1/users/63101c1dde6f2fedc669bc0c`)
      .send({})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done)
  })
})

describe('DELETE /api/v1/users/:id', () => {
  test('response with a not found error', (done) => {
    request(app)
      .delete(`/api/v1/users/63101c1dde6f2fedc669bc0c`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done)
  })
  test('response with an invalid ObjectId error', (done) => {
    request(app)
      .delete(`/api/v1/users/fake-id`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422, done)
  })
  test('response with a 204 status code', (done) => {
    request(app)
      .delete(`/api/v1/users/${id}`)
      .expect(204, done)
  })
  test('response with a not found error', (done) => {
    request(app)
      .delete(`/api/v1/users/${id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done)
  })
})
