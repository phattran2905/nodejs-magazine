import express from 'express'
import morgan from 'morgan'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(__dirname, '../.env') })
const app = express()

app.use(morgan('dev'))
app.use(express.json())

app.get('/', (req, res) => {
	res.json({
		message: 'Hello World',
	})
})

export default app
