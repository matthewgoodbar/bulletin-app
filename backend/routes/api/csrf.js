const express = require('express');
const router = express.Router();
const { isProduction } = requure('../../config/keys');

if (!isProduction) {
    router.get('/restore', (req, res, next) => {
        const csrfToken = req.csrfToken();
        res.status(200).json({
            'CSRF-Token': csrfToken,
        });
    });
}

module.exports = router;