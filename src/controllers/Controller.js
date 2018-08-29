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
      return res.status(config.httpStatus.INTERNAL_SERVER.status).json({
        inquiryId: uuidv4(),
        error: {
          code: config.httpStatus.INTERNAL_SERVER.code,
          message: errorsMessage.InternalServer,
        },
      });
    }

    // check format data is array of object and property must have name, address
    if (this.formatDataValid(req.body) === false) {
      return res.status(config.httpStatus.INTERNAL_SERVER.status).json({
        inquiryId: uuidv4(),
        error: {
          code: config.httpStatus.INTERNAL_SERVER.code,
          message: errorsMessage.InternalServer,
        },
      });
    }

    // get data input
    const dataInput = !req.body ? '' : req.body;

    // check total mail
    if (dataInput.length < 1 || dataInput.length > 100) {
      return res.status(config.httpStatus.OUT_OF_RANGE.status).json({
        inquiryId: uuidv4(),
        error: {
          code: config.httpStatus.OUT_OF_RANGE.code,
          message: errorsMessage.OutOfRange,
        },
      });
    }

    // check require name, address
    const checkRequired = await this.requireParamsValidation(
      req,
      res,
      dataInput
    );

    // check format name, address
    const checkFormat = await this.formatParamsValidation(req, res, dataInput);

    // check mail exists
    const checkExists = await this.checkInputMailExists(req, res, dataInput);

    try {
      // get mail list form model
      const idModel = {};
      const listMailModel = await this.mail.fetchRegisteredMailList(idModel);

      // check mail is exists in model
      const listMailExists = [];
      dataInput.map(mailInput => {
        listMailModel.body.map(mailModel => {
          // check mail is exist in model
          if (mailInput.address === mailModel.address) {
            // check mail is exist in listMailExists
            if (listMailExists.indexOf(mailInput.address) === -1) {
              listMailExists.push(mailInput.address);
            }
          }
        });
      });

      if (listMailExists.length > 0) {
        let outputMsgExists = errorsMessage.AlreadyExist;

        listMailExists.map(mail => {
          outputMsgExists = `${outputMsgExists + mail}, `;
        });

        outputMsgExists = outputMsgExists.slice(0, -2);
        return res.status(config.httpStatus.IS_EXIST.status).json({
          inquiryId: uuidv4(),
          error: {
            code: config.httpStatus.IS_EXIST.code,
            message: outputMsgExists,
          },
        });
      }
      // send dataInput to registerMailToListModel
      if (
        checkRequired === true &&
        checkFormat === true &&
        checkExists === true
      ) {
        const dataRegister = await this.mail.registerMailToListModel(dataInput);
        // check register success
        if (dataRegister.length > 0) {
          return res
            .status(config.httpStatus.CREATED.status)
            .json(dataRegister);
        }
      }
    } catch (e) {
      return res.status(config.httpStatus.INTERNAL_SERVER.status).json({
        inquiryId: uuidv4(),
        error: {
          code: config.httpStatus.INTERNAL_SERVER.code,
          message: errorsMessage.InternalServer,
        },
      });
    }
  }

  /**
   * this is jsonValidation method
   * @param {String} values - string
   * @returns {boolean}
   */
  jsonValidation(data) {
    try {
      if (typeof data === 'string') {
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
      data.find(index => {
        // check property must be name or address
        if (
          !index.hasOwnProperty('name') === true ||
          !index.hasOwnProperty('address') === true
        ) {
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
  async requireParamsValidation(req, res, data) {
    const msgNameRequire = 'name-require';
    const msgAddressRequire = 'address-require';
    const nameLetter = 'name';
    const addressLetter = 'mail address';

    // make type object of body request folow rule of express validator
    const objectData = { data };
    req.body = objectData;

    // check require name
    req
      .checkBody('data.*.name')
      .not()
      .isEmpty()
      .withMessage(msgNameRequire);

    // check require address
    req
      .checkBody('data.*.address')
      .not()
      .isEmpty()
      .withMessage(msgAddressRequire);

    const errors = req.validationErrors();

    if (errors.length > 0) {
      // message output
      let outputMsgRequire = errorsMessage.Require;

      for (const property in errors) {
        if (errors[property].msg == msgNameRequire) {
          const beginTrim = parseInt(errors[property].param.indexOf("["));
          const endTrim = parseInt(errors[property].param.indexOf("]"));
          const index = parseInt(errors[property].param.substr(beginTrim + 1, endTrim - beginTrim - 1)) + 1; // get index of error from errors list
          outputMsgRequire = `${outputMsgRequire + nameLetter + index}, `;
        }
      }
      for (const property in errors) {
        if (errors[property].msg == msgAddressRequire) {
            const beginTrim = parseInt(errors[property].param.indexOf("["));
            const endTrim = parseInt(errors[property].param.indexOf("]"));
            const index = parseInt(errors[property].param.substr(beginTrim + 1, endTrim - beginTrim - 1)) + 1;  // get index of error from errors list
          outputMsgRequire = `${outputMsgRequire + addressLetter + index}, `;
        }
      }
      // check message output not null
      if (outputMsgRequire !== errorsMessage.Require) {
        // remove ", " from begin message
        outputMsgRequire = outputMsgRequire.slice(0, -2);
        return res.status(config.httpStatus.FORMAT_INVALID.status).json({
          inquiryId: uuidv4(),
          error: {
            code: config.httpStatus.FORMAT_INVALID.code,
            message: outputMsgRequire,
          },
        });
      }
    }
    return true;
  }

  /**
   * this is formatParamsValidation method
   * @param {object} values - object
   * @returns {object}
   */
  async formatParamsValidation(req, res, data) {
    const msgNameFormat = 'name-format';
    const msgAddressFormat = 'address-format';
    const nameLetter = 'name';
    const addressLetter = 'mail address';

    // make type object of body request folow rule of express validator
    const objectData = { data };
    req.body = objectData;

    // check name format
    req
      .checkBody('data.*.name')
      .trim()
      .isString()
      .withMessage(msgNameFormat)
      .not()
      .matches(/[$-/:-?{-~!"^_`\[\]!@#$%^&*(),.?":{}|<>]/) // check specical character
      .withMessage(msgNameFormat);

    // check address format
    req
      .checkBody('data.*.address')
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
      for (const property in errorsMerge) {
        if (errorsMerge[property].msg == msgNameFormat) {
            const beginTrim = parseInt(errors[property].param.indexOf("["));
            const endTrim = parseInt(errors[property].param.indexOf("]"));
            const index = parseInt(errors[property].param.substr(beginTrim + 1, endTrim - beginTrim - 1)) + 1; // get index of error from errors list
          outputMsgFormat = `${outputMsgFormat + nameLetter + index}: ${
            errorsMerge[property].value
          }, `;
        }
      }
      // validation address
      for (const property in errorsMerge) {
        if (errorsMerge[property].msg == msgAddressFormat) {
            const beginTrim = parseInt(errors[property].param.indexOf("["));
            const endTrim = parseInt(errors[property].param.indexOf("]"));
            const index = parseInt(errors[property].param.substr(beginTrim + 1, endTrim - beginTrim - 1)) + 1; // get index of error from errors list
          outputMsgFormat = `${outputMsgFormat + addressLetter + index}: ${
            errorsMerge[property].value
          }, `;
        }
      }
      if (outputMsgFormat !== errorsMessage.Format) {
        // remove ", " at end message
        outputMsgFormat = outputMsgFormat.slice(0, -2);
        return res.status(config.httpStatus.FORMAT_INVALID.status).json({
          inquiryId: uuidv4(),
          error: {
            code: config.httpStatus.FORMAT_INVALID.code,
            message: outputMsgFormat,
          },
        });
      }
    }
    return true;
  }

  /**
   * this is checkInputMailExists method
   * @param {array} values - array
   * @returns {boolean}
   */
  async checkInputMailExists(req, res, data) {
    const listMail = [];
    const listMailExists = [];
    let outputMsgExists = errorsMessage.AlreadyExist;

    for (const property in data) {
      listMail.push(data[property].address);
    }

    listMail.forEach((value, key) => {
      // check listMail has exists mail address
      if (listMail.indexOf(value, key + 1) > -1) {
        // check mail is exists in listMailExists
        if (listMailExists.indexOf(value) === -1) {
          listMailExists.push(value);
        }
      }
    });

    if (listMailExists.length > 0) {
      listMailExists.map(mail => {
        outputMsgExists = `${outputMsgExists + mail}, `;
      });
      outputMsgExists = outputMsgExists.slice(0, -2);
      return res.status(config.httpStatus.IS_EXIST.status).json({
        inquiryId: uuidv4(),
        error: {
          code: config.httpStatus.IS_EXIST.code,
          message: outputMsgExists,
        },
      });
    }
    return true;
  }
}
