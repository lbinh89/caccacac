'use strict';
import Mail from './../models/Mail';
import config from './../config/config';

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
 
    this.values = !req.body ? "" : req.body;
 
    let responseData = {};
 
    if(this.values.length < 0 || this.values.length > 100) {
      responseData.status = config.httpStatus.BAD_REQUEST.status;
      responseData.code = errorString.codeOutOfRange;
      responseData.message = errorString.messageOutOfRange;
      return res.status(responseData.status).json(responseData)
    }else {
      
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
