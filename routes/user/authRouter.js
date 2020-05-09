const express = require('express');
const authRouter = express.Router();

authRouter.get('/login', async (req,res) => {

    res.render("user/auth/login");
})
authRouter.get('/signup', async (req,res) => {

    res.render("user/auth/signup");
})

module.exports = authRouter;