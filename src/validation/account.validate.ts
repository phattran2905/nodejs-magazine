import { Request } from "express"
import bcrypt from "bcrypt"
import AccountModel from "../models/AccountModel"
import { IAccount } from "../types/Account"
import { denormalizeVerifyToken, castPromiseToBoolean } from "../utils/common.util"
import { Meta } from "express-validator"

// Express-validator requires returning a Promise
// If invalid, return { Promise.reject() }
// If valid , return { Promise.resolve() }
export const checkExistentEmail = async (email = null, { req }: Meta) => {
	if (!email) return Promise.reject(false)

	const usernameFromReq = req?.params?.username

	try {
		const author: IAccount | null = await AccountModel.findOne({ email: email })
		if (author) {
			if (usernameFromReq && usernameFromReq === author.username) {
				Promise.reject(false)
				return
			}

			Promise.resolve(true)
			return
		}

		Promise.reject(false)
	} catch (error) {
		Promise.resolve(true)
	}
}

export const checkExistentUsername = async (username: string, { req }: Meta) => {
	if (!username) return Promise.reject(false)

	const usernameFromReq = req?.params?.username

	try {
		const author: IAccount | null = await AccountModel.findOne({ username: username })

		if (author) {
			if (usernameFromReq && usernameFromReq === author.username) {
				Promise.reject(false)
				return
			}

			Promise.resolve(true)
			return
		}

		Promise.reject(false)
	} catch (error) {
		Promise.resolve(true)
	}
}

export const checkNotExistentUsername = async (username: string, { req }: Meta) => {
	if (!username) return Promise.reject(false)

	const usernameFromReq = req?.params?.username

	try {
		const author: IAccount | null = await AccountModel.findOne({ username: username }).exec()
		if (!author) {
			Promise.resolve(true)
			return
		}

		Promise.reject(false)
	} catch (error) {
		Promise.reject(false)
	}
}

export const checkExistentVerifyToken = async (normalizedToken: string | null = null) => {
	if (!normalizedToken) return Promise.reject(false)

	const verifyToken = denormalizeVerifyToken(normalizedToken.toString())
	try {
		const match: IAccount | null = await AccountModel.findOne({
			"verifyToken.token": verifyToken,
		}).exec()
		if (match) {
			{
				Promise.resolve(true)
				return
			}
		}

		Promise.reject(false)
	} catch (error) {
		Promise.resolve(true)
	}
}

export const checkUnexpiredVerifyToken = async (normalizedToken: string | null = null) => {
	if (!normalizedToken) return Promise.reject(false)

	const verifyToken = denormalizeVerifyToken(normalizedToken.toString())
	try {
		const author: IAccount | null = await AccountModel.findOne({
			"verifyToken.token": verifyToken,
		}).exec()
		if (author) {
			const currentTime = Date.now()
			if (currentTime <= author.verify_token.expired_on.getTime()) {
				return Promise.resolve(true)
			}
		}
		return Promise.reject(false)
	} catch (error) {
		return Promise.reject(false)
	}
}

export const checkValidVerifyToken = async (normalizedToken: string | null = null) => {
	if (!normalizedToken) return Promise.reject(false)

	// const verifyToken = denormalizeVerifyToken(normalizedToken.toString());
	const isExistent = await castPromiseToBoolean(checkExistentVerifyToken, [normalizedToken])
	const isUnexpired = await castPromiseToBoolean(checkUnexpiredVerifyToken, [normalizedToken])
	if (isExistent && isUnexpired) {
		return Promise.resolve(true)
	}
	return Promise.reject(false)
}

export const checkPendingVerifyTokenByEmail = async (email: string | null = null) => {
	if (!email) return Promise.reject(false)

	const author: IAccount | null = await AccountModel.findOne({ email: email })
	if (author && author.verify_token.token && author.verify_token.expired_on >= new Date()) {
		return Promise.resolve(true)
	}
	return Promise.reject(false)
}

export const checkActivatedStatusByEmail = async (email = null, { req }: Meta) => {
	if (!email) return Promise.reject(false)

	let emailFromReq = req?.params?.email

	try {
		const match = await AccountModel.findOne({
			$and: [{ email: email }, { status: "Activated" }],
		}).exec()

		if (match) {
			if (emailFromReq && emailFromReq === match.email) {
				return Promise.reject(false)
			}

			return Promise.resolve(true)
		}
		return Promise.reject(false)
	} catch (error) {
		return Promise.reject(false)
	}
}

export const checkPresentPwd = async (pwd = null, { req }: { req: Request }) => {
	if (!pwd || typeof req.user === "undefined") {
		return Promise.reject(false)
	}

	// const userPwd = req.user.password
	const userPwd = ""
	try {
		const match = await bcrypt.compare(pwd, userPwd)
		if (match) {
			return Promise.resolve(true)
		}

		return Promise.reject(false)
	} catch (error) {
		return Promise.reject(false)
	}
}

export const checkMatchedPassword = function(password: string, {req}: Meta) {
    if (password === req.body.password){
        return true;
    }
    return false;
}