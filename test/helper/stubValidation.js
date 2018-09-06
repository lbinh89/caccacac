'use strict';
const expressValidator = require('express-validator')();

/**
 * this is StubForValidation class
 */
export default class StubForValidation {
  /**
   * constructor
   */
  constructor() {
    /**
     * create body Object
     * @type {Object} values
     * @private
     */
    this.body = {};
    this.statusCode = {};
  }

  /**
   * set body data
   *
   * @param {Object} body
   */
  setBody(body) {
    this.body = body;
  }

  /**
   * stub express validator object request
   *
   * @param {Object} done callback request object
   * @returns {Object} middlewave request object
   */
  async stubForValidation(done) {
    let req = {
      query: {},
      body: this.body,

      params: {},
      param(name) {
        return this.params[name];
      },
    };

    return expressValidator(req, {}, () => done(req));
  }

  /**
   * stub express validator object response
   *
   * @param {Object} done callback request object
   * @returns {Object} middlewave response object
   */
  async stubForResponse(done) {
    let res = {
      json: function(body) {
        let resWithStatus = { status: this.statusCode, body: body };
        return resWithStatus;
      },
      status: function(status) {
        this.statusCode = status;
        return this;
      },
    };

    done(res);
  }
}
