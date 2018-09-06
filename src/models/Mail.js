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
    this.url = 'http://localhost:3003';
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

  /**
   * this is method of fetch mail list in Mail Class
   * @param {Object} values
   * @returns {Promise<any>} response - response from json-server
   */
  async registerMailToListModel(values) {
    try {
      /**
       * create self variable
       * @type {Mail}
       */
      const self = this;
      const requestUrl = `${self.url}${self.path}`;
      // check Id largest number in database
      const arrayId = [];
      // latest response
      const response = [];
      // get mail form database
      const databaseMailList = await request.get(requestUrl);

      for (let property in databaseMailList.body) {
        arrayId.push(databaseMailList.body[property].id);
      }
      let largestId = arrayId.sort((a, b) => b - a)[0];
      // generate Id begin form largestId
      for (let object of values) {
        largestId++;
        object.id = largestId;
        const value = await request.post(requestUrl).send(object);
        // check response success
        if (typeof value === 'object' && value.body !== undefined) {
          response.push(value.body);
        }
      }
      return response;
    } catch (err) {
      return err;
    }
  }
}
