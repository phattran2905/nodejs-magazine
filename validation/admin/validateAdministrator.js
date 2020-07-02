const {body, validationResult, matchedData} = require('express-validator');
const adminUtils = require('../../utils/administratorUtils');
const validationUtils = require('../../utils/validationUtils');

const validateAuthor = {
    add: [
        body('username')
            .isAlphanumeric().withMessage("Only letters and numbers are allowed.")
            .trim().escape()
            .bail().custom(adminUtils.checkExistedUsername),
        body('email')
            .isEmail().normalizeEmail().withMessage("Email is not valid.")
            .bail().custom(adminUtils.checkExistedEmail),
        body('password')
            .isLength({min: 4}).withMessage('Password must be at least 4 characters.')
            .trim().escape(),
        body('role')
            .not().isEmpty().withMessage("Assign a role for account.")
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