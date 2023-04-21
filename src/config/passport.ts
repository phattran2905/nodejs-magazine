import { Strategy as LocalStrategy } from "passport-local"
import { Strategy as RememberMeStrategy } from "passport-remember-me"
import AccountModel from "../models/AccountModel"
import bcrypt from "bcrypt"
import { nanoid } from "nanoid"
import { IAccount } from "../types/Account"

const isUser = async function (id: string) {
	try {
		const user = await AccountModel.findById(id) as IAccount

		if (user.role === "audience" || user.role === "blogger") {
			return true
		}

		return false
	} catch (error) {
		return false
	}
}

const isAdmin = async function (id: string) {
	try {
		const admin = await AccountModel.findById(id) as IAccount

		if (admin.role === "admin") {
			return true
		}

		return false
	} catch (error) {
		return false
	}
}

const passportSetup = function (passport) {
	const authenticateAdmin = async (req, email, password, done) => {
		try {
			const admin = await AccountModel.findOne({ email: email }) as IAccount
			if (!admin) {
				return done(null, false, { message: "Incorrect email!" })
			}
			if (!(await bcrypt.compare(password, admin.password))) {
				return done(null, false, { message: "Incorrect password!" })
			}
			if (admin.status === "Deactivated") {
				return done(null, false, { message: "Your account was not allowed to log in!" })
			}

			return done(null, admin)
		} catch (error) {
			return done(error)
		}
	}

	const authenticateUser = async (req, email, password, done) => {
		try {
			const user = await AuthorModel.findOne({ email: email })
			if (!user) {
				return done(null, false, { message: "Incorrect email!" })
			}
			if (!(await bcrypt.compare(password, user.password))) {
				return done(null, false, { message: "Incorrect password!" })
			}
			if (user.status === "Deactivated") {
				return done(null, false, { message: "Your account was not allowed to log in!" })
			}

			return done(null, user)
		} catch (error) {
			return done(error)
		}
	}

	passport.serializeUser(async function (obj, done) {
		if (await isUser(obj.id)) {
			return done(null, { id: obj.id, model: "user" })
		} else if (await isAdmin(obj.id)) {
			return done(null, { id: obj.id, model: "admin" })
		}
		// return done(null, obj.id);
	})

	passport.deserializeUser(async function ({ id, model }, done) {
		if (model === "user") {
			AuthorModel.findById(id, function (err, user) {
				done(null, user)
			})
		} else if (model === "admin") {
			AdminModel.findById(id, function (err, admin) {
				done(null, admin)
			})
		} else {
			done(null, false)
		}
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
					const user = await AuthorModel.findOne({
						remember_token: token,
					})
					if (user) {
						await AuthorModel.findOneAndUpdate(
							{
								_id: user.id,
							},
							{
								remember_token: null,
							}
						)
						return done(null, user)
					}
					const admin = await AdminModel.findOne({
						remember_token: token,
					})
					if (admin) {
						await AdminModel.findOneAndUpdate(
							{
								_id: user.id,
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
				var token = nanoid(64)
				if (await isUser(obj._id)) {
					const userWithNewToken = await AuthorModel.findOneAndUpdate(
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
					const admWithNewToken = await AdminModel.findOneAndUpdate(
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
				return done(null, false, {
					message: "Can not issue token.",
				})
			}
		)
	)
}

export default passportSetup
