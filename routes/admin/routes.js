const express = require('express');
const adminRouter = express.Router();
const authUtils = require('../../utils/authUtils');
// Routers
const indexRouter = require('./indexRouter');
const authRouter = require('./authRouter');
const administratorRouter = require('./administratorRouter');
const profileRouter = require('./profileRouter');
// const accountRouter = require('./account');
const menuRouter = require('./menuRouter');
const categoryRouter = require('./categoryRouter');
const articleRouter = require('./articleRouter');
const authorRouter = require('./authorRouter');

// authRouter(adminRouter);
// // adminRouter.use(authUtils.checkAuthenticatedAdmin);
// indexRouter(adminRouter);
// profileRouter(adminRouter);
// // accountRouter(adminRouter);
// menuRouter(adminRouter);
// categoryRouter(adminRouter);
// articleRouter(adminRouter);
// authorRouter(adminRouter);
// administratorRouter(adminRouter);

module.exports = [
    indexRouter, authRouter, administratorRouter
]