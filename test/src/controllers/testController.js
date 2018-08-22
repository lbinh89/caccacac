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
  });
  describe('negative test', () => {});
});
