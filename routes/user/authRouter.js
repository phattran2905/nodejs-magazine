const router = require('express').Router();
const {checkNotAuthenticatedAuthor} = require('../../utils/authUtils');
const {
    showLoginForm, login, logout, showSignUpForm, signUp, showVerifyTokenForm, showSendVerificationForm, 
    sendVerification, showSendResetPwdEmailForm, sendResetPwdEmail, showResetPwdForm, resetPwd
} = require('../../controllers/user/auth.controller');


router.get('/login', showLoginForm)

router.post('/login', login)

router.get('/logout', logout)

router.get('/signup', showSignUpForm)

router.post('/signup', signUp)

router.get('/verify/:verify_token', showVerifyTokenForm);

router.get('/send_verification/', showSendVerificationForm)

router.post('/send_verification/', sendVerification);

router.get('/send_reset_pwd_email/', showSendResetPwdEmailForm);

router.post('/send_reset_pwd_email/', sendResetPwdEmail);

router.get('/reset_pwd/:verify_token', showResetPwdForm);

router.post('/reset_pwd/:verify_token', resetPwd);

module.exports = router;