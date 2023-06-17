const express = require('express');
const router = express.Router();
const { Prisma, PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { loginUser, restoreUser } = require('../../config/passport');
const { isProduction } = require('../../config/keys');
const validateRegisterInput = require('../../validations/register');
const validateLoginInput = require('../../validations/login');
const debug = require('debug')('backend:debug');

const prisma = new PrismaClient();

router.get('/', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        createdAt: true
      },
    });
    res.json({
      users: users,
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
    const { username, password } = req.body;
    // See if user exists with username
    const queriedUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    })

    // Username already exists
    if (queriedUser) {
      const err = new Error('Validation Error');
      err.statusCode = 400;
      const errors = {};
      errors.username = "A user has already been registered with this username";
      err.errors = errors;
      return next(err);
    }

    // Username does not exist, go ahead with user registration

    // Create hashed password
    bcrypt.genSalt(10, (err, salt) => {
      if (err) throw err;
      bcrypt.hash(password, salt, async (err, newHashedPassword) => {
        if (err) throw err;
        try {
          const user = await prisma.user.create({
            data: {
              username: username,
              hashedPassword: newHashedPassword,
            },
          });
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
