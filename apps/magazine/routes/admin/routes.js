const indexRouter = require('./indexRouter');
const authRouter = require('./authRouter');
const administratorRouter = require('./administratorRouter');
const authorRouter = require('./authorRouter');
const articleRouter = require('./articleRouter');
const profileRouter = require('./profileRouter');
const menuRouter = require('./menuRouter');
const categoryRouter = require('./categoryRouter');
const commentRouter = require('./commentRouter');
const audienceRouter = require('./audienceRouter');
// const accountRouter = require('./account');

module.exports = [
    indexRouter, authRouter, administratorRouter, authorRouter, articleRouter, profileRouter, categoryRouter, menuRouter, commentRouter,
    audienceRouter
]