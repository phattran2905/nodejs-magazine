const {body, validationResult, matchedData} = require('express-validator');
const authorUtils = require('../../utils/authorUtils');
const validationUtils = require('../../utils/validationUtils');

const validateAuthor = {
    add: [
        body('username')
            .isAlphanumeric().withMessage("Only letters and numbers are allowed.").trim()
            .bail()
            .not().custom(authorUtils.validate.checkExistentUsername).withMessage("Username existed."),
        body('email').isEmail().normalizeEmail().withMessage("Email is not valid.").trim()
            .bail().not().custom(authorUtils.validate.checkExistentEmail).withMessage("Email existed."),
        body('password').isLength({min: 4}).withMessage('Password must be at least 4 characters.').trim().escape(),
    ],
    update: [
        body('username')
            .isAlphanumeric().withMessage("Only letters and numbers are allowed.").trim()
            .bail().not().custom(authorUtils.validate.checkExistentUsername).withMessage("Username existed."),
        body('email').isEmail().normalizeEmail().withMessage("Email is not valid.")
        .bail().not().custom(authorUtils.validate.checkExistentEmail).withMessage("Email existed."),
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