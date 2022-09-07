import request from 'supertest'
import bcrypt from 'bcrypt'
import app from '../../app'
import { Users, User } from './user.model'

let templateUser = {
  username: 'jennie',
  email: 'jennie@blackpink.com',
  password: '123',
}

beforeAll(async () => {
  try {
    await Users.drop()
    const insertUser = await User.parseAsync(templateUser)

    const hashedPassword = await bcrypt.hash(insertUser.password, 10)
    await Users.insertOne({
      ...insertUser,
      password: hashedPassword,
    })
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

let newUser = {
  id: '',
  username: 'rosie',
  email: 'rosie@blackpink.com',
  password: '1234',
}

describe('POST /api/v1/users', () => {
  test('response with an invalid email error', () =>
    request(app)
      .post('/api/v1/users')
      .set('Accept', 'application/json')
      .send({
        ...newUser,
        email: 'lisa-black-pink',
      })
      .expect('Content-Type', /json/)
      .expect(422)
      .then((response) => {
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Invalid validation.')
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveProperty('length')
        expect(response.body.errors.length).toBeGreaterThan(0)
        expect(response.body.errors[0]).toHaveProperty('message')
        expect(response.body.errors[0].message).toBe('Invalid email address.')
        expect(response.body.errors[0]).toHaveProperty('path')
        expect(response.body.errors[0].path).toHaveProperty('length')
        expect(response.body.errors[0].path.length).toBeGreaterThan(0)
        expect(response.body.errors[0].path[0]).toBe('email')
      }))

  test('response with an existing email error', () =>
    request(app)
      .post('/api/v1/users')
      .set('Accept', 'application/json')
      .send({
        ...newUser,
        email: templateUser.email,
      })
      .expect('Content-Type', /json/)
      .expect(422)
      .then((response) => {
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Invalid validation.')
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveProperty('length')
        expect(response.body.errors.length).toBeGreaterThan(0)
        expect(response.body.errors[0]).toHaveProperty('message')
        expect(response.body.errors[0].message).toBe('Email already existed.')
        expect(response.body.errors[0]).toHaveProperty('path')
        expect(response.body.errors[0].path).toHaveProperty('length')
        expect(response.body.errors[0].path.length).toBeGreaterThan(0)
        expect(response.body.errors[0].path[0]).toBe('email')
      }))

  test('response with the user object', () =>
    request(app)
      .post('/api/v1/users')
      .set('Accept', 'application/json')
      .send(newUser)
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('OK')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveProperty('_id')
        // id = response.body.data._id
        newUser.id = response.body.data._id
        expect(response.body.data).toHaveProperty('username')
        expect(response.body.data.username).toBe(newUser.username)
        expect(response.body.data).toHaveProperty('email')
        expect(response.body.data.email).toBe(newUser.email)
      }))
})

describe('GET /api/v1/users/:id', () => {
  test('response with a single user', () =>
    request(app)
      .put(`/api/v1/users/${newUser.id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('OK')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveProperty('_id')
        expect(response.body.data._id).toBe(newUser.id)
        expect(response.body.data).toHaveProperty('username')
        expect(response.body.data.username).toBe(newUser.username)
        expect(response.body.data).toHaveProperty('email')
        expect(response.body.data.email).toBe(newUser.email)
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
      .put(`/api/v1/users/${newUser.id}`)
      .send({
        username: 'lisa',
        email: 'lisa@blackpink.com',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('OK')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveProperty('_id')
        expect(response.body.data._id).toBe(newUser.id)
        expect(response.body.data).toHaveProperty('username')
        expect(response.body.data.username).toBe('lisa')
        expect(response.body.data).toHaveProperty('email')
        expect(response.body.data.email).toBe('lisa@blackpink.com')
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
      .delete(`/api/v1/users/${newUser.id}`)
      .expect(204, done)
  })
  test('response with a not found error', (done) => {
    request(app)
      .delete(`/api/v1/users/${newUser.id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done)
  })
})
