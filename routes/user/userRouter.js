const express = require('express');
const userRouter = express.Router();
const authUtils = require('../../utils/authUtils');

// Routers
const indexRouter = require('./indexRouter');
const authRouter = require('./authRouter');
const profileRouter = require('./profileRouter');

authRouter(userRouter);
indexRouter(userRouter);
userRouter.use((req,res, next) => { 
    if(req.url.match('/admin')) {
        return next();
    }else {
        return authUtils.checkAuthenticatedAuthor(req, res, next);
    }
});
profileRouter(userRouter);

module.exports = userRouter;