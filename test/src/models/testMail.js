import { describe } from 'mocha';
import chai from 'chai';
import nock from 'nock';
import Mail from '../../../src/models/Mail';
import fixtures from '../fixtures';

const assert = chai.assert;
const mail = new Mail();
const URL = `http://localhost:3003`;
const path = `/ml`;

describe('test for models/Mail', () => {
  describe('positive test', () => {
    it('test for constructor', function() {
      assert.strictEqual(
        fixtures.testValues.MailTest.constructor.url,
        mail.url
      );
      assert.strictEqual(
        fixtures.testValues.MailTest.constructor.path,
        mail.path
      );
    });
    it('test for fetchRegisteredMailList', async function() {
      const values = { query: { id: undefined } };
      nock(URL)
        .get(path)
        .reply(200, 'OK');

      const response = await mail.fetchRegisteredMailList(values);
      assert.strictEqual('OK', response.text);
    });
  });
});
