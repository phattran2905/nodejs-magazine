import { Router, Request, Response, NextFunction } from "express"
import { login, signUp } from "../../controller/auth.controller"
import passport from "passport"
import { showLoginForm, showSignUpForm } from "../../view/user/auth.view"
import { authenticate, checkNotAuthenticatedUser } from "../../middlewares/auth.middleware"
import * as validateAuth from "../../validation/validateAuth"

const router = Router()

router.get("/login", checkNotAuthenticatedUser, showLoginForm)

router.post(
	"/login",
	checkNotAuthenticatedUser,
	passport.authenticate("auth-user", {
		failureRedirect: "/login",
		failureFlash: true,
	}),
	login,
	(req: Request, res: Response) => {
		console.log(req.session)
		console.log(req.user)
		// if (typeof req.session.user !== "undefined") {
		// 	req.session.user = req.user
		// }
		return res.redirect("/")
	}
)

// router.get('/logout', logout)

router.get("/signup", checkNotAuthenticatedUser, showSignUpForm)

router.post(
	"/signup",
	checkNotAuthenticatedUser,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const result = await Promise.all(
				validateAuth.signup.map(async (v) => {
					try {
						const validation = await v.run(req)

						console.log(validation)
					} catch (error) {
						console.log(error)
					}
				})
			)
			console.log(result)
		} catch (error) {
			console.log(error)
		}
		next()
	},
	signUp
)

// router.get('/verify/:verify_token', checkNotAuthenticatedUser, showVerifyTokenForm);

// router.get('/send_verification/', checkNotAuthenticatedUser, showSendVerificationForm)

// router.post('/send_verification/', checkNotAuthenticatedUser, sendVerification);

// router.get('/send_reset_pwd_email/', checkNotAuthenticatedUser, showSendResetPwdEmailForm);

// router.post('/send_reset_pwd_email/', checkNotAuthenticatedUser, sendResetPwdEmail);

// router.get('/reset_pwd/:verify_token', checkNotAuthenticatedUser, showResetPwdForm);

// router.post('/reset_pwd/:verify_token', checkNotAuthenticatedUser, resetPwd);

export default router
