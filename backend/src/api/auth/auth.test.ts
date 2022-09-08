import request from 'supertest'
import app from '../../app'
import {  Users } from '../users/user.model'

let templateUser = {
  username: 'jennie',
  email: 'jennie@blackpink.com',
  password: '123',
}

const newUser = {
  email: 'lisa@blackpink.com',
  password: '1234',
  confirmPassword: '1234',
}

beforeAll(async () => {
  try {
    await Users.drop()
  } catch (error) {}
})


describe('POST /api/v1/signup', () => {
  test('response with an invalid email error', () =>
    request(app)
      .post('/api/v1/signup')
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

  test('response with an invalid password error', () =>
    request(app)
      .post('/api/v1/signup')
      .set('Accept', 'application/json')
      .send({
        ...newUser,
        password: '123',
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
        expect(response.body.errors[0].message).toBe(
          'Password must be at least 4 characters'
        )
        expect(response.body.errors[0]).toHaveProperty('path')
        expect(response.body.errors[0].path).toHaveProperty('length')
        expect(response.body.errors[0].path.length).toBeGreaterThan(0)
        expect(response.body.errors[0].path[0]).toBe('password')
      }))

  test('response with a not matching passwords error', () =>
    request(app)
      .post('/api/v1/signup')
      .set('Accept', 'application/json')
      .send({
        ...newUser,
        confirmPassword: 'not-matching-password',
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
        expect(response.body.errors[0].message).toBe("Passwords don't match")
        expect(response.body.errors[0]).toHaveProperty('path')
        expect(response.body.errors[0].path).toHaveProperty('length')
        expect(response.body.errors[0].path.length).toBeGreaterThan(0)
        expect(response.body.errors[0].path[0]).toBe('confirmPassword')
      }))

  test('response with an access token', () =>
    request(app)
      .post('/api/v1/signup')
      .set('Accept', 'application/json')
      .send(newUser)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('OK')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveProperty('email')
        expect(response.body.data.email).toBe(newUser.email)
        expect(response.body.data).toHaveProperty('accessToken')
      }))

  test('response with an existing email error', () =>
    request(app)
      .post('/api/v1/signup')
      .set('Accept', 'application/json')
      .send(newUser)
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
})

describe('POST /api/v1/login', () => {
  test('response with a not found email error', (done) => {
    request(app)
      .post('/api/v1/login')
      .set('Accept', 'application/json')
      .send({
        email: 'not-found@email.com',
        password: newUser.password,
      })
      .expect('Content-Type', /json/)
      .expect(404, done)
  })

  test('response with an incorrect password error', (done) => {
    request(app)
      .post('/api/v1/login')
      .set('Accept', 'application/json')
      .send({
        email: newUser.email,
        password: 'incorrect-password',
      })
      .expect('Content-Type', /json/)
      .expect(401, done)
  })

  test('response with an access token', () =>
    request(app)
      .post('/api/v1/login')
      .set('Accept', 'application/json')
      .send({
        email: newUser.email,
        password: newUser.password,
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('OK')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveProperty('email')
        expect(response.body.data.email).toBe(newUser.email)
        expect(response.body.data).toHaveProperty('accessToken')
      }))
})
