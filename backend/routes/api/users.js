const express = require('express');
const router = express.Router();
const db = require('../../db');
const bcrypt = require('bcryptjs');
const debug = require('debug')('backend:debug');

router.get('/', async (req, res, next) => {
  try {
    const dbQuery = await db.query('SELECT id, username, "createdAt" FROM users');
    res.json(dbQuery.rows);
  } catch (err) {
    return next(err);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    // See if user exists with username
    const dbQuery = await db.query('SELECT * FROM users WHERE username = $1', [req.body.username]);

    // Username already exists
    if (dbQuery.rows[0]) { 
      const err = new Error('Validation Error');
      err.statusCode = 400;
      const errors = {};
      errors.username = "A user has already been registered with this username";
      err.errors = errors;
      return next(err);
    }

    // Username does not exist, go ahead with user registration
    const text = 'INSERT INTO users(username, "hashedPassword") VALUES($1, $2) RETURNING id, username, "createdAt"';
    const values = [req.body.username];

    // Create hashed password
    bcrypt.genSalt(10, (err, salt) => {
      if (err) throw err;
      bcrypt.hash(req.body.password, salt, async (err, newHashedPassword) => {
        if (err) throw err;
        values.push(newHashedPassword);

        // Try adding new user to database
        try {
          const addUserQuery = await db.query(text, values);
          res.json(addUserQuery.rows[0])
        } catch (err) {
          return next(err);
        }

      });
    });

  } catch (err) {
    return next(err);
  }
});

module.exports = router;
