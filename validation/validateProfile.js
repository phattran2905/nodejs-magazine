const {body, validationResult, matchedData} = require('express-validator');
const authorUtils = require('../utils/authorUtils');
const validationUtils = require('../utils/validationUtils');

const validateAuthor = {
    change_password: [
        body('present_password')
            .custom(authorUtils.validate.checkPresentPwd).withMessage('Your present password was not correct.'),
        body('new_password')
            .isLength({min: 4}).withMessage('Password must be in range of 4-30 characters.')
            .bail().matches('\[0-9\]').withMessage('Password must have at least a number.')
            .bail().matches('\[a-z\]').withMessage('Password must have at least a letter.')
            .bail().matches('\[A-Z\]').withMessage('Password must have at least a capitalized letter.'),
        body('confirm_password')
            .custom(validationUtils.checkMatchedNewPassword).withMessage('Confirm new password and New Password must be matched.')
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