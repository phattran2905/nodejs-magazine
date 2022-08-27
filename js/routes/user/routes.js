const articleRouter = require('./articleRouter');
const authRouter = require('./authRouter');
const commentRouter = require('./commentRouter');
const indexRouter = require('./indexRouter');
const profileRouter = require('./profileRouter');

module.exports = [
    indexRouter, articleRouter, authRouter, commentRouter, profileRouter
]