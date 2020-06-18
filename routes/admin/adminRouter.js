const express = require('express');
const adminRouter = express.Router();
const adminPassport = require('../../passports/adminPassport');
const session = require('express-session');
const adminPassportSetup = require('../../config/passport-admin');

// Routers
const indexRouter = require('./index');
const authRouter = require('./auth');
adminRouter.use(session({
    name: 'admin_sid',
    secret: "secret_key for @admin",
    resave: false,
    saveUninitialized: false,
    cookie: {
        name: 'admin_sessionID',
        path: '/admin/',
        maxAge: 24*3600*1000*7,
        sameSite: true,
    }
}));

// adminRouter.use(adminPassport.initialize());
// adminRouter.use(adminPassport.session());
// adminPassportSetup(passport);

authRouter(adminRouter, {passport: adminPassport});
indexRouter(adminRouter, {passport: adminPassport});

module.exports = adminRouter;