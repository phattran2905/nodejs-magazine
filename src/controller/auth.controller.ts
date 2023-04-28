import { NextFunction, Request, Response } from "express"
import crypto from "crypto"
import passport from "passport"
import AccountModel from "../models/AccountModel"
import { IAccount } from "../types/Account"
import * as validateAuth from "../validation/validateAuth"
import { createNewAuthor } from "../utils/author.util"
import { sendVerificationEmail } from "../utils/mail.util"

export const login = async (req: Request, res: Response, next: NextFunction) => {
	if (!req.body.remember_me) {
		return next()
	}

	try {
		var newToken = crypto.randomBytes(64).toString("base64url")
		console.log(newToken, req.user)
		const author: IAccount | null = await AccountModel.findOneAndUpdate(
			{
				_id: req?.user,
			},
			{
				remember_token: newToken,
			}
		)
		if (author) {
			res.cookie("remember_me", author.remember_token, {
				path: "/",
				httpOnly: true,
				maxAge: 3600 * 24 * 7, // 1 week
			})
		}
		return next()
	} catch (error) {
		return error
	}
}

export const signUp = async (req: Request, res: Response) => {
	const { hasError, errors, validInput } = validateAuth.result(req)
console.log(hasError, errors, validInput)
	if (hasError) {
		res.render("user/auth/signup", {
			errors: errors,
			validInput: validInput,
		})
		return
	}

	try {
		const addedAuthor: IAccount | null = await createNewAuthor({
			username: validInput.username,
			email: validInput.email,
			pwd: validInput.password,
		})
console.log(addedAuthor)
		if (addedAuthor) {
			// send token to email
			const mailResponse = await sendVerificationEmail(
				addedAuthor.email,
				addedAuthor.verify_token.token
			)

			// if (addedAuthor && mailResponse.info && mailResponse.info.accepted[0] === validInput.email) {
			if (addedAuthor && mailResponse && mailResponse.info) {
				req.flash("addSuccess", "Successfully. An verification email was sent to you.")
				res.render("user/auth/signup", {
					verification_link: mailResponse.testMailURL,
				})
                return
			}
		}
		req.flash("addFail", "Failed. An error occurred during the process.")
		res.redirect("/signup")
	} catch (error) {
        console.log(error)
		req.flash("addFail", "Failed. An error occurred during the process.")
		res.redirect("/signup")
	}
}
