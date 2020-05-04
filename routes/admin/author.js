const express = require('express');
const authorRouter = express.Router();
const authUtils = require("../../utils/auth");
const commonUtils = require("../../utils/common");
const authorUtils = require("../../utils/author");
const AuthorModel = require('../../models/AuthorModel');
const {body, validationResult, matchedData} = require('express-validator');

authorRouter.use(authUtils.checkAuthenticatedAdmin);

authorRouter.get(
    '/authors' , 
    async (req,res) => {
    const authors = await AuthorModel.find();
    res.render(
        'admin/author/author',
        {
            authors: authors,
            loggedAdmin: commonUtils.getLoggedAccount(req.user)
        });
});

authorRouter.get(
    '/authors/add',
    (req,res) => {
    res.render(
        'admin/author/author_add',
        {
            loggedAdmin:  commonUtils.getLoggedAccount(req.user)
        });
    }
)

authorRouter.post(
    '/authors/add', 
    [
        body('username').isAlphanumeric().withMessage("Only letters and numbers are allowed.")
            .trim().escape()
            .bail().custom(authorUtils.checkExistedUsername),
        body('email').isEmail().normalizeEmail().withMessage("Email is not valid.")
            .bail().custom(authorUtils.checkExistedEmail),
        body('password').isLength({min: 4}).withMessage('Password must be at least 4 characters.').escape(),
    ],
    async (req,res) => {
        
        const errors = validationResult(req);
        const validInput = matchedData(req, {location: ['body']});
        if (!errors.isEmpty()) {
            return res.render(
                "admin/author/author_add", 
                {
                    errors: errors.array(), 
                    validInput: validInput,
                    loggedAdmin:  commonUtils.getLoggedAccount(req.user)
                });
        }
        try {
            const authorObj = await authorUtils.createNewAuthor(
                req.body.username,
                req.body.email,
                req.body.password,
                req.body.role
            );

            if (authorObj) {
                req.flash("addSuccess", "Successfully. A new author was added.");
            } else {
                req.flash("addFail", "Failed. An error occurred during the process.");
            }

            return res.redirect("/admin/authors/add");
        } catch (error) {
            console.error(error);
            return res.sendStatus(404);
        }
    }
)

module.exports = authorRouter;