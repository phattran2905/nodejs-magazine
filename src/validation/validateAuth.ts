import { Request } from "express"
import { body, validationResult, matchedData } from 'express-validator';
import {checkExistentUsername,checkExistentEmail, checkExistentVerifyToken,checkActivatedStatusByEmail, checkMatchedPassword } from './account.validate';

export const signup = [
	body("username")
		.trim()
		.isAlphanumeric()
		.withMessage("Only letters and numbers are allowed.")
		.bail()
		.isLength({ min: 4, max: 30 })
		.withMessage("Username must be in range of 4-30 characters.")
		.bail()
		.not()
		.custom(checkExistentUsername)
		.withMessage("Username already existed."),
	body("email")
		.trim()
		.isEmail()
		.normalizeEmail()
		.withMessage("Email is not valid.")
		.bail()
		.not()
		.custom(checkExistentEmail)
		.withMessage("Email already existed."),
	body("password")
		.isLength({ min: 4 })
		.withMessage("Password must be in range of 4-30 characters.")
		.bail()
		.matches("[0-9]")
		.withMessage("Password must have at least a number.")
		.bail()
		.matches("[a-z]")
		.withMessage("Password must have at least a letter.")
		.bail()
		.matches("[A-Z]")
		.withMessage("Password must have at least a capitalized letter."),
	body("confirm_password")
		.custom(checkMatchedPassword)
		.withMessage("Confirm password must match Password."),
]

export const verify = [
	body("verify_token").custom(checkExistentVerifyToken),
	// .bail().custom(checkUsableVerifyToken)
]

export const send_verification = [
	body("email")
		.trim()
		.isEmail()
		.normalizeEmail()
		.withMessage("Email is not valid.")
		.bail()
		.custom(checkExistentEmail)
		.withMessage("Email does not exist."),
]

export const send_reset_pwd_email = [
	body("email")
		.trim()
		.isEmail()
		.normalizeEmail()
		.withMessage("Email is not valid.")
		.bail()
		.custom(checkExistentEmail)
		.withMessage("Email does not exist.")
		.bail()
		.custom(checkActivatedStatusByEmail)
		.withMessage("Please activate your account first."),
]

export const reset_pwd = [
	body("password")
		.isLength({ min: 4 })
		.withMessage("Password must be in range of 4-30 characters.")
		.bail()
		.matches("[0-9]")
		.withMessage("Password must have at least a number.")
		.bail()
		.matches("[a-z]")
		.withMessage("Password must have at least a letter.")
		.bail()
		.matches("[A-Z]")
		.withMessage("Password must have at least a capitalized letter."),
	body("confirm_password")
		.custom(checkMatchedPassword)
		.withMessage("Confirm password must match Password."),
]

export const result = (req: Request) => {
	const errors = validationResult(req)
	const validInput = matchedData(req)
	let hasError = false

	if (!errors.isEmpty()) hasError = true

	return {
		hasError: hasError,
		errors: errors.array(),
		validInput: validInput,
	}
}
