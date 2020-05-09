const userRouter = require("./user/index");
const adminRouter = require("./admin/index");
const categoryRouter = require("./admin/category");
const accountRouter = require("./admin/account");
const authRouter = require("./admin/auth");
const administratorRouter = require("./admin/administrator");
const authorRouter = require("./admin/author");
const articleRouter = require("./admin/article");

module.exports = {
    // user
    userRouter: userRouter,
    // admin
    adminRouter: adminRouter, 
    categoryRouter: categoryRouter, 
    accountRouter: accountRouter,
    authRouter: authRouter,
    administratorRouter: administratorRouter,
    authorRouter: authorRouter,
    articleRouter: articleRouter
}