'use strict';
import express from 'express';
import Controller from './../controllers/Controller';

/**
 * this is routing logic using router from express
 * @type {Router}
 */
const index = express.Router();
/**
 * create a instance of Controller
 * @type {Controller}
 */
const controller = new Controller();

/**
 * logic for get method of path(/list)
 * @param {Object} req - request object
 * @param {Object} res - response
 */
index.get('/list', (req, res) => {
  return controller.fetchMailList(req, res);
});

/**
 * logic for get method of path(/list) with id parameter
 * @param {Object} req - request object
 * @param {Object} res - response
 */
index.get('/list/:id', (req, res) => {
  return controller.fetchMailList(req, res);
});

export default index;
