const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const cors = require('cors');
const { isProduction } = require('./config/keys');

const usersRouter = require('./routes/api/users');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Security Middleware
if (!isProduction) {
    app.use(cors());
}

app.use('/api/users', usersRouter);

module.exports = app;
