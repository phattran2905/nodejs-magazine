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

authRouter(adminRouter);
adminRouter.use(authUtils.checkAuthenticatedAdmin);
indexRouter(adminRouter);
administratorRouter(adminRouter);

module.exports = adminRouter;