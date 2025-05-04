const {body, validationResult, matchedData} = require('express-validator');
const categoryUtils = require('../../utils/categoryUtils');

const validateAuthor = {
    add: [
        body('name').isAlpha().withMessage("Only letters are allowed.").trim()
            .bail()
            .not().custom(categoryUtils.validate.checkExistedName).withMessage('Name existed.'),
        // body('encoded_string').isAlpha().withMessage("Only letters are allowed.").trim()
        //     .not().custom(categoryUtils.validate.checkExistentEncodedString).withMessage('Name existed.'),
    ],
    update: [
        body('name')
            .isAlpha().withMessage("Only letters are allowed.")
            .trim()
            .bail()
            .not().custom(categoryUtils.validate.checkExistedName).withMessage('Name existed.'),
        // body('encoded_string').isAlpha().withMessage("Only letters are allowed.").trim()
        //     .not().custom(categoryUtils.validate.checkExistentEncodedString).withMessage('Name existed.'),
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