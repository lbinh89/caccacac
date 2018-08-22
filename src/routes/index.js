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

index.post('/list', (req, res) => {
  req.body.map(val => {
    req.checkBody(val.name).not().isString().withMessage('Do not empty name for mail list');
})


const errors = req.validationErrors();

console.log(errors)
  return controller.registerMailToListController(req, res);
});

export default index;
