const {body, validationResult, matchedData} = require('express-validator');
const articleUtils = require('../../utils/articleUtils');

const validateArticle = {
    add: [
        body('title')
            .trim()
            .isLength({min: 20, max: 250}).withMessage('Title must be in range of 20-140 characters.')
            .bail().not().custom(articleUtils.validate.checkExistentTitle).withMessage('Title already existed.')
            .escape(),
        body('summary')
            .trim()
            .isLength({min: 30}).withMessage('Summary must be at least 30 characters.')
            .escape(),
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

module.exports = validateArticle;