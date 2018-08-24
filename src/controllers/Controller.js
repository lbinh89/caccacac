'use strict';
import Mail from './../models/Mail';
import config from './../config/config';
import { resolve } from 'path';
import uuidv4 from 'uuid/v4';
import _ from 'lodash';

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

    if (data.length < 0 || data.length > 100) {
      return res.status(config.httpStatus.OUT_OF_RANGE.status)
        .json({
          inquiryId: uuidv4(),
          error: {
            code: config.httpStatus.OUT_OF_RANGE.code,
            message: "登録件数が超えています。メールは1から100の範囲で入力してください"
          }
        });
    } else {
      //make type object of body request folow rule of express validator
      const objectData = { data };
      req.body = objectData;

      // Validation name is string and no empty
      req.checkBody('data.*.name')
        .not()
        .isEmpty()
        .withMessage('{name}がありませんでした。{name}を入力してください。');

      req.checkBody('data.*.name')
        .trim()
        .isString()
        .withMessage('name-format');

      // Validation address no empty, is string, email format
      req.checkBody('data.*.address')
        .not()
        .isEmpty()
        .withMessage('{address}がありませんでした。{address}を入力してください。');

      req.checkBody('data.*.address')
        .isEmail()
        .withMessage('address-format')
        .trim()
        .normalizeEmail()
        .withMessage('address-format')
        .isString()
        .withMessage('address-format')
        .matches(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+?\.[a-z]{2,}$/) // check japan character and specical character
        .withMessage('address-format');

      const errors = req.validationErrors();

      if (errors.length > 0) {
        // Validation for require name, address
        // format message output
        let outputMsgRequire = "";

        for (let property in errors) {
          if (errors[property].msg == "{name}がありませんでした。{name}を入力してください。" || errors[property].msg == "{address}がありませんでした。{address}を入力してください。") {
            outputMsgRequire = outputMsgRequire + ', ' + errors[property].msg;
          }
        }
        // check message error not null
        if (outputMsgRequire !== "") {
          // remove ", " from begin message
          outputMsgRequire = outputMsgRequire.substr(2);
          return res.status(config.httpStatus.FORMAT_INVALID.status)
            .json({
              inquiryId: uuidv4(),
              error: {
                code: config.httpStatus.FORMAT_INVALID.code,
                message: outputMsgRequire
              }
            });
        } else {
          // errors of validation for format name, address
          let outputMsgFormat = "";
          let outputMsgName = "次の name, name の形式が不正で登録できませんでした。形式を確認してください。";
          let outputMsgAddress = "次の address, address の形式が不正で登録できませんでした。形式を確認してください。";
          // Merge data same value
          const errorsMerge = _.uniqWith(errors, _.isEqual);

          // errors of validation for format name
          for (let property in errorsMerge) {
            if (errorsMerge[property].msg == "name-format") {
              let index = parseInt(errorsMerge[property].param.substr(5, 1)) + 1; // get location of error from errors list
              outputMsgName = outputMsgName + "name" + index + ": <<" + errorsMerge[property].value + ">>, ";
            }
          }
          // errors of validation for format address
          for (let property in errorsMerge) {
            if (errorsMerge[property].msg == "address-format") {
              let index = parseInt(errorsMerge[property].param.substr(5, 1)) + 1;
              outputMsgAddress = outputMsgAddress + "address" + index + ": <<" + errorsMerge[property].value + ">>, ";
            }
          }

          // logic for have error at input or no
          if (outputMsgName !== "次の name, name の形式が不正で登録できませんでした。形式を確認してください。" && outputMsgAddress !== "次の address, address の形式が不正で登録できませんでした。形式を確認してください。") {
            outputMsgFormat = outputMsgFormat + "" + outputMsgName + "" + outputMsgAddress;
          } else if(outputMsgName !== "次の name, name の形式が不正で登録できませんでした。形式を確認してください。" && outputMsgAddress === "次の address, address の形式が不正で登録できませんでした。形式を確認してください。") {
            outputMsgFormat = outputMsgFormat + "" + outputMsgName;
          } else if(outputMsgName === "次の name, name の形式が不正で登録できませんでした。形式を確認してください。" && outputMsgAddress !== "次の address, address の形式が不正で登録できませんでした。形式を確認してください。") {
            outputMsgFormat = outputMsgFormat + "" + outputMsgAddress;
          }

          if (outputMsgFormat !== "") {
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
