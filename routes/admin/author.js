const express = require('express');
const userRouter = express.Router();
const authUtils = require("../../utils/auth");
const commonUtils = require("../../utils/common");
const AuthorModel = require('../../models/AuthorModel');

userRouter.get(
    '/authors' , 
    authUtils.checkAuthenticatedAdmin,
    async (req,res) => {
    const authors = await AuthorModel.find();
    res.render(
        'admin/author/author',
        {
            authors: authors,
            loggedAdmin: commonUtils.getLoggedAccount(req.user)
        });
});

userRouter.post(
    '/authors', 
    (req,res) => {
    res.render('admin/author');
})

module.exports = userRouter;