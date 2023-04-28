import { IAccount } from "../types/Account"
import { IArticle } from "../types/Article"
import AccountModel from "../models/AccountModel"
import ArticleModel from "../models/ArticleModel"
import bcrypt from "bcrypt"
import { denormalizeVerifyToken, generateToken } from "./common.util"
import { checkUnexpiredVerifyToken } from "../validation/account.validate"
import { IProfile } from "../types/Profile"
import ProfileModel from "../models/ProfileModel"
import * as commonUtils from "./common.util"
import * as mailUtils from "./mail.util"

export const getAuthorsWithNumOfArticles = async () => {
	const authors: IAccount[] = await AccountModel.find()
	for (let i = 0; i < authors.length; i++) {
		const articles: IArticle[] = await ArticleModel.find({ authorId: authors[i].id })
		// authors[i]?.numOfArticles = articles.length
	}
	return authors
}

export const getAuthorById = async (authorId: string | null = null) => {
	if (!authorId) {
		return null
	}

	try {
		const author: IAccount | null = await AccountModel.findOne({ _id: authorId }).populate({
			path: "profile_id",
		})
		if (author) {
			const articlesByAuthor: IArticle[] = await ArticleModel.find({
				$and: [{ status: "Published" }, { authorId: authorId }],
			})
				.populate({
					path: "categoryId",
					select: "_id name",
				})
				.sort({ "interaction.views": "desc" })

			let numOfViews = 0
			for (let i = 0; i < articlesByAuthor.length; i++) {
				numOfViews += articlesByAuthor[i].views
			}

			return {
				info: author,
				articles: articlesByAuthor,
				statistics: {
					numOfArticles: articlesByAuthor.length,
					numOfViews: numOfViews,
					numOfFollowers: author?.profile_id?.followers.length,
				},
			}
		}

		return null
	} catch (error) {
		return null
	}
}

interface Avatar {
	path: string
	contentType: string
	filename: string
	size: number
}

export const update_avatar = async (
	author_id = null,
	{ path, contentType, filename, size }: Avatar
) => {
	if (!author_id || !path || !contentType || !filename || !size) {
		return null
	}

	try {
		const author = await AccountModel.findById(author_id)

		if (author) {
			const updateQuery = await AccountModel.updateOne(
				{ _id: author.id },
				{
					"profile.avatar_img": {
						path: path,
						contentType: contentType,
						filename: filename,
						size: size,
					},
				}
			)
			return updateQuery
		}
	} catch (error) {
		return null
	}
	return null
}

export const createNewAuthor = async ({
	username,
	email,
	pwd,
}: {
	username: string
	email: string
	pwd: string
}) => {
	if (!username || !email || !pwd) {
		return null
	}

	try {
		const hashed_pwd = await bcrypt.hash(pwd, await bcrypt.genSalt(12))
		const verifyToken = await commonUtils.generateToken(username + email, 7) // valid in 7 days
		const author = await AccountModel.create({
			username: username.toLowerCase(),
			email: email.toLowerCase(),
			password: hashed_pwd,
			profile: {
				fullname: "",
				gender: "Male",
				dateOfBirth: "",
				phone: "",
			},
			verifyToken: {
				token: verifyToken.tokenStr,
				expiredOn: verifyToken.expiredOn,
			},
		})

		return author
	} catch (error) {
		return null
	}
}

export const updateAuthorProfile = async function ({
	fullname,
	username,
	gender,
	dob,
	phone,
}: {
	fullname: string
	username: string
	gender: string
	dob: Date
	phone: string
}) {
	if (!fullname || !username || !gender || !dob || !phone) return null

	try {
		const updateResponse = await AccountModel.updateOne(
			{ username: username },
			{
				"profile.full_name": fullname,
				"profile.gender": gender,
				"profile.dateOfBirth": new Date(dob), // Parse it to UTC/GMT instead of locale time
				"profile.phone": phone,
			}
		)

		return updateResponse
	} catch (error) {
		console.log(error)
		return null
	}
}

export const changePwd = async function ({
	id,
	new_password,
}: {
	id: string
	new_password: string
}) {
	if (!id || !new_password) return null

	try {
		const hashed_pwd = await bcrypt.hash(new_password, await bcrypt.genSalt(12))
		const updateResponse = await AccountModel.updateOne(
			{ _id: id },
			{
				password: hashed_pwd,
			}
		)

		return updateResponse
	} catch (error) {
		console.log(error)
		return null
	}
}

export const verifyAccountByToken = async (normalizedToken: string | null = null) => {
	if (!normalizedToken) return null

	const rawToken = denormalizeVerifyToken(normalizedToken)
	try {
		const author = await AccountModel.findOne({
			$and: [{ "verifyToken.token": rawToken }, { status: "Deactivated" }],
		}).exec()
		if (author) {
			const isValid = await commonUtils.castPromiseToBoolean(checkUnexpiredVerifyToken, [
				normalizedToken,
			])
			if (isValid) {
				const responseQuery = await AccountModel.updateOne(
					{ _id: author.id },
					{
						status: "Activated",
						"verifyToken.token": null,
						"verifyToken.expiredOn": null,
					}
				)
				if (responseQuery) {
					return author
				}
				return null
			}
		}
		return null
	} catch (error) {
		return null
	}
}

export const sendVerification = async (email: string | null = null) => {
	if (!email) return null

	try {
		const author = await AccountModel.findOne({
			$and: [{ email: email }, { status: "Deactivated" }],
		}).exec()
		if (!author) return null

		const newVerifyToken = await generateToken(author.username + "verification" + email)
		const responseQuery = await AccountModel.updateOne(
			{ email: email },
			{
				"verifyToken.token": newVerifyToken.tokenStr,
				"verifyToken.expiredOn": newVerifyToken.expiredOn,
			}
		).exec()

		if (responseQuery && newVerifyToken.tokenStr) {
			// send verification email
			const mailResponse = await mailUtils.sendVerificationEmail(
				email,
				newVerifyToken.tokenStr
			)

			if (mailResponse && mailResponse.info.accepted[0] === email) {
				return mailResponse
			}
		}

		return null
	} catch (error) {
		return null
	}
}

export const sendResetPwd = async (email: string | null = null) => {
	if (!email) return null

	try {
		const author = await AccountModel.findOne({
			email: email,
			status: "Activated",
		}).exec()
		if (!author) return null
		const newVerifyToken = await generateToken(
			author.username + process.env.SECRET_KEY + email,
			7
		)
		const responseQuery = await AccountModel.updateOne(
			{ email: email },
			{
				"verifyToken.token": newVerifyToken.tokenStr,
				"verifyToken.expiredOn": newVerifyToken.expiredOn,
			}
		).exec()
		if (responseQuery && newVerifyToken.tokenStr) {
			// send verification email
			const mailResponse = await mailUtils.sendResetPwdEmail(email, newVerifyToken.tokenStr)

			if (mailResponse && mailResponse.info.accepted[0] === email) {
				return mailResponse
			}
		}
		return null
	} catch (error) {
		return null
	}
}

export const reset_pwd = async (
	normalizedToken: string | null = null,
	password: string | null = null
) => {
	if (!normalizedToken || !password) return null

	const verifyToken = denormalizeVerifyToken(normalizedToken.toString())
	const author = await AccountModel.findOne({
		"verifyToken.token": verifyToken,
		status: "Activated",
	}).exec()

	if (author) {
		const hashed_pwd = await bcrypt.hash(password, await bcrypt.genSalt(12))
		const responseQuery = await AccountModel.updateOne(
			{ _id: author.id },
			{
				password: hashed_pwd,
				"verifyToken.token": null,
				"verifyToken.expiredOn": null,
			}
		).exec()

		if (responseQuery) return author
	}

	return null
}
