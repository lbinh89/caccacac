'use strict';
import Mail from './../models/Mail';
import config from './../config/config';
import errorString from '../languages/Error';
import { resolve } from 'path';
import { oneOf } from 'express-validator/check';

/**
 * this is Controller class
 */
export default class Controller {
  /**
   * constructor
   */
  constructor() {
    /**
     * create a instance of Controller
     * @type {Mail} mail
     * @private
     */
    this.mail = new Mail();
    /**
     * create values Object
     * @type {Object} values
     * @private
     */
    this.values = {};
  }

  /**
   * this is fetchMailList method
   * call fetchRegisteredMailList from Mail model
   * @param {Object} req - request Object
   * @param {Object} res - response
   * @returns {Promise<*>}
   */
  async fetchMailList(req, res) {
    this.values.id = !req.params.id ? null : req.params.id;
    const result = await this.mail.fetchRegisteredMailList(this.values);
    const statusCode = !result.err
      ? config.errors.status.ok
      : config.errors.status.internalServerError;
    const responseText = !result.err
      ? result.body
      : config.errors.message.getMailList;
    return res.status(statusCode).json(responseText);
  }

    /**
   * this is registerMailToListController method
   * call registerMailToListModel from Mail model
   * @param {Object} req - request Object
   * @param {Object} res - response
   * @returns {Promise<*>}
   */
  async registerMailToListController(req, res) {
   /**
   * @param {Object} values
   * @returns {JSON}
   */

   const data = !req.body ? "" : req.body;

   let responseData = {};

   if(data.length < 0 || data.length > 100) {
     responseData.status = config.httpStatus.BAD_REQUEST.status;
     responseData.code = errorString.codeOutOfRange;
     responseData.message = errorString.messageOutOfRange;
     return res.status(responseData.status).json(responseData)
   }else {
    //make type object of body request folow rule of express validator
    const objectData = { data };
    req.body = objectData;

    // Validation name is string and no empty
    req.checkBody('data.*.name')
    .not()
    .isEmpty()
    .withMessage('name-require')
    .trim()
    .isString()
    .withMessage('name-format');
    
    // Validation address is string, no empty, email format
    req.checkBody('data.*.address')
    .not()
    .isEmpty()
    .withMessage('address-require')
    .isEmail()
    .withMessage('address-format')
    .trim()
    .normalizeEmail()
    .withMessage('address-format')
    .isString()
    .withMessage('address-format');

    const errors = req.validationErrors();
    
    if(errors.length > 0) {
      return res.json({ errors: errors});
    }
    return res.json('ok');
   }
  }

  /**
   * this is jsonValidation method
   * @param {String} values - values Object
   * @returns {Object}
   */
  jsonValidation(values) {
    return JSON.parse(values);
  }
}
