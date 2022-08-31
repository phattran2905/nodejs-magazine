import { client } from './database'

global.afterAll(async () => {
	await client.close
})
