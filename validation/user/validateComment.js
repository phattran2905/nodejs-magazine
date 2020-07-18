const {body, validationResult, matchedData} = require('express-validator');
const commentUtils = require('../../utils/commentUtils');

const validateComment = {
    add: [
        body('text')
            .trim()
            .isAlphanumeric().withMessage('Only letters and numbers are allowed.')
            .bail().isLength({min: 4, max: 30}).withMessage('Username must be in range of 4-30 characters.')
            .bail().not().custom(commentUtils.validate.checkExistentComment).withMessage('Comment already existed.'),
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

module.exports = validateComment;