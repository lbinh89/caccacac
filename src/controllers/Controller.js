'use strict';
import Mail from './../models/Mail';
import config from './../config/config';
import errorsMessage from './../lang/ErrorMessage';
import { resolve } from 'path';
import uuidv4 from 'uuid/v4';
import _ from 'lodash';
import { isArray } from 'util';

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

    // check format JSON input
    if (this.jsonValidation(req.body) === false) {
      return res.status(config.httpStatus.INTERNAL_SERVER.status)
        .json({
          inquiryId: uuidv4(),
          error: {
            code: config.httpStatus.INTERNAL_SERVER.code,
            message: errorsMessage.InternalServer
          }
        });
    }

    // check format data is array of object and property must have name, address
    if (this.formatDataValid(req.body) === false) {
      return res.status(config.httpStatus.INTERNAL_SERVER.status)
        .json({
          inquiryId: uuidv4(),
          error: {
            code: config.httpStatus.INTERNAL_SERVER.code,
            message: errorsMessage.InternalServer
          }
        });
    }

    // get data input
    const data = !req.body ? "" : req.body;

    // check total mail
    if (data.length < 0 || data.length > 100) {
      return res.status(config.httpStatus.OUT_OF_RANGE.status)
        .json({
          inquiryId: uuidv4(),
          error: {
            code: config.httpStatus.OUT_OF_RANGE.code,
            message: errorsMessage.OutOfRange
          }
        });
    }

    // check require name, address
    this.requireParamsValidation(req, res, data);

    // check format name, address
    this.formatParamsValidation(req, res, data);

    // check mail exists
    this.checkInputMailExists(data);

    return res.json('ok');
  }

  /**
   * this is jsonValidation method
   * @param {String} values - string
   * @returns {boolean}
   */
  jsonValidation(data) {
    try {
      if (typeof data === "string") {
        JSON.parse(data);
      } else {
        JSON.parse(JSON.stringify(data));
      }
    } catch (e) {
      return false;
    }
    return true;
  }

  /**
   * this is formatDataValid method
   * @param {array} values - array
   * @returns {boolean}
   */
  formatDataValid(data) {
    if (Array.isArray(data) === true) {
      let checkPrototype = true;
      data.find((index) => {
        // check property must be name or address
        if (!index.hasOwnProperty("name") === true || !index.hasOwnProperty("address") === true) {
          checkPrototype = false;
        }
      });
      return checkPrototype;
    }
    return false;
  }

  /**
  * this is requireParamsValidation method
  * @param {object} values - object
  * @returns {object}
  */
  requireParamsValidation(req, res, data) {
    const msgNameRequire = "name-require";
    const msgAddressRequire = "address-require";
    const nameLetter = "name";
    const addressLetter = "address";

    //make type object of body request folow rule of express validator
    const objectData = { data };
    req.body = objectData;

    // check require name
    req.checkBody('data.*.name')
      .not()
      .isEmpty()
      .withMessage(msgNameRequire);

    // check require address
    req.checkBody('data.*.address')
      .not()
      .isEmpty()
      .withMessage(msgAddressRequire);

    const errors = req.validationErrors();

    if (errors.length > 0) {
      // message output
      let outputMsgRequire = errorsMessage.Require;

      for (let property in errors) {
        if (errors[property].msg == msgNameRequire) {
          let index = parseInt(errors[property].param.substr(5, 1)) + 1; // get index of error from errors list
          outputMsgRequire = outputMsgRequire + nameLetter + index + ', ';
        }
      }
      for (let property in errors) {
        if (errors[property].msg == msgAddressRequire) {
          let index = parseInt(errors[property].param.substr(5, 1)) + 1; // get index of error from errors list
          outputMsgRequire = outputMsgRequire + addressLetter + index + ', ';
        }
      }
      // check message output not null
      if (outputMsgRequire !== errorsMessage.Require) {
        // remove ", " from begin message
        outputMsgRequire = outputMsgRequire.slice(0, -2);
        return res.status(config.httpStatus.FORMAT_INVALID.status)
          .json({
            inquiryId: uuidv4(),
            error: {
              code: config.httpStatus.FORMAT_INVALID.code,
              message: outputMsgRequire
            }
          });
      }
    }
    return data;
  }

  /**
  * this is formatParamsValidation method
  * @param {object} values - object
  * @returns {object}
  */
  formatParamsValidation(req, res, data) {
    const msgNameFormat = "name-format";
    const msgAddressFormat = "address-format";
    const nameLetter = "name";
    const addressLetter = "address";

    //make type object of body request folow rule of express validator
    const objectData = { data };
    req.body = objectData;

    // check name format
    req.checkBody('data.*.name')
      .trim()
      .isString()
      .withMessage(msgNameFormat);

    // check address format
    req.checkBody('data.*.address')
      .isEmail()
      .withMessage(msgAddressFormat)
      .trim()
      .normalizeEmail()
      .withMessage(msgAddressFormat)
      .isString()
      .withMessage(msgAddressFormat)
      .matches(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+?\.[a-z]{2,}$/) // check japan character and specical character
      .withMessage(msgAddressFormat);

    const errors = req.validationErrors();

    if (errors.length > 0) {
      // message output
      let outputMsgFormat = errorsMessage.Format;
      // Merge errors
      const errorsMerge = _.uniqWith(errors, _.isEqual);
      // validation name
      for (let property in errorsMerge) {
        if (errorsMerge[property].msg == msgNameFormat) {
          let index = parseInt(errorsMerge[property].param.substr(5, 1)) + 1; // get index of error from errors list
          outputMsgFormat = outputMsgFormat + nameLetter + index + ': ' + errorsMerge[property].value + ', ';
        }
      }
      // validation address
      for (let property in errorsMerge) {
        if (errorsMerge[property].msg == msgAddressFormat) {
          let index = parseInt(errorsMerge[property].param.substr(5, 1)) + 1;
          outputMsgFormat = outputMsgFormat + addressLetter + index + ': ' + errorsMerge[property].value + ', ';
        }
      }
      if (outputMsgFormat !== errorsMessage.Format) {
        // remove ", " at end message
        outputMsgFormat = outputMsgFormat.slice(0, -2);
        return res.status(config.httpStatus.FORMAT_INVALID.status)
          .json({
            inquiryId: uuidv4(),
            error: {
              code: config.httpStatus.FORMAT_INVALID.code,
              message: outputMsgFormat
            }
          });
      }
    }
    return data;
  }

  /**
   * this is checkInputMailExists method
   * @param {array} values - array
   * @returns {boolean}
   */
  checkInputMailExists(data) {
    let listMail = [];
    for(let property in data) {
      listMail.push(data[property].address)
    }
  }
}
