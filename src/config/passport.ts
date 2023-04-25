import { Strategy as LocalStrategy } from "passport-local"
import { Strategy as RememberMeStrategy } from "passport-remember-me"
import AccountModel from "../models/AccountModel"
import bcrypt from "bcrypt"
import { ACCOUNT_ROLES, ACCOUNT_STATUS, IAccount } from "../types/Account"
import { Request } from "express"
import passport, { PassportStatic } from "passport"
import crypto from "crypto"
import { Types } from "mongoose"

const isUser = async function (id: string | Types.ObjectId) {
	try {
		const user: IAccount | null = await AccountModel.findById(id)

		if (user && (user.role === ACCOUNT_ROLES.audience || user.role === ACCOUNT_ROLES.blogger)) {
			return true
		}

		return false
	} catch (error) {
		return false
	}
}

const isAdmin = async function (id: string | Types.ObjectId) {
	try {
		const admin: IAccount | null = await AccountModel.findById(id)

		if (admin && admin.role === ACCOUNT_ROLES.admin) {
			return true
		}

		return false
	} catch (error) {
		return false
	}
}

const passportSetup = function (passport: PassportStatic) {
	const authenticateAdmin = async (
		req: Request,
		email: string,
		password: string,
		done: Function
	) => {
		try {
			const admin = await AccountModel.findOne({ email: email })
			if (!admin) {
				return done(null, false, { message: "Incorrect email!" })
			}
			const correctPassword = await bcrypt.compare(password, admin.hashed_password)
			if (!correctPassword) {
				return done(null, false, { message: "Incorrect password!" })
			}
			if (admin.status === ACCOUNT_STATUS.inactive) {
				return done(null, false, { message: "Your account was not allowed to log in!" })
			}

			return done(null, admin)
		} catch (error) {
			return done(error)
		}
	}

	const authenticateUser = async (
		req: Request,
		email: string,
		password: string,
		done: Function
	) => {
		try {
			const user: IAccount | null = await AccountModel.findOne({ email: email })
			if (!user) {
				return done(null, false, { message: "Incorrect email!" })
			}
			if (!(await bcrypt.compare(password, user.hashed_password))) {
				return done(null, false, { message: "Incorrect password!" })
			}
			if (user.status === ACCOUNT_STATUS.inactive) {
				return done(null, false, { message: "Your account was not allowed to log in!" })
			}

			return done(null, user)
		} catch (error) {
			return done(error)
		}
	}

	passport.serializeUser<any,any>(function (req: Request, obj, done): void {
        // isUser(obj?.id).then((result) => {
        //     if (result) {
        //         done(null, { id: obj?.id, model: "user" })
        //     }
        // })

        // isAdmin(obj?.id).then((result) => {
        //     if (result) {
        //         done(null, { id: obj?.id, model: "admin" })
        //     }
        // })
        return done(undefined, obj)
		// return done(null, obj.id);
	})

	passport.deserializeUser(async function (
		user: Express.User,
		done: Function
	) {
        const account = AccountModel.findById(user, function (err: any, user: IAccount) {
			done(null, account)
		})
	})

	passport.use(
		"auth-admin",
		new LocalStrategy(
			{
				usernameField: "email",
				passReqToCallback: true,
			},
			authenticateAdmin
		)
	)

	passport.use(
		"auth-user",
		new LocalStrategy(
			{
				usernameField: "email",
				passReqToCallback: true,
			},
			authenticateUser
		)
	)

	passport.use(
		"remember-me",
		new RememberMeStrategy(
			// consume the token
			async function (token, done) {
				try {
					const user: IAccount | null = await AccountModel.findOne({
						remember_token: token,
					})
					if (user) {
						await AccountModel.findOneAndUpdate(
							{
								_id: user.id,
							},
							{
								remember_token: null,
							}
						)
						return done(null, user)
					}
					const admin: IAccount | null = await AccountModel.findOne({
						remember_token: token,
					})
					if (admin) {
						await AccountModel.findOneAndUpdate(
							{
								_id: admin.id,
							},
							{
								remember_token: null,
							}
						)
						return done(null, admin)
					}
					return done(null, false, {
						message: "Remember token is invalid.",
					})
				} catch (error) {
					return done(error)
				}
			},
			// issue new token
			async function (obj, done) {
				var token = crypto.randomBytes(64).toString("base64url")
				if (await isUser(obj._id)) {
					const userWithNewToken = await AccountModel.findOneAndUpdate(
						{
							_id: obj._id,
						},
						{
							remember_token: token,
						}
					)
					if (userWithNewToken) {
						return done(null, userWithNewToken.remember_token)
					}
				} else if (await isAdmin(obj._id)) {
					const admWithNewToken = await AccountModel.findOneAndUpdate(
						{
							_id: obj._id,
						},
						{
							remember_token: token,
						}
					)
					if (admWithNewToken) {
						return done(null, admWithNewToken.remember_token)
					}
				}
				return done(null, {
					message: "Can not issue token.",
				})
			}
		)
	)
}

export default passportSetup
