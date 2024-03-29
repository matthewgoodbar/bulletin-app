const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const debug = require('debug');
const errorLog = debug('backend:error');

require('./config/passport');
const passport = require('passport');
const cors = require('cors');
const { isProduction } = require('./config/keys');
const csurf = require('csurf');

const usersRouter = require('./routes/api/users');
const postsRouter = require('./routes/api/posts');
const repliesRouter = require('./routes/api/replies');
const csrfRouter = require('./routes/api/csrf');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Security Middleware
app.use(passport.initialize());
if (!isProduction) {
    app.use(cors());
}
app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true,
        }
    })
);

// Define routes
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/replies', repliesRouter);
app.use('/api/csrf', csrfRouter);

// Error handling Middleware
// Catch unmatched requests
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.statusCode = 404;
    next(err);
});
// Error handler for routes
app.use((err, req, res, next) => {
    errorLog(err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        statusCode,
        errors: err.errors,
    });
});

module.exports = app;
