/* eslint-disable no-unused-vars */
'use strict';
import express from 'express';
import * as jsonServer from 'json-server';

/**
 * this is express logic for json-server
 * @type {*|Express|Function}
 */
const db = express();

/** LAUNCH DB **/
db.use('/', jsonServer.router('./config/db.json'));

module.exports = db;
