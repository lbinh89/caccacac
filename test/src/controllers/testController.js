import { describe } from 'mocha';
import chai from 'chai';
import sinon from 'sinon';
import Controller from '../../../src/controllers/Controller';
import Mail from '../../../src/models/Mail';
import fixtures from '../fixtures';
import helperValidation from '../../helper/stubValidation';

const assert = chai.assert;
const controller = new Controller();
const stubValidation = new helperValidation();

describe('test for controllers/Controller', () => {
  describe('positive test', () => {
    before(function() {
      this.correctFetchListStub = sinon.stub(
        Mail.prototype,
        'fetchRegisteredMailList'
      );
    });
    after(function() {
      this.correctFetchListStub.restore();
    });
    it('test for fetchMailList', async function() {
      const req = { params: { id: undefined } };
      const res = {
        json: function(body) {
          assert.strictEqual(
            body.text,
            fixtures.testValues.stubReturnValue.body.text
          );
        },
        status: function(responseStatus) {
          assert.strictEqual(
            responseStatus,
            fixtures.testValues.stubReturnValue.status
          );
          return this;
        },
      };

      this.correctFetchListStub.returns(fixtures.testValues.stubReturnValue);
      await controller.fetchMailList(req, res);
    });

    it('No.2 isJsonValidation() have input type string return null', () => {
      const correctJsonFormat =
        '[{"name":"Yahoo! users mailing list","address":"yahoo-users@ml.your.domain.jp"},{"name":"Yahoo! admin. ml","address":"yahoo-admin@ml.your.domain.jp"}]';
      const except = '';
      const actual = Controller.isJsonValidation(correctJsonFormat);
      assert.deepEqual(actual, except);
    });

    it('No.3 isJsonValidation() have input type string return null', () => {
      const correctJsonFormat = '[{}]';
      const except = '';
      const actual = Controller.isJsonValidation(correctJsonFormat);
      assert.deepEqual(actual, except);
    });

    it('No.4 isJsonValidation() have input type array return null', () => {
      const correctJsonFormat = [
        {
          name: 'Yahoo! users mailing list',
          address: 'yahoo-users@ml.your.domain.jp',
        },
        { name: 'Yahoo! admin. ml', address: 'yahoo-admin@ml.your.domain.jp' },
      ];
      const except = '';
      const actual = Controller.isJsonValidation(correctJsonFormat);
      assert.deepEqual(actual, except);
    });

    it('No.5 isJsonValidation() have input type array null return null', () => {
      const correctJsonFormat = [];
      const except = '';
      const actual = Controller.isJsonValidation(correctJsonFormat);
      assert.deepEqual(actual, except);
    });
  });
  describe('negative test', () => {
    before(function() {
      this.incorrectRegisterListStub = sinon.stub(
        Controller.prototype,
        'registerMailToListController'
      );
      this.incorrectFetchListStub = sinon.stub(
        Controller.prototype,
        'fetchMailList'
      );
    });
    after(function() {
      this.incorrectRegisterListStub.restore();
      this.incorrectFetchListStub.restore();
    });

    it('No.1 isJsonValidation() have input type string but incorrect format return error message', () => {
      const incorrectJsonFormat = 'This is a invalid json format.';
      const except = 'SyntaxError: Unexpected token T in JSON at position 0';
      const actual = Controller.isJsonValidation(incorrectJsonFormat);
      assert.deepEqual(actual, except);
    });

    it('No.6 isJsonValidation() in registerMailToListController() have input type string but incorrect format return error message', async function() {
      const req = {
        body: 'This is a invalid json format.',
      };
      const res = {
        json: function(body) {
          assert.strictEqual(
            body.error.code,
            fixtures.httpStatus.INTERNAL_SERVER.code
          );
        },
        status: function(responseStatus) {
          assert.strictEqual(
            responseStatus,
            fixtures.httpStatus.INTERNAL_SERVER.status
          );
          return this;
        },
      };
      // this.incorrectRegisterListStub.returns(
      //   fixtures.testValues.stubReturnValue
      // );
      const abc = await controller.registerMailToListController(req, res);
      console.log(abc);
    });
  });
});
