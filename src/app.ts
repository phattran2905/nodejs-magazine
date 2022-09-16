import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import connectDb from './database'

dotenv.config()
connectDb()

const app = express()

app.use(morgan('dev'))

app.use('/', (req, res) => {
  res.send('Cooking Blog 🧑‍🍳')
})

export default app
