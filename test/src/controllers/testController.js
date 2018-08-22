import { describe } from 'mocha';
import chai from 'chai';
import sinon from 'sinon';
import Controller from '../../../src/controllers/Controller';
import Mail from '../../../src/models/Mail';
import fixtures from '../fixtures';

const assert = chai.assert;
const controller = new Controller();

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

    it('test for fetchMailList()', async function() {
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

    it('test for checkJson()', () => {
      const correctJsonFormat = '[{"name":"Yahoo! users mailing list","address":"yahoo-users@ml.your.domain.jp"},{"name":"Yahoo! admin. ml","address":"yahoo-admin@ml.your.domain.jp"}]';
      const except = [
        {
          "name": "Yahoo! users mailing list",
          "address": "yahoo-users@ml.your.domain.jp"
        },
        {
          "name": "Yahoo! admin. ml",
          "address": "yahoo-admin@ml.your.domain.jp"
        }
      ];
      const actual = controller.jsonValidation(correctJsonFormat);
      assert.deepEqual(actual,except);
    });

    it('test for checkJson()', () => {
      const correctJsonFormat = '[{}]';
      const except = [{}];
      const actual = controller.jsonValidation(correctJsonFormat);
      assert.deepEqual(actual,except);
    });
  });
  describe('negative test', () => {

    before(function() {
      this.incorrectFetchListStub = sinon.stub(
        Mail.prototype,
        'fetchRegisteredMailList'
      );
    });
    after(function() {
      this.incorrectFetchListStub.restore();
    });

    it('test for checkJson() invalid json format return throws error', () => {
      // const incorrectJsonFormat = 'This is a invalid json format.';
      // const actual = controller.jsonValidation(incorrectJsonFormat);
      // console.log(actual);
      // const except = new SyntaxError('Unexpected token T in JSON at position 0');
      // assert.deepEqual(actual,except);

      try{
        const incorrectJsonFormat = 'This is a invalid json format.';
        actual = controller.jsonValidation(incorrectJsonFormat);
      }catch (e) {
        assert.equal(e.message, 'Unexpected token T in JSON at position 0');
      }
    });
  });
});
