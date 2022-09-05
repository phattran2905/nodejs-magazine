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
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('OK')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveProperty('length')
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
        expect(response.body.message).toBe('Invalid Validation.')
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveProperty('length')
        expect(response.body.errors.length).toBeGreaterThan(0)
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
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('OK')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveProperty('_id')
        id = response.body.data._id
        expect(response.body.data).toHaveProperty('username')
        expect(response.body.data.username).toBe('jennie')
        expect(response.body.data).toHaveProperty('email')
        expect(response.body.data.email).toBe('jennie@blackpink.com')
        expect(response.body.data).toHaveProperty('token')
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
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('OK')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveProperty('_id')
        expect(response.body.data._id).toBe(id)
        expect(response.body.data).toHaveProperty('username')
        expect(response.body.data.username).toBe('jennie')
        expect(response.body.data).toHaveProperty('email')
        expect(response.body.data.email).toBe('jennie@blackpink.com')
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
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('OK')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveProperty('_id')
        expect(response.body.data._id).toBe(id)
        expect(response.body.data).toHaveProperty('username')
        expect(response.body.data.username).toBe('rosie')
        expect(response.body.data).toHaveProperty('email')
        expect(response.body.data.email).toBe('rosie@blackpink.com')
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
    request(app).delete(`/api/v1/users/${id}`).expect(204, done)
  })
  test('response with a not found error', (done) => {
    request(app)
      .delete(`/api/v1/users/${id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done)
  })
})
