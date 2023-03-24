const { check } = require("express-validator");
const handleValidationErrors = require('./handleValidationErrors');

const validateReplyInput = [
    check('body')
        .exists({ checkFalsy: true })
        .isLength({ min: 1, max: 400 })
        .withMessage('Reply body cannnot be more than 400 characters'),
    handleValidationErrors
];

module.exports = validateReplyInput;