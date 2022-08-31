import request from 'supertest'

import app from './app'

describe('app', () => {
	test('response with a 404 error', (done) => {
		request(app)
			.get('/unknown-route')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(404, done)
	})
})

describe('GET /', () => {
	test('response with a json message', (done) => {
		request(app)
			.get('/')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(
				200,
				{
					message: 'Hello World 🧑‍🍳',
				},
				done
			)
	})
})
