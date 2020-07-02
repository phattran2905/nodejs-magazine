const express = require('express');
const adminRouter = express.Router();
const authUtils = require('../../utils/authUtils');
// Routers
const indexRouter = require('./indexRouter');
const authRouter = require('./authRouter');
const profileRouter = require('./profileRouter');
// const accountRouter = require('./account');
const categoryRouter = require('./categoryRouter');
const articleRouter = require('./articleRouter');
const authorRouter = require('./authorRouter');
const administratorRouter = require('./administratorRouter');

authRouter(adminRouter);
adminRouter.use(authUtils.checkAuthenticatedAdmin);
indexRouter(adminRouter);
profileRouter(adminRouter);
// accountRouter(adminRouter);
categoryRouter(adminRouter);
articleRouter(adminRouter);
authorRouter(adminRouter);
administratorRouter(adminRouter);

module.exports = adminRouter;