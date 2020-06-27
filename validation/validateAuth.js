const {body, validationResult, matchedData} = require('express-validator');
const authorUtils = require('../utils/authorUtils');
const validationUtils = require('../utils/validationUtils');

const validateAuthor = {
    signup: [
        body('username')
            .trim().isAlphanumeric().withMessage('Only letters and numbers are allowed.')
            .bail().isLength({min: 4, max: 30}).withMessage('Username must be in range of 4-30 characters.')
            .bail().not().custom(authorUtils.validate.checkExistentUsername).withMessage('Username already existed.'),
        body('email')
            .trim().isEmail().normalizeEmail().withMessage('Email is not valid.')
            .bail().not().custom(authorUtils.validate.checkExistentEmail).withMessage('Email already existed.'),
        body('password')
            .isLength({min: 4}).withMessage('Password must be in range of 4-30 characters.')
            .bail().matches('\[0-9\]').withMessage('Password must have at least a number.')
            .bail().matches('\[a-z\]').withMessage('Password must have at least a letter.')
            .bail().matches('\[A-Z\]').withMessage('Password must have at least a capitalized letter.'),
        body('confirm_password')
            .custom(validationUtils.checkMatchedPassword).withMessage('Confirm password must match Password.')
    ],
    verify: [
        body('verify_token')
            .custom(authorUtils.validate.checkExistentVerifyToken)
            // .bail().custom(authorUtils.validate.checkUsableVerifyToken)
    ],
    send_verification: [
        body('email')
            .trim().isEmail().normalizeEmail().withMessage("Email is not valid.")
            .bail().custom(authorUtils.validate.checkExistentEmail).withMessage("Email does not exist.")
    ],
    send_reset_pwd_email: [
        body('email')
            .trim().isEmail().normalizeEmail().withMessage("Email is not valid.")
            .bail().custom(authorUtils.validate.checkExistentEmail).withMessage("Email does not exist.")
            .bail().custom(authorUtils.validate.checkActivatedStatusByEmail).withMessage("Please activate your account first.")
            
    ],
    reset_pwd : [
        body('password')
            .isLength({min: 4}).withMessage('Password must be in range of 4-30 characters.')
            .bail().matches('\[0-9\]').withMessage('Password must have at least a number.')
            .bail().matches('\[a-z\]').withMessage('Password must have at least a letter.')
            .bail().matches('\[A-Z\]').withMessage('Password must have at least a capitalized letter.'),
        body('confirm_password')
            .custom(validationUtils.checkMatchedPassword).withMessage('Confirm password must match Password.')
    ],
    result: (req) => {
        const errors = validationResult(req);
        const validInput = matchedData(req);
        let hasError = false;

        if(!errors.isEmpty()) hasError = true;

        return {
            hasError: hasError,
            errors: errors.array(),
            validInput: validInput
        };
    },
}

module.exports = validateAuthor;