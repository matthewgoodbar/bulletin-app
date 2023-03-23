const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.json({
    message: 'GET /api/users'
  });
});

router.post('/', (req, res) => {
  res.json({
    request: req.body
  });
});

module.exports = router;
