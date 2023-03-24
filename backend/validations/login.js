const { check } = require("express-validator");
const handleValidationErrors = require('./handleValidationErrors');

const validateLoginInput = [
    check('username')
        .exists({ checkFalsy: true })
        .withMessage('Invalid username'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6, max: 30 })
        .withMessage('Invalid password'),
    handleValidationErrors
];

module.exports = validateLoginInput;