const {body, matchedData, validationResult} = require('express-validator');
const menuUtils = require('../../utils/menuUtils');

module.exports = {
    add: [
        body('name')
            .trim()
            .isAlphanumeric().bail()
            .isLength({min: 3}).withMessage('Name must be at least 3 characters.')
            .bail().not().custom(menuUtils.validate.checkExistentName).withMessage('This name already existed.'),
        body('display_order') 
            .isNumeric().withMessage('Invalid order.').bail()
            .not().custom(menuUtils.validate.checkExistentDisplayOrder).withMessage('This display order was already taken.')
    ],
    submenu_add: [
        body('submenu_name')
            .trim()
            .isAlphanumeric().bail()
            .isLength({min: 3}).withMessage('Name must be at least 3 characters.')
            .bail().not().custom(menuUtils.validate.submenu.checkExistentName).withMessage('This name already existed.'),
        body('submenu_display_order') 
            .isNumeric().withMessage('Invalid order.').bail()
            .not().custom(menuUtils.validate.submenu.checkExistentDisplayOrder).withMessage('This display order was already taken.')
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