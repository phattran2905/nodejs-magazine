const express = require('express');
const authRouter = express.Router();
const {body, matchedData, validationResult} = require('express-validator');
const AuthorModel = require('../../models/ArticleModel');
const authorUtils = require('../../utils/authorUtils');

authRouter.get('/login', async (req,res) => {

    res.render("user/auth/login");
})

authRouter.get('/signup', async (req,res) => {

    res.render("user/auth/signup");
})

authRouter.post(
    '/signup',
    [
        body('username').isAlphanumeric().trim().withMessage('Only letters and numbers are allowed.')
            .isLength({min: 4, max: 30}).bail().custom(authorUtils.checkExistedUsername).withMessage('Username already existed.'),
        body('email').isEmail().normalizeEmail().withMessage('Email is not valid.')
            .bail().custom(authorUtils.checkExistedEmail).withMessage('Email already existed.'),
        body('password').isLength({min: 4, max: 30}).withMessage('Password must be in range of 4-30 characters.')
            .escape(),
        body('confirm_password').custom(authorUtils.checkPasswordConfirmation)
    ],
    async (req,res) => {
        const errors = validationResult(req);
        const validInput = matchedData(req);

        if(!errors.isEmpty()) {
            res.render('user/auth/signup',
            {
                errors: errors.array(),
                validInput: validInput
            });
        }

        try {
            const addedAuthor = await authorUtils.createNewAuthor(
                validInput.username,
                validInput.email,
                validInput.password
            )
            if (! addedAuthor){
                req.flash("addFail","Failed. An error occurred during the process.");
                res.redirect('/signup');
            }
            // send token to email
            console.log(addedAuthor);
        } catch (error) {
            
        }
    }
)

module.exports = authRouter;