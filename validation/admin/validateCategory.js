const {body, validationResult, matchedData} = require('express-validator');
const categoryUtils = require('../../utils/categoryUtils');

const validateAuthor = {
    add: [
        body('name').isAlpha().withMessage("Only letters are allowed.").trim()
            .bail()
            .not().custom(categoryUtils.validate.checkExistedName).withMessage('Name existed.'),
        body('display_order').isInt({min: 0, max: 10000, allow_leading_zeroes: false}).withMessage("Only numbers are accepted.")
            .toInt()
            .bail()
            .not().custom(categoryUtils.validate.checkDuplicatedOrder).withMessage('Order existed.')
    ],
    update: [
        body('name')
            .isAlpha().withMessage("Only letters are allowed.")
            .trim()
            .bail()
            .not().custom(categoryUtils.validate.checkExistedName).withMessage('Name existed.'),
        body('display_order')
            .isInt({min: 0, max: 10000, allow_leading_zeroes: false}).withMessage("Only numbers are accepted.")
            .toInt()
            .bail()
            .not().custom(categoryUtils.validate.checkDuplicatedOrder).withMessage('Order existed.')
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