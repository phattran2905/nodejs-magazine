import { NextFunction, Request, Response } from "express"
import crypto from 'crypto';
import passport from 'passport';
import AccountModel from "../models/AccountModel";
import { IAccount } from "../types/Account";

export const login = [
	passport.authenticate("auth-user", {
		failureRedirect: "/login",
		failureFlash: true,
	}),
	async (req: Request, res: Response, next: NextFunction) => {
		if (!req.body.remember_me) {
			return next()
		}

		try {
            var newToken = crypto.randomBytes(64).toString("base64url")
            console.log(newToken, req.user)
			const author: IAccount | null = await AccountModel.findOneAndUpdate(
				{
					// _id: req.user.id ?? null,
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
	},
	// (req: Request, res: Response) => {
    //     if(typeof req.session.user !== "undefined") {
    //         req.session.user = req.user
    //     }
	// 	return res.redirect("/")
	// },
]
