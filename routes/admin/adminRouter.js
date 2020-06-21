const express = require('express');
const adminRouter = express.Router();
const session = require('express-session');
const passport = require('../../server').passport;
const adminPassport = require('../../passports/adminPassport');
const authUtils = require('../../utils/authUtils');
// Routers
const indexRouter = require('./index');
const authRouter = require('./auth');
const administratorRouter = require('./administrator');

// app.use(session({
//     name: 'admin_sid',
//     secret: "secret_key for @admin",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         name: 'admin_sessionID',
//         path: '/admin/',
//         maxAge: 24*3600*1000*7,
//         sameSite: true,
//     }
// }));
// adminRouter.use(adminPassport.initialize());
// adminRouter.use(adminPassport.session());
// adminPassportSetup(passport);
authRouter(adminRouter);
// authRouter(adminRouter, {passport: adminPassport});
// adminRouter.use(authUtils.checkAuthenticatedAdmin);
// indexRouter(adminRouter, {passport: adminPassport});
// administratorRouter(adminRouter, {passport: adminPassport});
indexRouter(adminRouter);
administratorRouter(adminRouter);

module.exports = adminRouter;