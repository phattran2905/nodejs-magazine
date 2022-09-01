import express from 'express'
import morgan from 'morgan'
import apiRoutes from './api'
import MessageResponse from './interfaces/MessageResponse'
import * as middlewares from './middlewares'

require('dotenv').config()
const app = express()

app.use(morgan('dev'))
app.use(express.json())

app.get<{}, MessageResponse>('/', (req, res) => {
	res.json({
		message: 'Hello World 🧑‍🍳',
	})
})

app.use('/api/v1', apiRoutes)

app.use(middlewares.notFound)
app.use(middlewares.errorHandler)

export default app
