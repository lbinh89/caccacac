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
    const jsonParamsResult = Controller.isJsonValidation(req.body);
    if (jsonParamsResult !== '') {
      return res.status(config.httpStatus.INTERNAL_SERVER.status).json({
        inquiryId: uuidv4(),
        error: {
          code: config.httpStatus.INTERNAL_SERVER.code,
          message: jsonParamsResult,
        },
      });
    }

    // get data input
    const data = req.body;

    // check total mail
    if (data.length < 1 || data.length > 100) {
      return res.status(config.httpStatus.OUT_OF_RANGE.status).json({
        inquiryId: uuidv4(),
        error: {
          code: config.httpStatus.OUT_OF_RANGE.code,
          message: errorsMessage.OutOfRange,
        },
      });
    }

    // make type object of body request folow rule of express validator
    const objectData = { data };
    req.body = objectData;

    // check require name, address
    const requireParamsResult = await this.isRequireParamsValidation(req);
    if (requireParamsResult !== '') {
      return res.status(config.httpStatus.FORMAT_INVALID.status).json({
        inquiryId: uuidv4(),
        error: {
          code: config.httpStatus.FORMAT_INVALID.code,
          message: requireParamsResult,
        },
      });
    }

    // check format name, address
    const formatParamsResult = await this.isFormatParamsValidation(req);
    if (formatParamsResult !== '') {
      return res.status(config.httpStatus.FORMAT_INVALID.status).json({
        inquiryId: uuidv4(),
        error: {
          code: config.httpStatus.FORMAT_INVALID.code,
          message: formatParamsResult,
        },
      });
    }

    // check mail exists
    const existsParamsMailAddressResult = await this.isExistsParamsMailAddressValidation(
      data
    );
    if (existsParamsMailAddressResult !== '') {
      return res.status(config.httpStatus.IS_EXIST.status).json({
        inquiryId: uuidv4(),
        error: {
          code: config.httpStatus.IS_EXIST.code,
          message: existsParamsMailAddressResult,
        },
      });
    }

    try {
      // get mail list form model
      const idModel = {};
      const listMailModel = await this.mail.fetchRegisteredMailList(idModel);

      // check mail is exists in model
      const listMailExists = [];
      data.map(mailInput => {
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
          // concatenation string for list mail exists in database
          outputMsgExists += mail + ', ';
        });

        outputMsgExists.slice(0, -2);
        return res.status(config.httpStatus.IS_EXIST.status).json({
          inquiryId: uuidv4(),
          error: {
            code: config.httpStatus.IS_EXIST.code,
            message: outputMsgExists,
          },
        });
      }
      // send data to registerMailToListModel
      if (
        requireParamsResult !== '' &&
        formatParamsResult !== '' &&
        existsParamsMailAddressResult !== ''
      ) {
        const dataRegister = await this.mail.registerMailToListModel(data);
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
   * this is isJsonValidation method
   * @param {String} values - string
   * @returns {boolean}
   */
  static isJsonValidation(data) {
    try {
      if (typeof data === 'string') {
        JSON.parse(data);
      } else {
        JSON.parse(JSON.stringify(data));
      }
    } catch (e) {
      return e.toString();
    }
    return '';
  }

  /**
   * this is getIndexFromErrorsList method
   * @param {Object} values - object
   * @returns {Object}
   */
  static getIndexFromErrorsList(error) {
    const mailAddress = 'mail address';
    const beginTrim = parseInt(error.param.indexOf('['), 10);
    const endTrim = parseInt(error.param.indexOf(']'), 10);
    const index =
      parseInt(error.param.substr(beginTrim + 1, endTrim - beginTrim - 1), 10) +
      1; // get index of error from errors list
    error.index = index;
    error.type =
      error.param.substr(error.param.indexOf('.') + 1) === 'address' // replace string "address" to "mail address"
        ? mailAddress
        : error.param.substr(error.param.indexOf('.') + 1);
    return error;
  }

  /**
   * this is isRequireParamsValidation method
   * @param {object} values - object
   * @returns {string}
   */
  async isRequireParamsValidation(req) {
    const msgNameRequire = 'name-require';
    const msgAddressRequire = 'address-require';

    // check require name
    req
      .checkBody('data.*.name', msgNameRequire)
      .trim()
      .not()
      .isEmpty();

    // check require address
    req
      .checkBody('data.*.address', msgAddressRequire)
      .trim()
      .not()
      .isEmpty();

    const errors = req.validationErrors();

    if (errors.length > 0) {
      // message output
      let outputMsgRequire = errorsMessage.Require;

      // change format data errors incluce prototype { index, type } to each error then  group data by { index }
      const data = _.groupBy(
        errors.map(error => {
          return Controller.getIndexFromErrorsList(error);
        }),
        'index'
      );

      // loop object errors, inluce error exists by couple prototype { name, address }
      for (let property in data) {
        if (data[property].length > 0) {
          outputMsgRequire +=
            data[property]
              .map(item => item.type + '' + item.index) // get { index, type } of error
              .join(', ') + ', ';
        }
      }

      // check message output not null
      if (outputMsgRequire !== errorsMessage.Require) {
        // remove ", " from begin message
        return outputMsgRequire.slice(0, -2);
      }
    }
    return '';
  }

  /**
   * this is isFormatParamsValidation method
   * @param {object} values - object
   * @returns {string}
   */
  async isFormatParamsValidation(req) {
    const msgNameFormat = 'name-format';
    const msgAddressFormat = 'address-format';

    // check name format
    req
      .checkBody('data.*.name')
      .trim()
      .isString()
      .withMessage(msgNameFormat)
      .not()
      .matches(/[$/:?{~!"^`\[\]!@#$%^&*(),?"{}|<>]/) // check specical character
      .withMessage(msgNameFormat);

    // check address format
    req
      .checkBody('data.*.address')
      .isEmail()
      .withMessage(msgAddressFormat)
      .trim()
      .isString()
      .withMessage(msgAddressFormat)
      .matches(
        /^[-a-z0-9-_.}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/
      ) // check japan character and specical character
      .withMessage(msgAddressFormat);

    const errors = req.validationErrors();

    if (errors.length > 0) {
      // message output
      let outputMsgFormat = errorsMessage.Format;

      // Merge errors and change format data errors incluce prototype { index, type } to each error then group data by { index }
      const data = _.groupBy(
        _.uniqWith(errors, _.isEqual).map(error => {
          return Controller.getIndexFromErrorsList(error);
        }),
        'index'
      );
      // loop object errors, inluce error exists by couple prototype { name, address }
      for (let property in data) {
        if (data[property].length > 0) {
          outputMsgFormat +=
            data[property]
              .map(
                item =>
                  item.type + // get { index, type } of error
                  '' +
                  item.index + // get { index, type } of error
                  ': ' +
                  (item.type.toString() !== 'name' // get value form data input
                    ? req.body.data[item.index - 1].address.toString()
                    : item.value)
              ) // get type and location of error
              .join(', ') + ', ';
        }
      }

      if (outputMsgFormat !== errorsMessage.Format) {
        // remove ", " at end message
        return outputMsgFormat.slice(0, -2);
      }
    }
    return '';
  }

  /**
   * this is isExistsParamsMailAddressValidation method for check exists mail address in input list
   * @param {array} values - array
   * @returns {object||boolean}
   */
  async isExistsParamsMailAddressValidation(data) {
    const listMail = [];
    const listMailExists = [];
    let outputMsgExists = errorsMessage.AlreadyExist;

    for (let property in data) {
      if (Object.prototype.hasOwnProperty.call(data[property], 'address')) {
        listMail.push(data[property].address);
      }
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
        // concatenation string for list mail exists
        outputMsgExists += mail + ', ';
      });
      return outputMsgExists.slice(0, -2);
    }
    return '';
  }
}
