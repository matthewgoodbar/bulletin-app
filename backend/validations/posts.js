const { check } = require("express-validator");
const handleValidationErrors = require('./handleValidationErrors');

const validatePostInput = [
    check('title')
        .exists({ checkFalsy: true })
        .isLength({ min: 1, max: 40 })
        .withMessage('Title cannot be more than 40 characters'),
    check('body')
        .exists({ checkFalsy: true })
        .isLength({ min: 1, max: 400 })
        .withMessage('Post body cannot be more than 400 characters'),
    handleValidationErrors
];

module.exports = validatePostInput;