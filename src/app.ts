import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import path from 'path'
import connectDb from './database'
import routes from './routes'
import session from 'express-session'
import flash from 'express-flash'

// Load environment variables
dotenv.config()
// Connect to database
connectDb()

// Express Server
const app = express()
// Middleware
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(
  session({
    name: 'magazine',
    secret: process.env.SECRET_KEY ?? 'phatductran_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 3600 * 1000 * 7
    }
  })
)
app.use(flash())

// View template
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../views'))
app.use('/static', express.static(path.join(__dirname, '../public/user')))
app.use('/admin/static', express.static(path.join(__dirname, '../public/admin')))

// Routes
app.use(routes)
// app.use((req, res) => res.render('error/user-404'))

export default app
