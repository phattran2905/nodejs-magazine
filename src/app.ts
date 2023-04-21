import express from 'express'
import dotenv from 'dotenv'
import passport from 'passport'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import flash from 'express-flash'
import path from 'path'
// import passportSetup from './config/passport-setup'
import helmet from 'helmet';
import morgan from 'morgan';
import {store} from './config/database';
import clientRoutes from './routes/client/index.router';

// Load environment variables
dotenv.config()

const app = express()
// Middlewares
app.use(helmet())
app.use(morgan("dev"))

// View engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../views'))
// Set path
app.use('/static', express.static(path.join(__dirname, '../public/user')))
app.use('/avatar', express.static(path.join(__dirname, '../uploaded_files/avatar_img')))
app.use(
  '/thumbnail',
  express.static(path.join(__dirname, '../uploaded_files/thumbnail_img'))
)
app.use('/admin/static', express.static(path.join(__dirname, '../public/admin/')))

app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(
  session({
    name: 'user.id',
    store: store,
    secret: process.env.SECRET_KEY || 'phatductran_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 3600 * 1000 * 7,
    },
  })
)
app.use(flash())
// passportSetup(passport)
// app.use(passport.initialize())
// app.use(passport.session())
// app.use(passport.authenticate('remember-me'))

// Routes for Users
app.use(clientRoutes)

// Routes for Administration
// app.use(
//   '/admin',
//   (req, res, next) => {
//     const authUtils = require('./utils/authUtils')
//     if (req.url === '/login') {
//       return authUtils.checkNotAuthenticatedAdmin(req, res, next)
//     } else {
//       return authUtils.checkAuthenticatedAdmin(req, res, next)
//     }
//   },
//   require('./routes/admin/routes')
// )

app.get("/", (req,res) => res.json("Magazine"))

export default app
