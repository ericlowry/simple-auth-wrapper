const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const createError = require('http-errors');

require('dotenv').config({ path: __dirname + '/../.env' });

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
const authRouter = require('./routes/auth');

const app = express();
require('express-async-errors');

app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors());

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/auth', authRouter);

// 404 handler
app.use((req, res, next) => {
  next(createError(404, 'resource not found'));
});

// global error handler (will catch exceptions)
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).send({
    error: err.message,
    status,
  });
});

module.exports = app;
