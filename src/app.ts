import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import passport from 'passport'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import flash from 'express-flash'
import path from 'path'
// import passportSetup from './config/passport-setup'

dotenv.config()

const app = express()
// const MongoStore = require('connect-mongo')(session)

// // Connect to database
mongoose.connect(process.env.DATABASE_URI || 'mongodb://localhost/nodejs_magazine')
mongoose.connection.once('open', () => console.log('Successfully connected to database'))
mongoose.connection.on('error', () => {
  console.error.bind(console, 'connection error:')
})

// app.set('view engine', 'ejs')
// app.set('views', path.join(__dirname, 'views'))
// //  middleware
// app.use('/static', express.static(path.join(__dirname, 'public/user')))
// app.use('/avatar', express.static(path.join(__dirname, 'uploaded_files/avatar_img')))
// app.use(
//   '/thumbnail',
//   express.static(path.join(__dirname, 'uploaded_files/thumbnail_img'))
// )
// app.use('/admin/static', express.static(path.join(__dirname, 'public/admin/')))
// app.use(express.urlencoded({ extended: false }))
// app.use(cookieParser())
// app.use(
//   session({
//     name: 'user.id',
//     store: new MongoStore({ mongooseConnection: mongoose.connection }),
//     secret: process.env.SECRET_KEY || 'phatductran_secret_key',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       maxAge: 24 * 3600 * 1000 * 7,
//     },
//   })
// )
// app.use(flash())
// passportSetup(passport)
// app.use(passport.initialize())
// app.use(passport.session())
// app.use(passport.authenticate('remember-me'))
// Routes for Users
// app.use(require('./routes/user/routes'))

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
