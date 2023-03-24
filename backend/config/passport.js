const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const jwt = require('jsonwebtoken');
const { secretOrKey } = require('./keys');
const bcrypt = require('bcryptjs');
const db = require('../db');

passport.use(new LocalStrategy({
    session: false,
    usernameField: 'username',
    passwordField: 'password',
}, async function (username, password, done) {
    const dbQuery = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = dbQuery.rows[0];
    if (user) {
        bcrypt.compare(password, user.hashedPassword, (err, isMatch) => {
            if (err || !isMatch) done(null, false);
            else done(null, user);
        });
    } else {
        done(null, false);
    }
}));

exports.loginUser = async function(user) {
    const userInfo = {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
    };
    const token = await jwt.sign(
        userInfo,
        secretOrKey,
        { expiresIn: 3600 },
    );
    return {
        user: userInfo,
        token
    };
};