// const express = require('express');
// const authRouter = express.Router();
// const passport = require("passport");
const AuthorModel = require('../../models/AuthorModel');
const authorUtils = require('../../utils/authorUtils');
const commonUtils = require('../../utils/commonUtils');
const mailUtils = require('../../utils/mailUtils');
const validateAuth = require('../../validation/validateAuth');
const validationUtils = require('../../utils/validationUtils');


module.exports = function (userRouter, {passport}) {
    passport = require('passport');
    userRouter.get('/login', (req,res) => {
        res.render("user/auth/login");
    })
    
    userRouter.post('/login',
        passport.authenticate('auth-user',{
                failureRedirect: "/login",
                // successRedirect: "/",
                failureFlash: true
            }),
            (req,res) => {
                req.session.user = req.user;
                // console.log('user: ' + req.user);
                // res.redirect('/');
                // res.send('logged');
                res.redirect('/');
            }
    )
    
    userRouter.get('/signup', (req,res) => {
        res.render("user/auth/signup");
    })
    
    userRouter.post(
        '/signup',
        validateAuth.signup,
        async (req,res) => {
            const { hasError, errors, validInput } = validateAuth.result(req);
            
            if(hasError) return res.render('user/auth/signup',{errors: errors, validInput: validInput});
    
            const addedAuthor = await authorUtils.createNewAuthor(
                validInput.username,
                validInput.email,
                validInput.password
            )
            // send token to email
            const mailResponse = await mailUtils.sendVerificationEmail(addedAuthor.email, addedAuthor.verifyToken.token);
    
            if(addedAuthor && mailResponse && mailResponse.accepted[0] === validInput.email){
                req.flash("addSuccess","Successfully. Please check your email to verify your registered account. ");
                return res.redirect('/signup');
            }
    
            req.flash("addFail","Failed. An error occurred during the process.");
            return res.redirect('/signup');
        }
    )
    
    userRouter.get('/verify/:verify_token',
        async (req,res) => {
            // check existent and unexpired
            const isValidToken = await commonUtils.castPromiseToBoolean(
                authorUtils.validate.checkValidVerifyToken,
                [req.params.verify_token]
                );
    
            if (isValidToken) {
                try {
                    const accountAuthor = await authorUtils.verifyAccountByToken(req.params.verify_token);
                    if (accountAuthor) {
                        req.flash("verifySuccess", "Successfully. Your account is verified. You can log in now!");
                        return res.render("user/auth/verify");
                    }
                } catch(error){
                    req.flash("verifyFail","Failed. An error occurred during the process.");
                    return res.render("user/auth/verify");
                }
            }
    
            req.flash("verifyFail","Failed. An error occurred during the process.");
            return res.render("user/auth/verify");
        }
    );
    
    userRouter.get('/send_verification/',
        (req,res) => {
            return res.render('user/auth/send_email',{
                form : {
                    submitBtn: 'Send verification email',
                    action: 'send_verification'
                }
            });
        }
    )
    
    userRouter.post('/send_verification/',
        validateAuth.send_verification,
        async (req,res) => {
            const { hasError, errors, validInput } = validateAuth.result(req);
    
            if(hasError) return res.render('user/auth/send_email',
                {   errors: errors, 
                    validInput: validInput,
                    form: {submitBtn: 'Send verification',action: 'send_verification'}
                });
            
            const isActivated = await commonUtils.castPromiseToBoolean(
                authorUtils.validate.checkActivatedStatusByEmail,
                [validInput.email]
            );
            if (isActivated) {
                req.flash("sendSuccess","Your account was already activated.");
                return res.redirect('/send_verification');
            }
            const isPending = await commonUtils.castPromiseToBoolean(
                authorUtils.validate.checkPendingVerifyTokenByEmail,
                [validInput.email]
            );
            if (isPending) {
                req.flash("sendSuccess","A verification email was already sent to your email.");
                return res.redirect('/send_verification');
            }
    
            try {
                const verification = await authorUtils.sendVerification(validInput.email);
    
                if (verification){
                    req.flash("sendSuccess","Successfully. Please check your email to verify your registered account. ");
                    return res.redirect('/send_verification');
                }
    
                req.flash("sendFail","Failed. An error occurred during the process.");
                return res.redirect('/send_verification');
            }catch(error) {
                req.flash("sendFail","Failed. An error occurred during the process.");
                return res.redirect('/send_verification');
            }
        }
    );
    
    userRouter.get('/send_reset_pwd_email/',
        (req,res) => {
        return res.render('user/auth/send_email',
            {
                form: {
                    submitBtn: 'Send reset password link',
                    action: 'send_reset_pwd_email'
                }
            });
    });
    
    userRouter.post('/send_reset_pwd_email/',
        validateAuth.send_reset_pwd_email,
        async (req,res) => {
            const { hasError, errors, validInput } = validateAuth.result(req);
            if (hasError) return res.render('user/auth/send_email',
            {
                errors: errors,
                validInput: validInput,
                form: {
                    submitBtn: 'Send reset password link',
                    action: 'send_reset_pwd_email'
                }
            });
            const isPending = await commonUtils.castPromiseToBoolean(
                authorUtils.validate.checkPendingVerifyTokenByEmail,
                [validInput.email]
            );
            console.log(isPending);
            if (isPending) {
                req.flash("sendSuccess","An email was already sent to you. Please check your email again.");
                return res.redirect('/send_reset_pwd_email');
            }
            try {
                const resetPwdRes = await authorUtils.sendResetPwd(validInput.email);
                    
                if(resetPwdRes){
                    req.flash("sendSuccess","Successfully. Please check your email to reset your password");
                    return res.redirect('/send_reset_pwd_email');
                }
    
                req.flash("sendFail","Failed. An error occurred during the process.");
                return res.redirect('/send_reset_pwd_email');
            }catch(error) {
                req.flash("sendFail","Failed. An error occurred during the process.");
                return res.redirect('/send_reset_pwd_email');
            }
    });
    
    userRouter.get('/reset_pwd/:verify_token',
    async (req,res) => {
        const isValidToken = await commonUtils.castPromiseToBoolean(
            authorUtils.validate.checkValidVerifyToken,
            [req.params.verify_token]
            );
        
        if (isValidToken) return res.render("user/auth/reset_pwd", {
            isValidToReset: true,
            isSuccessful: false,
            verifyToken: req.params.verify_token
        });
    
        req.flash("resetPwdFail","Failed. An error occurred during the process.");
        return res.render("user/auth/reset_pwd", {isValidToReset: false,isSuccessful: false});
    
    });
    
    userRouter.post('/reset_pwd/:verify_token',
        validateAuth.reset_pwd,
        async (req,res) => {
            const isValidToken = await commonUtils.castPromiseToBoolean(
                authorUtils.validate.checkValidVerifyToken,
                [req.params.verify_token]
                );
            
            if (isValidToken) {
                const {hasError, errors, validInput} = validateAuth.result(req);
                if (hasError) return res.render("user/auth/reset_pwd", {
                    verifyToken: req.params.verify_token,
                    isValidToReset: true,
                    isSuccessful: false,
                    errors: errors,
                    validInput: validInput
                });
    
                const resetPwdRes = await authorUtils.reset_pwd(req.params.verify_token, validInput.password);
                // console.log(resetPwdRes);
                if(resetPwdRes) {
                    req.flash("sendSuccess","Successfully. Please check your email to reset your password");
                    return res.render("user/auth/reset_pwd", {
                    isSuccessful: true,
                    });
                }
            };
    
            req.flash("resetPwdFail","Failed. An error occurred during the process.");
            return res.render("user/auth/reset_pwd", {isValidToReset: false,isSuccessful: false});
    });
};