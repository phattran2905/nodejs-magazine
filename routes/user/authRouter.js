const router = require('express').Router();
const {checkNotAuthenticatedAuthor, checkAuthenticatedAuthor} = require('../../utils/authUtils');
const {
    showLoginForm, login, logout, showSignUpForm, signUp, showVerifyTokenForm, showSendVerificationForm, 
    sendVerification, showSendResetPwdEmailForm, sendResetPwdEmail, showResetPwdForm, resetPwd
} = require('../../controllers/user/auth.controller');


router.get('/login', checkNotAuthenticatedAuthor, showLoginForm)

router.post('/login', checkNotAuthenticatedAuthor, login)

router.get('/logout', checkAuthenticatedAuthor, logout)

router.get('/signup', checkNotAuthenticatedAuthor, showSignUpForm)

router.post('/signup', checkNotAuthenticatedAuthor, signUp)

router.get('/verify/:verify_token', checkNotAuthenticatedAuthor, showVerifyTokenForm);

router.get('/send_verification/', checkNotAuthenticatedAuthor, showSendVerificationForm)

router.post('/send_verification/', checkNotAuthenticatedAuthor, sendVerification);

router.get('/send_reset_pwd_email/', checkNotAuthenticatedAuthor, showSendResetPwdEmailForm);

router.post('/send_reset_pwd_email/', checkNotAuthenticatedAuthor, sendResetPwdEmail);

router.get('/reset_pwd/:verify_token', checkNotAuthenticatedAuthor, showResetPwdForm);

router.post('/reset_pwd/:verify_token', checkNotAuthenticatedAuthor, resetPwd);

module.exports = router;