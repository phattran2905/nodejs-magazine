import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import path from 'path'
import connectDb from './database'
import homeRoutes from './client/home/home.route'

dotenv.config()
connectDb()

const app = express()

app.use(morgan('dev'))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../views'))
app.use('/static', express.static(path.join(__dirname, 'public/user')))

app.get('/', (req, res) => {
  res.send('Cooking Blog 🧑‍🍳')
})
app.use(homeRoutes)

app.use((req, res) => res.render('error/user-404'))

export default app
