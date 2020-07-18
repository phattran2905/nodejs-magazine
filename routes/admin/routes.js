const indexRouter = require('./indexRouter');
const authRouter = require('./authRouter');
const administratorRouter = require('./administratorRouter');
const authorRouter = require('./authorRouter');
const articleRouter = require('./articleRouter');
const profileRouter = require('./profileRouter');
// const accountRouter = require('./account');
const menuRouter = require('./menuRouter');
const categoryRouter = require('./categoryRouter');

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
    indexRouter, authRouter, administratorRouter, authorRouter, articleRouter
]