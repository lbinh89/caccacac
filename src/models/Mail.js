'use strict';
import * as request from 'superagent';

/**
 * this is Mail Class
 */
export default class Mail {
  /**
   * creates a instance of Mail
   */
  constructor() {
    /**
     * this is url of DB
     * @type {string}
     */
    this.url = 'http://localhost:3333';
    /**
     * this is path to mail list
     * @type {string}
     */
    this.path = '/ml';
  }

  /**
   * this is method of fetch mail list in Mail Class
   * @param {Object} values
   * @returns {Promise<any>} response - response from json-server
   */
  async fetchRegisteredMailList(values) {
    try {
      /**
       * create self variable
       * @type {Mail}
       */
      const self = this;
      /**
       * this is id from value object
       * @type {String}
       */
      const { id } = values;
      const requestUrl = !id
        ? `${self.url}${self.path}`
        : `${self.url}${self.path}/${id}`;
      const response = await request.get(requestUrl);
      return response;
    } catch (err) {
      return err;
    }
  }
}
