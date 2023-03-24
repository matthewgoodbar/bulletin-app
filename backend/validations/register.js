const { check } = require("express-validator");
const handleValidationErrors = require('./handleValidationErrors');

const validateRegisterInput = [
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4, max: 20 })
        .withMessage('Username must be between 4 and 20 characters'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6, max: 30 })
        .withMessage('Password must be between 6 and 30 characters'),
    handleValidationErrors
];

module.exports = validateRegisterInput;