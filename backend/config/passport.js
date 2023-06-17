const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const jwt = require('jsonwebtoken');
const { secretOrKey } = require('./keys');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { Prisma, PrismaClient } = require('@prisma/client');
const debug = require('debug')('backend:debug');

const prisma = new PrismaClient();

passport.use(new LocalStrategy({
    session: false,
    usernameField: 'username',
    passwordField: 'password',
}, async function (username, password, done) {
    // const dbQuery = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    // const user = dbQuery.rows[0];
    const user = await prisma.user.findUnique({
        where: {
            username: username,
        },
    });
    if (user) {
        bcrypt.compare(password, user.hashedPassword, (err, isMatch) => {
            if (err || !isMatch) done(null, false);
            else done(null, user);
        });
    } else {
        done(null, false);
    }
}));

const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = secretOrKey;

passport.use(new JwtStrategy(options, async (jwtPayload, done) => {
    try {
        const { id } = jwtPayload;
        // const dbQuery = await db.query('SELECT * FROM users WHERE id = $1', [jwtPayload.id]);
        // const user = dbQuery.rows[0];
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
        })
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (err) {
        done(err);
    }
}));

exports.requireUser = passport.authenticate('jwt', { session: false });

exports.restoreUser = (req, res, next) => {
    return passport.authenticate('jwt', { session: false }, function(err, user) {
        if (err) return next(err);
        if (user) req.user = user;
        next();
    })(req, res, next);
};

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