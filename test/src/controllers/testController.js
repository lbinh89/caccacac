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
    before(function () {
      this.correctFetchListStub = sinon.stub(
        Mail.prototype,
        'fetchRegisteredMailList'
      );
    });
    after(function () {
      this.correctFetchListStub.restore();
    });
    it('test for fetchMailList', async function () {
      const req = { params: { id: undefined } };
      const res = {
        json: function (body) {
          assert.strictEqual(
            body.text,
            fixtures.testValues.stubReturnValue.body.text
          );
        },
        status: function (responseStatus) {
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

    it('test for jsonValidation() correct return true', () => {
      const correctJsonFormat = '[{"name":"Yahoo! users mailing list","address":"yahoo-users@ml.your.domain.jp"},{"name":"Yahoo! admin. ml","address":"yahoo-admin@ml.your.domain.jp"}]';
      const except = true;
      const actual = controller.jsonValidation(correctJsonFormat);
      assert.deepEqual(actual, except);
    });

    it('test for jsonValidation() correct return true', () => {
      const correctJsonFormat = '[{}]';
      const except = true;
      const actual = controller.jsonValidation(correctJsonFormat);
      assert.deepEqual(actual, except);
    });

    it('test for jsonValidation() correct return true', () => {
        const incorrectJsonFormat = [{"name":"Yahoo! users mailing list","address":"yahoo-users@ml.your.domain.jp"},{"name":"Yahoo! admin. ml","address":"yahoo-admin@ml.your.domain.jp"}];
        const except = true;
        const actual = controller.jsonValidation(incorrectJsonFormat);
        assert.deepEqual(actual, except);
    });

    it('test for jsonValidation() correct return true', () => {
        const incorrectJsonFormat = [];
        const except = true;
        const actual = controller.jsonValidation(incorrectJsonFormat);
        assert.deepEqual(actual, except);
    });
  });
  describe('negative test', () => {

    before(function () {
      this.incorrectFetchListStub = sinon.stub(
        Mail.prototype,
        'fetchRegisteredMailList'
      );
      // this.incorrectRegisterListStub = sinon.stub(
      //   Controller.prototype,
      //   'registerMailToListController'
      // );
    });
    after(function () {
      this.incorrectFetchListStub.restore();
      // this.incorrectRegisterListStub.restore();
    });

    it('test for jsonValidation() incorrect return false', () => {
      const incorrectJsonFormat = 'This is a invalid json format.';
      const except = false;
      const actual = controller.jsonValidation(incorrectJsonFormat);
      assert.deepEqual(actual, except);
    });

    it.only('No 1: registerMailToListController() have mail address null return error', async function () {
      const req = {body: [{name: "Yahoo! users mailing list",address: ""},{name: "Yahoo! admin. ml",address: "yahoo-admin@ml.your.domain.jp"}]};
      const res = {
        json: function (body) {
          console.log(body);
          assert.strictEqual(
            body.error.code,
            fixtures.httpStatus.FORMAT_INVALID.code
          );
          assert.strictEqual(
            body.error.message,
            "{address}がありませんでした。{address}を入力してください。"
          );
        },
        status: function (responseStatus) {
          assert.strictEqual(
            responseStatus,
            fixtures.httpStatus.FORMAT_INVALID.status
          );
          return this;
        },
      };
      // this.incorrectRegisterListStub.returns(fixtures.testValues.stubAddressIncorrect);
      await controller.registerMailToListController(req, res)
    });
  });
});
