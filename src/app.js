/* eslint-disable no-unused-vars */
'use strict';
import express from 'express';
import createError from 'http-errors';
import CookieParser from 'cookie-parser';
import config from './config/config';
import route from './routes/index';

/**
 * this is express logic for application
 * @type {*|Express|Function}
 */
const app = express();

/** ADD SETTING **/
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '10mb' }));
app.use(CookieParser());

/** ERROR HANDLING **/
if (process.env.NODE_ENV === 'development') {
  process.on('unhandledRejection', (err, p) => {
  });
}

process.on('unhandledRejection', (err, p) => {
  //  CFLogger.log(CFLogLevel.CRITICAL, `Error : ${err}`);
  //  CFLogger.log(CFLogLevel.CRITICAL, `Promise : ${p}`);
});

process.on('uncaughtException', err => {
  process.exit(config.errors.number.processExit);
});

/** ROUTES **/
app.use(route);

// catch 404 and forward to error handler
app.use((err, req, res, next) => {
  if (err.status === config.errors.status.notFound) {
    next(createError(config.errors.status.notFound));
  } else {
    next(err);
  }
});

module.exports = app;
