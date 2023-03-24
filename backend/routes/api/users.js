const express = require('express');
const router = express.Router();
const db = require('../../db');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { loginUser, restoreUser } = require('../../config/passport');
const { isProduction } = require('../../config/keys');
const validateRegisterInput = require('../../validations/register');
const validateLoginInput = require('../../validations/login');
const debug = require('debug')('backend:debug');

const userReturnFormat = 'users.id, users.username, users."createdAt"'

router.get('/', async (req, res, next) => {
  try {
    const dbQuery = await db.query(`SELECT ${userReturnFormat} FROM users`);
    res.json({
      users: dbQuery.rows,
    });
  } catch (err) {
    return next(err);
  }
});

router.get('/current', restoreUser, (req, res) => {
  if (!isProduction) {
    csrfToken = req.csrfToken();
    res.cookie("CSRF-TOKEN", csrfToken);
  }
  if (!req.user) return res.json(null);
  res.json({
    user: {
      id: req.user.id,
      username: req.user.username,
      createdAt: req.user.createdAt,
    },
  });
});

router.post('/register', validateRegisterInput, async (req, res, next) => {
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
    const text = `INSERT INTO users(username, "hashedPassword") VALUES($1, $2) RETURNING ${userReturnFormat}`;
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
          const user = addUserQuery.rows[0];
          res.json(await loginUser(user));
        } catch (err) {
          return next(err);
        }

      });
    });

  } catch (err) {
    return next(err);
  }
});

router.post('/login', validateLoginInput, async (req, res, next) => {
  passport.authenticate('local', async function(err, user) {
    if (err) return next(err);
    if (!user) {
      const err = new Error('Invalid credentials');
      err.statusCode = 400;
      err.errors = { username: 'Invalid credentials' };
      return next(err);
    }
    return res.json(await loginUser(user));
  })(req, res, next);
});

module.exports = router;
