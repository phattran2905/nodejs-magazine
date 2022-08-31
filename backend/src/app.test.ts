import request from 'supertest'

import app from './app'

describe('GET /', () => {
	test('response with a json message', (done) => {
		request(app)
			.get('/')
			.set('Accept', 'application/json')
			// .then((res) => {
			// 	expect(res.headers['content-type']).toMatch(/json/)
			// 	expect(res.statusCode).toBe(200)
			// 	expect(res.body.message).toBe('Hello World')
			// 	done()
			// })

			.expect('Content-Type', /json/)
			.expect(
				200,
				{
					message: 'Hello World',
				},
				done
			)
	})
})
