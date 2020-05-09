const userRouter = require("./user/indexRouter");
const user_authRouter = require("./user/authRouter");
// admin
const adminRouter = require("./admin/index");
const categoryRouter = require("./admin/category");
const accountRouter = require("./admin/account");
const admin_authRouter = require("./admin/auth");
const administratorRouter = require("./admin/administrator");
const authorRouter = require("./admin/author");
const articleRouter = require("./admin/article");

module.exports = {
    // user
    userRouter: userRouter,
    user_authRouter: user_authRouter,
    // admin
    adminRouter: adminRouter, 
    categoryRouter: categoryRouter, 
    accountRouter: accountRouter,
    admin_authRouter: admin_authRouter,
    administratorRouter: administratorRouter,
    authorRouter: authorRouter,
    articleRouter: articleRouter
}