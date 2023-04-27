import { Router } from "express"
import { login } from "../../controller/auth.controller"
import { showLoginForm, showSignUpForm } from "../../view/user/auth.view"
import { authenticate, checkNotAuthenticatedUser } from "../../middlewares/auth.middleware"

const router = Router()

router.get("/login", checkNotAuthenticatedUser, showLoginForm)

router.post("/login", checkNotAuthenticatedUser, login)

// router.get('/logout', logout)

router.get('/signup', checkNotAuthenticatedUser, showSignUpForm)

// router.post('/signup', checkNotAuthenticatedAuthor, signUp)

// router.get('/verify/:verify_token', checkNotAuthenticatedAuthor, showVerifyTokenForm);

// router.get('/send_verification/', checkNotAuthenticatedAuthor, showSendVerificationForm)

// router.post('/send_verification/', checkNotAuthenticatedAuthor, sendVerification);

// router.get('/send_reset_pwd_email/', checkNotAuthenticatedAuthor, showSendResetPwdEmailForm);

// router.post('/send_reset_pwd_email/', checkNotAuthenticatedAuthor, sendResetPwdEmail);

// router.get('/reset_pwd/:verify_token', checkNotAuthenticatedAuthor, showResetPwdForm);

// router.post('/reset_pwd/:verify_token', checkNotAuthenticatedAuthor, resetPwd);

export default router
