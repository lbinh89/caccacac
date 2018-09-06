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
    afterEach(function() {
      nock.cleanAll();
    });
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
    it('test for registerMailToListModel', async function() {
      const values = [
        {
          name: 'yahoo-アドミン30',
          address: 'yahoo-admin30@ml.your.domain.jp',
        },
        {
          name: 'yahoo-アドミン31',
          address: 'yahoo-admin31@ml.your.domain.jp',
        },
      ];

      const responseValues = {
        body: {
          id: 1,
          name: 'yahoo-アドミン30',
          address: 'yahoo-admin30@ml.your.domain.jp',
        },
      };
      nock(URL, { allowUnmocked: true })
        .post(path, {})
        .reply(201, responseValues);

      const response = await mail.registerMailToListModel(values);
      assert.isTrue(response.length === 2);
    });
  });
});
