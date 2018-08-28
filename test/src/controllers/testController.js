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

    it('test for jsonValidation() correct return true', () => {
      const correctJsonFormat =
        '[{"name":"Yahoo! users mailing list","address":"yahoo-users@ml.your.domain.jp"},{"name":"Yahoo! admin. ml","address":"yahoo-admin@ml.your.domain.jp"}]';
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
      const correctJsonFormat = [
        {
          name: 'Yahoo! users mailing list',
          address: 'yahoo-users@ml.your.domain.jp',
        },
        { name: 'Yahoo! admin. ml', address: 'yahoo-admin@ml.your.domain.jp' },
      ];
      const except = true;
      const actual = controller.jsonValidation(correctJsonFormat);
      assert.deepEqual(actual, except);
    });

    it('test for jsonValidation() correct return true', () => {
      const correctJsonFormat = [];
      const except = true;
      const actual = controller.jsonValidation(correctJsonFormat);
      assert.deepEqual(actual, except);
    });
  });
  describe('negative test', () => {
    before(function() {
      this.incorrectRegisterListStub = sinon.stub(
        Controller.prototype,
        'registerMailToListController'
      );
    });
    after(function() {
      this.incorrectRegisterListStub.restore();
    });

    it('test for jsonValidation() incorrect return false', () => {
      const incorrectJsonFormat = 'This is a invalid json format.';
      const except = false;
      const actual = controller.jsonValidation(incorrectJsonFormat);
      assert.deepEqual(actual, except);
    });

    it.only('No 1: registerMailToListController() have mail address null return error', async function() {
      try {
        const req = {
          body: [{ name: 'Yahoo! users mailing list', address: '' }],
        };
        const res = {
          json: function(body) {
            console.log(body);
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.FORMAT_INVALID.code
            );
            assert.strictEqual(
              body.error.message,
              '次のフィールドが存在しないため、登録できませんでした。登録フォーマットを確認してください。mail address1'
            );
          },
          status: function(responseStatus) {
            assert.strictEqual(
              responseStatus,
              fixtures.httpStatus.FORMAT_INVALID.status
            );
            return this;
          },
        };
        this.incorrectRegisterListStub.returns(
          fixtures.testValues.stubAddressIncorrect
        );
        const result = await controller.registerMailToListController(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_ML_FORMAT_INVALID');
        assert.strictEqual(
          jsonResult.error.message,
          '{address}がありませんでした。{address}を入力してください。'
        );
        assert.strictEqual(result.status, 400);
      } catch (e) {
        console.log(e);
      }
    });

    it.only('No 2: registerMailToListController() have mail address not null 1 byte not return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-admin1@ml.your.domain.jp',
              address: 'yahoo-admin1@ml.your.domain.jp',
            },
          ],
        };
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 3: registerMailToListController() have mail address not null 2 byte return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-admin2@ml.your.domain.jp',
              address: 'yahoo-admin２@ml.your.domain.jp',
            },
          ],
        };
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 4: registerMailToListController() have mail address not null 1 byte not return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-admin3@ml.your.domain.jp',
              address: 'yahoo-admin3@ml.your.domain.jp',
            },
          ],
        };
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 5: registerMailToListController() have mail address not null 2 byte return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-admin4@ml.your.domain.jp',
              address: 'yahoo-なか4@ml.your.domain.jp',
            },
          ],
        };
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 6: registerMailToListController() have mail address not null specific symboy return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-admin5@ml.your.domain.jp',
              address: '#$yahoo-admin5@ml.your.domain.jp!*&',
            },
          ],
        };
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 7: registerMailToListController() have mail address not null 1 byte (number and string) not return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-admin6@ml.your.domain.jp',
              address: 'yahoo-admin6@ml.your.domain.jp',
            },
          ],
        };
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 8: registerMailToListController() have mail address not null 2 byte (number and string) return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-admin7@ml.your.domain.jp',
              address: 'やウフ-admin７@ml.your.domain.jp',
            },
          ],
        };
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 9: registerMailToListController() have mail address not null number 1 byte string 2 byte return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-admin8@ml.your.domain.jp',
              address: 'やウフの-admin8@ml.your.domain.jp',
            },
          ],
        };
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 10: registerMailToListController() have mail address not null number 2 byte string 1 byte return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-admin9@ml.your.domain.jp',
              address: 'yahoo-admin９@ml.your.domain.jp',
            },
          ],
        };
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 11: registerMailToListController() have mail address not null not email format(no @) return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-admin10@ml.your.domain.jp',
              address: 'yahoo-admin10ml.your.domain.jp',
            },
          ],
        };
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 12: registerMailToListController() have name null return error', async function() {
      try {
        const req = {
          body: [
            {
              name: null,
              address: 'yahoo-admin11@ml.your.domain.jp',
            },
          ],
        };
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 13: registerMailToListController() have name not null number 1 byte not return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-admin11',
              address: 'address":"yahoo-admin11@ml.your.domain.jp',
            },
          ],
        };
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 14: registerMailToListController() have name not null number 2 byte not return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-admin1２',
              address: 'yahoo-admin12@ml.your.domain.jp',
            },
          ],
        };
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 15: registerMailToListController() have name not null string 1 byte not return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-admin13',
              address: 'address":"yahoo-admin13@ml.your.domain.jp',
            },
          ],
        };
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 16: registerMailToListController() have name not null string 2 byte not return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-アドミン14',
              address: 'yahoo-admin14@ml.your.domain.jp',
            },
          ],
        };
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 17: registerMailToListController() have name not null specific symboy return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-$%admin15@#',
              address: 'yahoo-admin15@ml.your.domain.jp',
            },
          ],
        };
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 18: registerMailToListController() have name not null 1 byte (number and string) not return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-admin16',
              address: 'yahoo-admin16@ml.your.domain.jp',
            },
          ],
        };
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 19: registerMailToListController() have name not null 2 byte (number and string) not return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-アドミン１７',
              address: 'yahoo-admin17@ml.your.domain.jp',
            },
          ],
        };
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 20: registerMailToListController() have name not null number 1 byte string 2 byte not return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-アドミン18',
              address: 'yahoo-admin18@ml.your.domain.jp',
            },
          ],
        };
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 21: registerMailToListController() have name not null number 2 byte string 1 byte not return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-admin１９',
              address: 'yahoo-admin19@ml.your.domain.jp',
            },
          ],
        };
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 22: registerMailToListController() have number ML is 0 return error', async function() {
      try {
        const req = {
          body: [{}],
        };
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 23: registerMailToListController() have number ML is 1 address null name null return error', async function() {
      try {
        const req = {
          body: [
            {
              name: null,
              address: null,
            },
          ],
        };
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 24: registerMailToListController() have number ML is 1 name right address right not return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-admin23',
              address: 'yahoo-admin23@ml.your.domain.jp',
            },
          ],
        };
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 25: registerMailToListController() have number ML is 1 name right address wrong return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-admin24',
              address: 'yahoo-admin24',
            },
          ],
        };
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 26: registerMailToListController() have number ML is 1 name wrong address null return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-admin25%$',
              address: null,
            },
          ],
        };
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 27: registerMailToListController() have number ML is 1 name wrong address right return error', async function() {
      try {
        const req = {
          body: [
            {
              name: '@#^yahoo-admin26',
              address: 'yahoo-admin26@ml.your.domain.jp',
            },
          ],
        };
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 28: registerMailToListController() have number ML is 1 name wrong address wrong return error', async function() {
      try {
        const req = {
          body: [
            {
              name: '@#^yahoo-admin27',
              address: 'yahoo-admin27ml.your.domain.jp',
            },
          ],
        };
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 29: registerMailToListController() have number ML is 2 name right address null return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-アドミン28',
              address: null,
            },
            {
              name: 'yahoo-アドミン29',
              address: null,
            },
          ],
        };
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 30: registerMailToListController() have number ML is 2 name right address right not return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-アドミン30',
              address: 'yahoo-admin30@ml.your.domain.jp',
            },
            {
              name: 'yahoo-アドミン31',
              address: 'yahoo-admin31@ml.your.domain.jp',
            },
          ],
        };
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 31: registerMailToListController() have number ML is 2 name right address wrong return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-アドミン32',
              address: 'yahoo-admin32ml.your.domain.jp',
            },
            {
              name: 'yahoo-アドミン33',
              address: 'yahoo-admin33ml.your.domain.jp',
            },
          ],
        };
      } catch (e) {
        console.log(e);
      }
    });
  });
});
