const {body, validationResult, matchedData} = require('express-validator');
const adminUtils = require('../../utils/administratorUtils');
const validationUtils = require('../../utils/validationUtils');

const validateProfile = {
    profile: [
        body('fullname')
            .trim()
            .isLength({min: 4}).withMessage('Fullname must be in range of 4-30 characters.')
            .custom(validationUtils.checkFullnameValid).withMessage('Your name must be alphabetic characters.'),
        body('dob') // isDate() was removed from express-validator
            .isBefore('1/1/2004').withMessage('Invalid Date'),
        body('phone')
            .isMobilePhone().withMessage('Phone number only contains numeric character.')
    ],
    change_password: [
        body('present_password')
            .custom(adminUtils.validate.checkPresentPwd).withMessage('Your present password was not correct.'),
        body('new_password')
            .isLength({min: 4}).withMessage('Password must be in range of 4-30 characters.')
            .bail().matches('\[0-9\]').withMessage('Password must have at least a number.')
            .bail().matches('\[a-z\]').withMessage('Password must have at least a letter.')
            .bail().matches('\[A-Z\]').withMessage('Password must have at least a capitalized letter.'),
        body('confirm_password')
            .not().isEmpty().withMessage('Confirm new password and New Password must be matched.')
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

module.exports = validateProfile;