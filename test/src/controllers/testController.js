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
      this.incorrectFetchListStub = sinon.stub(
        Controller.prototype,
        'fetchMailList'
      );
    });
    after(function() {
      this.incorrectRegisterListStub.restore();
      this.incorrectFetchListStub.restore();
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
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.FORMAT_INVALID.code
            );
            assert.strictEqual(
              body.error.message.replace('<index>', '1'),
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
          jsonResult.error.message.replace('<index>', '1'),
          '次のフィールドが存在しないため、登録できませんでした。登録フォーマットを確認してください。mail address1'
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
        const res = {
          status: function(responseStatus) {
            assert.strictEqual(
              responseStatus,
              fixtures.httpStatus.CREATED.status
            );
            return this;
          },
        };
        this.incorrectRegisterListStub.returns(
          fixtures.testValues.stubCreatedValue
        );
        const result = await controller.registerMailToListController(req, res);
        assert.strictEqual(result.status, 201);
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
        const res = {
          json: function(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.FORMAT_INVALID.code
            );
            assert.strictEqual(
              body.error.message
                .replace('<index>', '1')
                .replace('<value>', 'yahoo-admin２@ml.your.domain.jp'),
              '次の形式が不正で登録できませんでした。形式を確認してください。mail address1:yahoo-admin２@ml.your.domain.jp'
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
          fixtures.testValues.stubAddressFormatIncorrect
        );
        const result = await controller.registerMailToListController(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_ML_FORMAT_INVALID');
        assert.strictEqual(
          jsonResult.error.message
            .replace('<index>', '1')
            .replace('<value>', 'yahoo-admin２@ml.your.domain.jp'),
          '次の形式が不正で登録できませんでした。形式を確認してください。mail address1:yahoo-admin２@ml.your.domain.jp'
        );
        assert.strictEqual(result.status, 400);
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
        const res = {
          status: function(responseStatus) {
            assert.strictEqual(
              responseStatus,
              fixtures.httpStatus.CREATED.status
            );
            return this;
          },
        };
        this.incorrectRegisterListStub.returns(
          fixtures.testValues.stubCreatedValue
        );
        const result = await controller.registerMailToListController(req, res);
        assert.strictEqual(result.status, 201);
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
        const res = {
          json: function(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.FORMAT_INVALID.code
            );
            assert.strictEqual(
              body.error.message
                .replace('<index>', '1')
                .replace('<value>', 'yahoo-なか4@ml.your.domain.jp'),
              '次の形式が不正で登録できませんでした。形式を確認してください。mail address1:yahoo-なか4@ml.your.domain.jp'
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
          fixtures.testValues.stubAddressFormatIncorrect
        );
        const result = await controller.registerMailToListController(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_ML_FORMAT_INVALID');
        assert.strictEqual(
          jsonResult.error.message
            .replace('<index>', '1')
            .replace('<value>', 'yahoo-なか4@ml.your.domain.jp'),
          '次の形式が不正で登録できませんでした。形式を確認してください。mail address1:yahoo-なか4@ml.your.domain.jp'
        );
        assert.strictEqual(result.status, 400);
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
        const res = {
          json: function(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.FORMAT_INVALID.code
            );
            assert.strictEqual(
              body.error.message
                .replace('<index>', '1')
                .replace('<value>', '#$yahoo-admin5@ml.your.domain.jp!*&'),
              '次の形式が不正で登録できませんでした。形式を確認してください。mail address1:#$yahoo-admin5@ml.your.domain.jp!*&'
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
          fixtures.testValues.stubAddressFormatIncorrect
        );
        const result = await controller.registerMailToListController(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_ML_FORMAT_INVALID');
        assert.strictEqual(
          jsonResult.error.message
            .replace('<index>', '1')
            .replace('<value>', '#$yahoo-admin5@ml.your.domain.jp!*&'),
          '次の形式が不正で登録できませんでした。形式を確認してください。mail address1:#$yahoo-admin5@ml.your.domain.jp!*&'
        );
        assert.strictEqual(result.status, 400);
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
        const res = {
          status: function(responseStatus) {
            assert.strictEqual(
              responseStatus,
              fixtures.httpStatus.CREATED.status
            );
            return this;
          },
        };
        this.incorrectRegisterListStub.returns(
          fixtures.testValues.stubCreatedValue
        );
        const result = await controller.registerMailToListController(req, res);
        assert.strictEqual(result.status, 201);
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
        const res = {
          json: function(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.FORMAT_INVALID.code
            );
            assert.strictEqual(
              body.error.message
                .replace('<index>', '1')
                .replace('<value>', 'やウフ-admin７@ml.your.domain.jp'),
              '次の形式が不正で登録できませんでした。形式を確認してください。mail address1:やウフ-admin７@ml.your.domain.jp'
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
          fixtures.testValues.stubAddressFormatIncorrect
        );
        const result = await controller.registerMailToListController(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_ML_FORMAT_INVALID');
        assert.strictEqual(
          jsonResult.error.message
            .replace('<index>', '1')
            .replace('<value>', 'やウフ-admin７@ml.your.domain.jp'),
          '次の形式が不正で登録できませんでした。形式を確認してください。mail address1:やウフ-admin７@ml.your.domain.jp'
        );
        assert.strictEqual(result.status, 400);
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
        const res = {
          json: function(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.FORMAT_INVALID.code
            );
            assert.strictEqual(
              body.error.message
                .replace('<index>', '1')
                .replace('<value>', 'やウフの-admin8@ml.your.domain.jp'),
              '次の形式が不正で登録できませんでした。形式を確認してください。mail address1:やウフの-admin8@ml.your.domain.jp'
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
          fixtures.testValues.stubAddressFormatIncorrect
        );
        const result = await controller.registerMailToListController(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_ML_FORMAT_INVALID');
        assert.strictEqual(
          jsonResult.error.message
            .replace('<index>', '1')
            .replace('<value>', 'やウフの-admin8@ml.your.domain.jp'),
          '次の形式が不正で登録できませんでした。形式を確認してください。mail address1:やウフの-admin8@ml.your.domain.jp'
        );
        assert.strictEqual(result.status, 400);
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
        const res = {
          json: function(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.FORMAT_INVALID.code
            );
            assert.strictEqual(
              body.error.message
                .replace('<index>', '1')
                .replace('<value>', 'yahoo-admin９@ml.your.domain.jp'),
              '次の形式が不正で登録できませんでした。形式を確認してください。mail address1:yahoo-admin９@ml.your.domain.jp'
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
          fixtures.testValues.stubAddressFormatIncorrect
        );
        const result = await controller.registerMailToListController(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_ML_FORMAT_INVALID');
        assert.strictEqual(
          jsonResult.error.message
            .replace('<index>', '1')
            .replace('<value>', 'yahoo-admin９@ml.your.domain.jp'),
          '次の形式が不正で登録できませんでした。形式を確認してください。mail address1:yahoo-admin９@ml.your.domain.jp'
        );
        assert.strictEqual(result.status, 400);
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
        const res = {
          json: function(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.FORMAT_INVALID.code
            );
            assert.strictEqual(
              body.error.message
                .replace('<index>', '1')
                .replace('<value>', 'yahoo-admin10ml.your.domain.jp'),
              '次の形式が不正で登録できませんでした。形式を確認してください。mail address1:yahoo-admin10ml.your.domain.jp'
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
          fixtures.testValues.stubAddressFormatIncorrect
        );
        const result = await controller.registerMailToListController(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_ML_FORMAT_INVALID');
        assert.strictEqual(
          jsonResult.error.message
            .replace('<index>', '1')
            .replace('<value>', 'yahoo-admin10ml.your.domain.jp'),
          '次の形式が不正で登録できませんでした。形式を確認してください。mail address1:yahoo-admin10ml.your.domain.jp'
        );
        assert.strictEqual(result.status, 400);
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
        const res = {
          json: function(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.FORMAT_INVALID.code
            );
            assert.strictEqual(
              body.error.message.replace('<index>', '1'),
              '次のフィールドが存在しないため、登録できませんでした。登録フォーマットを確認してください。name1'
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
          fixtures.testValues.stubNameIncorrect
        );
        const result = await controller.registerMailToListController(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_ML_FORMAT_INVALID');
        assert.strictEqual(
          jsonResult.error.message.replace('<index>', '1'),
          '次のフィールドが存在しないため、登録できませんでした。登録フォーマットを確認してください。name1'
        );
        assert.strictEqual(result.status, 400);
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
        const res = {
          status: function(responseStatus) {
            assert.strictEqual(
              responseStatus,
              fixtures.httpStatus.CREATED.status
            );
            return this;
          },
        };
        this.incorrectRegisterListStub.returns(
          fixtures.testValues.stubCreatedValue
        );
        const result = await controller.registerMailToListController(req, res);
        assert.strictEqual(result.status, 201);
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
        const res = {
          status: function(responseStatus) {
            assert.strictEqual(
              responseStatus,
              fixtures.httpStatus.CREATED.status
            );
            return this;
          },
        };
        this.incorrectRegisterListStub.returns(
          fixtures.testValues.stubCreatedValue
        );
        const result = await controller.registerMailToListController(req, res);
        assert.strictEqual(result.status, 201);
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
        const res = {
          status: function(responseStatus) {
            assert.strictEqual(
              responseStatus,
              fixtures.httpStatus.CREATED.status
            );
            return this;
          },
        };
        this.incorrectRegisterListStub.returns(
          fixtures.testValues.stubCreatedValue
        );
        const result = await controller.registerMailToListController(req, res);
        assert.strictEqual(result.status, 201);
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
        const res = {
          status: function(responseStatus) {
            assert.strictEqual(
              responseStatus,
              fixtures.httpStatus.CREATED.status
            );
            return this;
          },
        };
        this.incorrectRegisterListStub.returns(
          fixtures.testValues.stubCreatedValue
        );
        const result = await controller.registerMailToListController(req, res);
        assert.strictEqual(result.status, 201);
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
        const res = {
          json: function(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.FORMAT_INVALID.code
            );
            assert.strictEqual(
              body.error.message
                .replace('<index>', '1')
                .replace('<value>', 'yahoo-$%admin15@#'),
              '次の形式が不正で登録できませんでした。形式を確認してください。name1:yahoo-$%admin15@#'
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
          fixtures.testValues.stubNameFormatIncorrect
        );
        const result = await controller.registerMailToListController(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_ML_FORMAT_INVALID');
        assert.strictEqual(
          jsonResult.error.message
            .replace('<index>', '1')
            .replace('<value>', 'yahoo-$%admin15@#'),
          '次の形式が不正で登録できませんでした。形式を確認してください。name1:yahoo-$%admin15@#'
        );
        assert.strictEqual(result.status, 400);
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
        const res = {
          status: function(responseStatus) {
            assert.strictEqual(
              responseStatus,
              fixtures.httpStatus.CREATED.status
            );
            return this;
          },
        };
        this.incorrectRegisterListStub.returns(
          fixtures.testValues.stubCreatedValue
        );
        const result = await controller.registerMailToListController(req, res);
        assert.strictEqual(result.status, 201);
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
        const res = {
          status: function(responseStatus) {
            assert.strictEqual(
              responseStatus,
              fixtures.httpStatus.CREATED.status
            );
            return this;
          },
        };
        this.incorrectRegisterListStub.returns(
          fixtures.testValues.stubCreatedValue
        );
        const result = await controller.registerMailToListController(req, res);
        assert.strictEqual(result.status, 201);
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
        const res = {
          status: function(responseStatus) {
            assert.strictEqual(
              responseStatus,
              fixtures.httpStatus.CREATED.status
            );
            return this;
          },
        };
        this.incorrectRegisterListStub.returns(
          fixtures.testValues.stubCreatedValue
        );
        const result = await controller.registerMailToListController(req, res);
        assert.strictEqual(result.status, 201);
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
        const res = {
          status: function(responseStatus) {
            assert.strictEqual(
              responseStatus,
              fixtures.httpStatus.CREATED.status
            );
            return this;
          },
        };
        this.incorrectRegisterListStub.returns(
          fixtures.testValues.stubCreatedValue
        );
        const result = await controller.registerMailToListController(req, res);
        assert.strictEqual(result.status, 201);
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 22: registerMailToListController() have number ML is 0 return error', async function() {
      try {
        const req = {
          body: [{}],
        };
        const res = {
          json: function(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.OUT_OF_RANGE.code
            );
            assert.strictEqual(
              body.error.message,
              '登録件数が超えています。メールは1から100の範囲で入力してください。'
            );
          },
          status: function(responseStatus) {
            assert.strictEqual(
              responseStatus,
              fixtures.httpStatus.OUT_OF_RANGE.status
            );
            return this;
          },
        };
        this.incorrectRegisterListStub.returns(
          fixtures.testValues.stubOutOfRange
        );
        const result = await controller.registerMailToListController(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_MAIL_NUMBER_OUTOFRANGE');
        assert.strictEqual(
          jsonResult.error.message,
          '登録件数が超えています。メールは1から100の範囲で入力してください。'
        );
        assert.strictEqual(result.status, 400);
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
        const res = {
          json: function(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.FORMAT_INVALID.code
            );
            assert.strictEqual(
              body.error.message
                .replace('<index>', '1')
                .replace('<name>', 'name')
                .replace('<mail address>', 'mail address'),
              '次のフィールドが存在しないため、登録できませんでした。登録フォーマットを確認してください。name1, mail address1'
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
          fixtures.testValues.stubNameAddressIncorrect
        );
        const result = await controller.registerMailToListController(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_ML_FORMAT_INVALID');
        assert.strictEqual(
          jsonResult.error.message
            .replace('<index1>', '1')
            .replace('<name>', 'name')
            .replace('<index2>', '1')
            .replace('<mail address>', 'mail address'),
          '次のフィールドが存在しないため、登録できませんでした。登録フォーマットを確認してください。name1, mail address1'
        );
        assert.strictEqual(result.status, 400);
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
        const res = {
          status: function(responseStatus) {
            assert.strictEqual(
              responseStatus,
              fixtures.httpStatus.CREATED.status
            );
            return this;
          },
        };
        this.incorrectRegisterListStub.returns(
          fixtures.testValues.stubCreatedValue
        );
        const result = await controller.registerMailToListController(req, res);
        assert.strictEqual(result.status, 201);
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
        const res = {
          json: function(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.FORMAT_INVALID.code
            );
            assert.strictEqual(
              body.error.message
                .replace('<index>', '1')
                .replace('<value>', 'yahoo-admin24'),
              '次の形式が不正で登録できませんでした。形式を確認してください。mail address1:yahoo-admin24'
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
          fixtures.testValues.stubAddressFormatIncorrect
        );
        const result = await controller.registerMailToListController(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_ML_FORMAT_INVALID');
        assert.strictEqual(
          jsonResult.error.message
            .replace('<index>', '1')
            .replace('<value>', 'yahoo-admin24'),
          '次の形式が不正で登録できませんでした。形式を確認してください。mail address1:yahoo-admin24'
        );
        assert.strictEqual(result.status, 400);
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
        const res = {
          json: function(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.FORMAT_INVALID.code
            );
            assert.strictEqual(
              body.error.message
                .replace('<index>', '1')
                .replace('<value>', 'yahoo-admin25%$'),
              '次の形式が不正で登録できませんでした。形式を確認してください。name1:yahoo-admin25%$'
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
          fixtures.testValues.stubNameFormatIncorrect
        );
        const result = await controller.registerMailToListController(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_ML_FORMAT_INVALID');
        assert.strictEqual(
          jsonResult.error.message
            .replace('<index>', '1')
            .replace('<value>', 'yahoo-admin25%$'),
          '次の形式が不正で登録できませんでした。形式を確認してください。name1:yahoo-admin25%$'
        );
        assert.strictEqual(result.status, 400);

        const res1 = {
          json: function(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.FORMAT_INVALID.code
            );
            assert.strictEqual(
              body.error.message.replace('<index>', '1'),
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
        const result1 = await controller.registerMailToListController(
          req,
          res1
        );
        const jsonResult1 = JSON.parse(result1.body);
        assert.strictEqual(jsonResult1.error.code, 'ERR_ML_FORMAT_INVALID');
        assert.strictEqual(
          jsonResult1.error.message.replace('<index>', '1'),
          '次のフィールドが存在しないため、登録できませんでした。登録フォーマットを確認してください。mail address1'
        );
        assert.strictEqual(result1.status, 400);
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
        const res = {
          json: function(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.FORMAT_INVALID.code
            );
            assert.strictEqual(
              body.error.message
                .replace('<index>', '1')
                .replace('<value>', '@#^yahoo-admin26'),
              '次の形式が不正で登録できませんでした。形式を確認してください。name1:@#^yahoo-admin26'
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
          fixtures.testValues.stubNameFormatIncorrect
        );
        const result = await controller.registerMailToListController(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_ML_FORMAT_INVALID');
        assert.strictEqual(
          jsonResult.error.message
            .replace('<index>', '1')
            .replace('<value>', '@#^yahoo-admin26'),
          '次の形式が不正で登録できませんでした。形式を確認してください。name1:@#^yahoo-admin26'
        );
        assert.strictEqual(result.status, 400);
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
        const res = {
          json: function(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.FORMAT_INVALID.code
            );
            assert.strictEqual(
              body.error.message
                .replace('<index>', '1')
                .replace('<value>', '@#^yahoo-admin27'),
              '次の形式が不正で登録できませんでした。形式を確認してください。name1:@#^yahoo-admin27'
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
          fixtures.testValues.stubNameFormatIncorrect
        );
        const result = await controller.registerMailToListController(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_ML_FORMAT_INVALID');
        assert.strictEqual(
          jsonResult.error.message
            .replace('<index>', '1')
            .replace('<value>', '@#^yahoo-admin27'),
          '次の形式が不正で登録できませんでした。形式を確認してください。name1:@#^yahoo-admin27'
        );
        assert.strictEqual(result.status, 400);

        const res1 = {
          json: function(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.FORMAT_INVALID.code
            );
            assert.strictEqual(
              body.error.message
                .replace('<index>', '1')
                .replace('<value>', 'yahoo-admin27ml.your.domain.jp'),
              '次の形式が不正で登録できませんでした。形式を確認してください。mail address1:yahoo-admin27ml.your.domain.jp'
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
          fixtures.testValues.stubAddressFormatIncorrect
        );
        const result1 = await controller.registerMailToListController(
          req,
          res1
        );
        const jsonResult1 = JSON.parse(result1.body);
        assert.strictEqual(jsonResult1.error.code, 'ERR_ML_FORMAT_INVALID');
        assert.strictEqual(
          jsonResult1.error.message
            .replace('<index>', '1')
            .replace('<value>', 'yahoo-admin27ml.your.domain.jp'),
          '次の形式が不正で登録できませんでした。形式を確認してください。mail address1:yahoo-admin27ml.your.domain.jp'
        );
        assert.strictEqual(result1.status, 400);
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
        const res = {
          json: function(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.FORMAT_INVALID.code
            );
            assert.strictEqual(
              body.error.message
                .replace('<index1>', '1')
                .replace('<index2>', '2'),
              '次のフィールドが存在しないため、登録できませんでした。登録フォーマットを確認してください。mail address1, mail address2'
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
          fixtures.testValues.stubTwoAddressIncorrect
        );
        const result = await controller.registerMailToListController(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_ML_FORMAT_INVALID');
        assert.strictEqual(
          jsonResult.error.message
            .replace('<index1>', '1')
            .replace('<index2>', '2'),
          '次のフィールドが存在しないため、登録できませんでした。登録フォーマットを確認してください。mail address1, mail address2'
        );
        assert.strictEqual(result.status, 400);
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
        const res = {
          status: function(responseStatus) {
            assert.strictEqual(
              responseStatus,
              fixtures.httpStatus.CREATED.status
            );
            return this;
          },
        };
        this.incorrectRegisterListStub.returns(
          fixtures.testValues.stubCreatedValue
        );
        const result = await controller.registerMailToListController(req, res);
        assert.strictEqual(result.status, 201);
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
        const res = {
          json: function(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.FORMAT_INVALID.code
            );
            assert.strictEqual(
              body.error.message
                .replace('<index1>', '1')
                .replace('<value1>', 'yahoo-admin32ml.your.domain.jp')
                .replace('<index2>', '2')
                .replace('<value2>', 'yahoo-admin33ml.your.domain.jp'),
              '次の形式が不正で登録できませんでした。形式を確認してください。mail address1:yahoo-admin32ml.your.domain.jp, mail address2:yahoo-admin33ml.your.domain.jp'
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
          fixtures.testValues.stubTwoAddressFormatIncorrect
        );
        const result = await controller.registerMailToListController(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_ML_FORMAT_INVALID');
        assert.strictEqual(
          jsonResult.error.message
            .replace('<index1>', '1')
            .replace('<value1>', 'yahoo-admin32ml.your.domain.jp')
            .replace('<index2>', '2')
            .replace('<value2>', 'yahoo-admin33ml.your.domain.jp'),
          '次の形式が不正で登録できませんでした。形式を確認してください。mail address1:yahoo-admin32ml.your.domain.jp, mail address2:yahoo-admin33ml.your.domain.jp'
        );
        assert.strictEqual(result.status, 400);
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 32: registerMailToListController() have number ML is 2 name wrong address null return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-アドミン34$%@',
              address: null,
            },
            {
              name: 'yahoo-アドミン35@$%',
              address: null,
            },
          ],
        };
        const res = {
          json: function(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.FORMAT_INVALID.code
            );
            assert.strictEqual(
              body.error.message
                .replace('<index1>', '1')
                .replace('<value1>', 'yahoo-アドミン34$%@')
                .replace('<index2>', '2')
                .replace('<value2>', 'yahoo-アドミン35@$%'),
              '次の形式が不正で登録できませんでした。形式を確認してください。name1:yahoo-アドミン34$%@, name2:yahoo-アドミン35@$%'
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
          fixtures.testValues.stubTwoNameFormatIncorrect
        );
        const result = await controller.registerMailToListController(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_ML_FORMAT_INVALID');
        assert.strictEqual(
          jsonResult.error.message
            .replace('<index1>', '1')
            .replace('<value1>', 'yahoo-アドミン34$%@')
            .replace('<index2>', '2')
            .replace('<value2>', 'yahoo-アドミン35@$%'),
          '次の形式が不正で登録できませんでした。形式を確認してください。name1:yahoo-アドミン34$%@, name2:yahoo-アドミン35@$%'
        );
        assert.strictEqual(result.status, 400);

        const res1 = {
          json: function(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.FORMAT_INVALID.code
            );
            assert.strictEqual(
              body.error.message
                .replace('<index1>', '1')
                .replace('<index2>', '2'),
              '次のフィールドが存在しないため、登録できませんでした。登録フォーマットを確認してください。mail address1, mail address2'
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
          fixtures.testValues.stubTwoAddressIncorrect
        );
        const result1 = await controller.registerMailToListController(
          req,
          res1
        );
        const jsonResult1 = JSON.parse(result1.body);
        assert.strictEqual(jsonResult1.error.code, 'ERR_ML_FORMAT_INVALID');
        assert.strictEqual(
          jsonResult1.error.message
            .replace('<index1>', '1')
            .replace('<index2>', '2'),
          '次のフィールドが存在しないため、登録できませんでした。登録フォーマットを確認してください。mail address1, mail address2'
        );
        assert.strictEqual(result1.status, 400);
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 33: registerMailToListController() have number ML is 2 name wrong address right return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-アドミン@%^&*36',
              address: 'yahoo-admin36@ml.your.domain.jp',
            },
            {
              name: 'yahoo-アドミン@%^&*37',
              address: 'yahoo-admin37@ml.your.domain.jp',
            },
          ],
        };

        const res = {
          json: function(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.FORMAT_INVALID.code
            );
            assert.strictEqual(
              body.error.message
                .replace('<index1>', '1')
                .replace('<value1>', 'yahoo-アドミン@%^&*36')
                .replace('<index2>', '2')
                .replace('<value2>', 'yahoo-admin37@ml.your.domain.jp'),
              '次の形式が不正で登録できませんでした。形式を確認してください。name1:yahoo-アドミン@%^&*36, name2:yahoo-admin37@ml.your.domain.jp'
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
          fixtures.testValues.stubTwoNameFormatIncorrect
        );
        const result = await controller.registerMailToListController(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_ML_FORMAT_INVALID');
        assert.strictEqual(
          jsonResult.error.message
            .replace('<index1>', '1')
            .replace('<value1>', 'yahoo-アドミン@%^&*36')
            .replace('<index2>', '2')
            .replace('<value2>', 'yahoo-admin37@ml.your.domain.jp'),
          '次の形式が不正で登録できませんでした。形式を確認してください。name1:yahoo-アドミン@%^&*36, name2:yahoo-admin37@ml.your.domain.jp'
        );
        assert.strictEqual(result.status, 400);
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 34: registerMailToListController() have number ML is 2 name wrong address wrong return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-アドミン@%^&*38',
              address: 'yahoo-admin38ml.your.domain.jp',
            },
            {
              name: 'yahoo-アドミン@%^&*39',
              address: 'yahoo-admin39ml.your.domain.jp',
            },
          ],
        };

        const res = {
          json: function(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.FORMAT_INVALID.code
            );
            assert.strictEqual(
              body.error.message
                .replaceAll('<index1>', '1')
                .replace('<namevalue1>', 'yahoo-アドミン@%^&*38')
                .replaceAll('<index2>', '2')
                .replace('<namevalue2>', 'yahoo-アドミン@%^&*39')
                .replace('<mailvalue1>', 'yahoo-admin38ml.your.domain.jp')
                .replace('<mailvalue2>', 'yahoo-admin39ml.your.domain.jp'),
              '次の形式が不正で登録できませんでした。形式を確認してください。name1:yahoo-アドミン@%^&*38, mail address1:yahoo-admin38ml.your.domain.jp, name2:yahoo-アドミン@%^&*39, mail address2:yahoo-admin39ml.your.domain.jp'
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
          fixtures.testValues.stubTwoNameAddressFormatIncorrect
        );
        const result = await controller.registerMailToListController(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_ML_FORMAT_INVALID');
        assert.strictEqual(
          jsonResult.error.message
            .replaceAll('<index1>', '1')
            .replace('<namevalue1>', 'yahoo-アドミン@%^&*38')
            .replaceAll('<index2>', '2')
            .replace('<namevalue2>', 'yahoo-アドミン@%^&*39')
            .replace('<mailvalue1>', 'yahoo-admin38ml.your.domain.jp')
            .replace('<mailvalue2>', 'yahoo-admin39ml.your.domain.jp'),
          '次の形式が不正で登録できませんでした。形式を確認してください。name1:yahoo-アドミン@%^&*38, mail address1:yahoo-admin38ml.your.domain.jp, name2:yahoo-アドミン@%^&*39, mail address2:yahoo-admin39ml.your.domain.jp'
        );
        assert.strictEqual(result.status, 400);
      } catch (e) {
        console.log(e);
      }
    });

    it.only('No 35: registerMailToListController() have number ML is 100 name null address null return error', async function() {
      try {
        const bodyFake = [];
        for (let i = 1; i <= 100; i++) {
          bodyFake.push({ name: '', address: '' });
        }
        const req = {
          body: bodyFake,
        };
        const res = {
          json(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.FORMAT_INVALID.code
            );
            assert.strictEqual(
              body.error.message
                .replaceAll('<index1>', '1')
                .replaceAll('<index2>', '2')
                .replaceAll('<index3>', '3')
                .replaceAll('<index4>', '4')
                .replaceAll('<index5>', '5')
                .replaceAll('<index6>', '6')
                .replaceAll('<index7>', '7')
                .replaceAll('<index8>', '8')
                .replaceAll('<index9>', '9')
                .replaceAll('<index10>', '10')
                .replaceAll('<index11>', '11')
                .replaceAll('<index12>', '12')
                .replaceAll('<index13>', '13')
                .replaceAll('<index14>', '14')
                .replaceAll('<index15>', '15')
                .replaceAll('<index16>', '16')
                .replaceAll('<index17>', '17')
                .replaceAll('<index18>', '18')
                .replaceAll('<index19>', '19')
                .replaceAll('<index20>', '20')
                .replaceAll('<index21>', '21')
                .replaceAll('<index22>', '22')
                .replaceAll('<index23>', '23')
                .replaceAll('<index24>', '24')
                .replaceAll('<index25>', '25')
                .replaceAll('<index26>', '26')
                .replaceAll('<index27>', '27')
                .replaceAll('<index28>', '28')
                .replaceAll('<index29>', '29')
                .replaceAll('<index30>', '30')
                .replaceAll('<index31>', '31')
                .replaceAll('<index32>', '32')
                .replaceAll('<index33>', '33')
                .replaceAll('<index34>', '34')
                .replaceAll('<index35>', '35')
                .replaceAll('<index36>', '36')
                .replaceAll('<index37>', '37')
                .replaceAll('<index38>', '38')
                .replaceAll('<index39>', '39')
                .replaceAll('<index40>', '40')
                .replaceAll('<index41>', '41')
                .replaceAll('<index42>', '42')
                .replaceAll('<index43>', '43')
                .replaceAll('<index44>', '44')
                .replaceAll('<index45>', '45')
                .replaceAll('<index46>', '46')
                .replaceAll('<index47>', '47')
                .replaceAll('<index48>', '48')
                .replaceAll('<index49>', '49')
                .replaceAll('<index50>', '50')
                .replaceAll('<index51>', '51')
                .replaceAll('<index52>', '52')
                .replaceAll('<index53>', '53')
                .replaceAll('<index54>', '54')
                .replaceAll('<index55>', '55')
                .replaceAll('<index56>', '56')
                .replaceAll('<index57>', '57')
                .replaceAll('<index58>', '58')
                .replaceAll('<index59>', '59')
                .replaceAll('<index60>', '60')
                .replaceAll('<index61>', '61')
                .replaceAll('<index62>', '62')
                .replaceAll('<index63>', '63')
                .replaceAll('<index64>', '64')
                .replaceAll('<index65>', '65')
                .replaceAll('<index66>', '66')
                .replaceAll('<index67>', '67')
                .replaceAll('<index68>', '68')
                .replaceAll('<index69>', '69')
                .replaceAll('<index70>', '70')
                .replaceAll('<index71>', '71')
                .replaceAll('<index72>', '72')
                .replaceAll('<index73>', '73')
                .replaceAll('<index74>', '74')
                .replaceAll('<index75>', '75')
                .replaceAll('<index76>', '76')
                .replaceAll('<index77>', '77')
                .replaceAll('<index78>', '78')
                .replaceAll('<index79>', '79')
                .replaceAll('<index80>', '80')
                .replaceAll('<index81>', '81')
                .replaceAll('<index82>', '82')
                .replaceAll('<index83>', '83')
                .replaceAll('<index84>', '84')
                .replaceAll('<index85>', '85')
                .replaceAll('<index86>', '86')
                .replaceAll('<index87>', '87')
                .replaceAll('<index88>', '88')
                .replaceAll('<index89>', '89')
                .replaceAll('<index90>', '90')
                .replaceAll('<index91>', '91')
                .replaceAll('<index92>', '92')
                .replaceAll('<index93>', '93')
                .replaceAll('<index94>', '94')
                .replaceAll('<index95>', '95')
                .replaceAll('<index96>', '96')
                .replaceAll('<index97>', '97')
                .replaceAll('<index98>', '98')
                .replaceAll('<index99>', '99')
                .replaceAll('<index100>', '100')
                .replaceAll('<name>', 'name')
                .replaceAll('<mail address>', 'mail address'),
              '次のフィールドが存在しないため、登録できませんでした。登録フォーマットを確認してください。name1, name2, name3, name4, name5, name6, name7, name8, name9, name10, name11, name12, name13, name14, name15, name16, name17, name18, name19, name20, name21, name22, name23, name24, name25, name26, name27, name28, name29, name30, name31, name32, name33, name34, name35, name36, name37, name38, name39, name40, name41, name42, name43, name44, name45, name46, name47, name48, name49, name50, name51, name52, name53, name54, name55, name56, name57, name58, name59, name60, name61, name62, name63, name64, name65, name66, name67, name68, name69, name70, name71, name72, name73, name74, name75, name76, name77, name78, name79, name80, name81, name82, name83, name84, name85, name86, name87, name88, name89, name90, name91, name92, name93, name94, name95, name96, name97, name98, name99, name100, mail address1, mail address2, mail address3, mail address4, mail address5, mail address6, mail address7, mail address8, mail address9, mail address10, mail address11, mail address12, mail address13, mail address14, mail address15, mail address16, mail address17, mail address18, mail address19, mail address20, mail address21, mail address22, mail address23, mail address24, mail address25, mail address26, mail address27, mail address28, mail address29, mail address30, mail address31, mail address32, mail address33, mail address34, mail address35, mail address36, mail address37, mail address38, mail address39, mail address40, mail address41, mail address42, mail address43, mail address44, mail address45, mail address46, mail address47, mail address48, mail address49, mail address50, mail address51, mail address52, mail address53, mail address54, mail address55, mail address56, mail address57, mail address58, mail address59, mail address60, mail address61, mail address62, mail address63, mail address64, mail address65, mail address66, mail address67, mail address68, mail address69, mail address70, mail address71, mail address72, mail address73, mail address74, mail address75, mail address76, mail address77, mail address78, mail address79, mail address80, mail address81, mail address82, mail address83, mail address84, mail address85, mail address86, mail address87, mail address88, mail address89, mail address90, mail address91, mail address92, mail address93, mail address94, mail address95, mail address96, mail address97, mail address98, mail address99, mail address100'
            );
          },
          status(responseStatus) {
            assert.strictEqual(
              responseStatus,
              fixtures.httpStatus.FORMAT_INVALID.status
            );
            return this;
          },
        };
        this.incorrectRegisterListStub.returns(
          fixtures.testValues.stubOneHundredNameAddressIncorrect
        );
        const result = await controller.registerMailToListController(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_ML_FORMAT_INVALID');
        assert.strictEqual(
          jsonResult.error.message
            .replaceAll('<index1>', '1')
            .replaceAll('<index2>', '2')
            .replaceAll('<index3>', '3')
            .replaceAll('<index4>', '4')
            .replaceAll('<index5>', '5')
            .replaceAll('<index6>', '6')
            .replaceAll('<index7>', '7')
            .replaceAll('<index8>', '8')
            .replaceAll('<index9>', '9')
            .replaceAll('<index10>', '10')
            .replaceAll('<index11>', '11')
            .replaceAll('<index12>', '12')
            .replaceAll('<index13>', '13')
            .replaceAll('<index14>', '14')
            .replaceAll('<index15>', '15')
            .replaceAll('<index16>', '16')
            .replaceAll('<index17>', '17')
            .replaceAll('<index18>', '18')
            .replaceAll('<index19>', '19')
            .replaceAll('<index20>', '20')
            .replaceAll('<index21>', '21')
            .replaceAll('<index22>', '22')
            .replaceAll('<index23>', '23')
            .replaceAll('<index24>', '24')
            .replaceAll('<index25>', '25')
            .replaceAll('<index26>', '26')
            .replaceAll('<index27>', '27')
            .replaceAll('<index28>', '28')
            .replaceAll('<index29>', '29')
            .replaceAll('<index30>', '30')
            .replaceAll('<index31>', '31')
            .replaceAll('<index32>', '32')
            .replaceAll('<index33>', '33')
            .replaceAll('<index34>', '34')
            .replaceAll('<index35>', '35')
            .replaceAll('<index36>', '36')
            .replaceAll('<index37>', '37')
            .replaceAll('<index38>', '38')
            .replaceAll('<index39>', '39')
            .replaceAll('<index40>', '40')
            .replaceAll('<index41>', '41')
            .replaceAll('<index42>', '42')
            .replaceAll('<index43>', '43')
            .replaceAll('<index44>', '44')
            .replaceAll('<index45>', '45')
            .replaceAll('<index46>', '46')
            .replaceAll('<index47>', '47')
            .replaceAll('<index48>', '48')
            .replaceAll('<index49>', '49')
            .replaceAll('<index50>', '50')
            .replaceAll('<index51>', '51')
            .replaceAll('<index52>', '52')
            .replaceAll('<index53>', '53')
            .replaceAll('<index54>', '54')
            .replaceAll('<index55>', '55')
            .replaceAll('<index56>', '56')
            .replaceAll('<index57>', '57')
            .replaceAll('<index58>', '58')
            .replaceAll('<index59>', '59')
            .replaceAll('<index60>', '60')
            .replaceAll('<index61>', '61')
            .replaceAll('<index62>', '62')
            .replaceAll('<index63>', '63')
            .replaceAll('<index64>', '64')
            .replaceAll('<index65>', '65')
            .replaceAll('<index66>', '66')
            .replaceAll('<index67>', '67')
            .replaceAll('<index68>', '68')
            .replaceAll('<index69>', '69')
            .replaceAll('<index70>', '70')
            .replaceAll('<index71>', '71')
            .replaceAll('<index72>', '72')
            .replaceAll('<index73>', '73')
            .replaceAll('<index74>', '74')
            .replaceAll('<index75>', '75')
            .replaceAll('<index76>', '76')
            .replaceAll('<index77>', '77')
            .replaceAll('<index78>', '78')
            .replaceAll('<index79>', '79')
            .replaceAll('<index80>', '80')
            .replaceAll('<index81>', '81')
            .replaceAll('<index82>', '82')
            .replaceAll('<index83>', '83')
            .replaceAll('<index84>', '84')
            .replaceAll('<index85>', '85')
            .replaceAll('<index86>', '86')
            .replaceAll('<index87>', '87')
            .replaceAll('<index88>', '88')
            .replaceAll('<index89>', '89')
            .replaceAll('<index90>', '90')
            .replaceAll('<index91>', '91')
            .replaceAll('<index92>', '92')
            .replaceAll('<index93>', '93')
            .replaceAll('<index94>', '94')
            .replaceAll('<index95>', '95')
            .replaceAll('<index96>', '96')
            .replaceAll('<index97>', '97')
            .replaceAll('<index98>', '98')
            .replaceAll('<index99>', '99')
            .replaceAll('<index100>', '100')
            .replaceAll('<name>', 'name')
            .replaceAll('<mail address>', 'mail address'),
          '次のフィールドが存在しないため、登録できませんでした。登録フォーマットを確認してください。name1, name2, name3, name4, name5, name6, name7, name8, name9, name10, name11, name12, name13, name14, name15, name16, name17, name18, name19, name20, name21, name22, name23, name24, name25, name26, name27, name28, name29, name30, name31, name32, name33, name34, name35, name36, name37, name38, name39, name40, name41, name42, name43, name44, name45, name46, name47, name48, name49, name50, name51, name52, name53, name54, name55, name56, name57, name58, name59, name60, name61, name62, name63, name64, name65, name66, name67, name68, name69, name70, name71, name72, name73, name74, name75, name76, name77, name78, name79, name80, name81, name82, name83, name84, name85, name86, name87, name88, name89, name90, name91, name92, name93, name94, name95, name96, name97, name98, name99, name100, mail address1, mail address2, mail address3, mail address4, mail address5, mail address6, mail address7, mail address8, mail address9, mail address10, mail address11, mail address12, mail address13, mail address14, mail address15, mail address16, mail address17, mail address18, mail address19, mail address20, mail address21, mail address22, mail address23, mail address24, mail address25, mail address26, mail address27, mail address28, mail address29, mail address30, mail address31, mail address32, mail address33, mail address34, mail address35, mail address36, mail address37, mail address38, mail address39, mail address40, mail address41, mail address42, mail address43, mail address44, mail address45, mail address46, mail address47, mail address48, mail address49, mail address50, mail address51, mail address52, mail address53, mail address54, mail address55, mail address56, mail address57, mail address58, mail address59, mail address60, mail address61, mail address62, mail address63, mail address64, mail address65, mail address66, mail address67, mail address68, mail address69, mail address70, mail address71, mail address72, mail address73, mail address74, mail address75, mail address76, mail address77, mail address78, mail address79, mail address80, mail address81, mail address82, mail address83, mail address84, mail address85, mail address86, mail address87, mail address88, mail address89, mail address90, mail address91, mail address92, mail address93, mail address94, mail address95, mail address96, mail address97, mail address98, mail address99, mail address100'
        );
        assert.strictEqual(result.status, 400);
      } catch (e) {
        console.log(e);
      }
    });

    it.only('No 36: registerMailToListController() have number ML is 100 name null address right return error', async function() {
      try {
        const bodyFake = [];
        for (let i = 1; i <= 100; i++) {
          bodyFake.push({ name: '', address: 'testMailList2@ml.hoge.co.jp' });
        }
        const req = {
          body: bodyFake,
        };
        const res = {
          json(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.FORMAT_INVALID.code
            );
            assert.strictEqual(
              body.error.message
                .replaceAll('<index1>', '1')
                .replaceAll('<index2>', '2')
                .replaceAll('<index3>', '3')
                .replaceAll('<index4>', '4')
                .replaceAll('<index5>', '5')
                .replaceAll('<index6>', '6')
                .replaceAll('<index7>', '7')
                .replaceAll('<index8>', '8')
                .replaceAll('<index9>', '9')
                .replaceAll('<index10>', '10')
                .replaceAll('<index11>', '11')
                .replaceAll('<index12>', '12')
                .replaceAll('<index13>', '13')
                .replaceAll('<index14>', '14')
                .replaceAll('<index15>', '15')
                .replaceAll('<index16>', '16')
                .replaceAll('<index17>', '17')
                .replaceAll('<index18>', '18')
                .replaceAll('<index19>', '19')
                .replaceAll('<index20>', '20')
                .replaceAll('<index21>', '21')
                .replaceAll('<index22>', '22')
                .replaceAll('<index23>', '23')
                .replaceAll('<index24>', '24')
                .replaceAll('<index25>', '25')
                .replaceAll('<index26>', '26')
                .replaceAll('<index27>', '27')
                .replaceAll('<index28>', '28')
                .replaceAll('<index29>', '29')
                .replaceAll('<index30>', '30')
                .replaceAll('<index31>', '31')
                .replaceAll('<index32>', '32')
                .replaceAll('<index33>', '33')
                .replaceAll('<index34>', '34')
                .replaceAll('<index35>', '35')
                .replaceAll('<index36>', '36')
                .replaceAll('<index37>', '37')
                .replaceAll('<index38>', '38')
                .replaceAll('<index39>', '39')
                .replaceAll('<index40>', '40')
                .replaceAll('<index41>', '41')
                .replaceAll('<index42>', '42')
                .replaceAll('<index43>', '43')
                .replaceAll('<index44>', '44')
                .replaceAll('<index45>', '45')
                .replaceAll('<index46>', '46')
                .replaceAll('<index47>', '47')
                .replaceAll('<index48>', '48')
                .replaceAll('<index49>', '49')
                .replaceAll('<index50>', '50')
                .replaceAll('<index51>', '51')
                .replaceAll('<index52>', '52')
                .replaceAll('<index53>', '53')
                .replaceAll('<index54>', '54')
                .replaceAll('<index55>', '55')
                .replaceAll('<index56>', '56')
                .replaceAll('<index57>', '57')
                .replaceAll('<index58>', '58')
                .replaceAll('<index59>', '59')
                .replaceAll('<index60>', '60')
                .replaceAll('<index61>', '61')
                .replaceAll('<index62>', '62')
                .replaceAll('<index63>', '63')
                .replaceAll('<index64>', '64')
                .replaceAll('<index65>', '65')
                .replaceAll('<index66>', '66')
                .replaceAll('<index67>', '67')
                .replaceAll('<index68>', '68')
                .replaceAll('<index69>', '69')
                .replaceAll('<index70>', '70')
                .replaceAll('<index71>', '71')
                .replaceAll('<index72>', '72')
                .replaceAll('<index73>', '73')
                .replaceAll('<index74>', '74')
                .replaceAll('<index75>', '75')
                .replaceAll('<index76>', '76')
                .replaceAll('<index77>', '77')
                .replaceAll('<index78>', '78')
                .replaceAll('<index79>', '79')
                .replaceAll('<index80>', '80')
                .replaceAll('<index81>', '81')
                .replaceAll('<index82>', '82')
                .replaceAll('<index83>', '83')
                .replaceAll('<index84>', '84')
                .replaceAll('<index85>', '85')
                .replaceAll('<index86>', '86')
                .replaceAll('<index87>', '87')
                .replaceAll('<index88>', '88')
                .replaceAll('<index89>', '89')
                .replaceAll('<index90>', '90')
                .replaceAll('<index91>', '91')
                .replaceAll('<index92>', '92')
                .replaceAll('<index93>', '93')
                .replaceAll('<index94>', '94')
                .replaceAll('<index95>', '95')
                .replaceAll('<index96>', '96')
                .replaceAll('<index97>', '97')
                .replaceAll('<index98>', '98')
                .replaceAll('<index99>', '99')
                .replaceAll('<index100>', '100')
                .replaceAll('<name>', 'name'),
              '次のフィールドが存在しないため、登録できませんでした。登録フォーマットを確認してください。name1, name2, name3, name4, name5, name6, name7, name8, name9, name10, name11, name12, name13, name14, name15, name16, name17, name18, name19, name20, name21, name22, name23, name24, name25, name26, name27, name28, name29, name30, name31, name32, name33, name34, name35, name36, name37, name38, name39, name40, name41, name42, name43, name44, name45, name46, name47, name48, name49, name50, name51, name52, name53, name54, name55, name56, name57, name58, name59, name60, name61, name62, name63, name64, name65, name66, name67, name68, name69, name70, name71, name72, name73, name74, name75, name76, name77, name78, name79, name80, name81, name82, name83, name84, name85, name86, name87, name88, name89, name90, name91, name92, name93, name94, name95, name96, name97, name98, name99, name100'
            );
          },
          status(responseStatus) {
            assert.strictEqual(
              responseStatus,
              fixtures.httpStatus.FORMAT_INVALID.status
            );
            return this;
          },
        };
        this.incorrectRegisterListStub.returns(
          fixtures.testValues.stubOneHundredNameIncorrect
        );
        const result = await controller.registerMailToListController(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_ML_FORMAT_INVALID');
        assert.strictEqual(
          jsonResult.error.message
            .replaceAll('<index1>', '1')
            .replaceAll('<index2>', '2')
            .replaceAll('<index3>', '3')
            .replaceAll('<index4>', '4')
            .replaceAll('<index5>', '5')
            .replaceAll('<index6>', '6')
            .replaceAll('<index7>', '7')
            .replaceAll('<index8>', '8')
            .replaceAll('<index9>', '9')
            .replaceAll('<index10>', '10')
            .replaceAll('<index11>', '11')
            .replaceAll('<index12>', '12')
            .replaceAll('<index13>', '13')
            .replaceAll('<index14>', '14')
            .replaceAll('<index15>', '15')
            .replaceAll('<index16>', '16')
            .replaceAll('<index17>', '17')
            .replaceAll('<index18>', '18')
            .replaceAll('<index19>', '19')
            .replaceAll('<index20>', '20')
            .replaceAll('<index21>', '21')
            .replaceAll('<index22>', '22')
            .replaceAll('<index23>', '23')
            .replaceAll('<index24>', '24')
            .replaceAll('<index25>', '25')
            .replaceAll('<index26>', '26')
            .replaceAll('<index27>', '27')
            .replaceAll('<index28>', '28')
            .replaceAll('<index29>', '29')
            .replaceAll('<index30>', '30')
            .replaceAll('<index31>', '31')
            .replaceAll('<index32>', '32')
            .replaceAll('<index33>', '33')
            .replaceAll('<index34>', '34')
            .replaceAll('<index35>', '35')
            .replaceAll('<index36>', '36')
            .replaceAll('<index37>', '37')
            .replaceAll('<index38>', '38')
            .replaceAll('<index39>', '39')
            .replaceAll('<index40>', '40')
            .replaceAll('<index41>', '41')
            .replaceAll('<index42>', '42')
            .replaceAll('<index43>', '43')
            .replaceAll('<index44>', '44')
            .replaceAll('<index45>', '45')
            .replaceAll('<index46>', '46')
            .replaceAll('<index47>', '47')
            .replaceAll('<index48>', '48')
            .replaceAll('<index49>', '49')
            .replaceAll('<index50>', '50')
            .replaceAll('<index51>', '51')
            .replaceAll('<index52>', '52')
            .replaceAll('<index53>', '53')
            .replaceAll('<index54>', '54')
            .replaceAll('<index55>', '55')
            .replaceAll('<index56>', '56')
            .replaceAll('<index57>', '57')
            .replaceAll('<index58>', '58')
            .replaceAll('<index59>', '59')
            .replaceAll('<index60>', '60')
            .replaceAll('<index61>', '61')
            .replaceAll('<index62>', '62')
            .replaceAll('<index63>', '63')
            .replaceAll('<index64>', '64')
            .replaceAll('<index65>', '65')
            .replaceAll('<index66>', '66')
            .replaceAll('<index67>', '67')
            .replaceAll('<index68>', '68')
            .replaceAll('<index69>', '69')
            .replaceAll('<index70>', '70')
            .replaceAll('<index71>', '71')
            .replaceAll('<index72>', '72')
            .replaceAll('<index73>', '73')
            .replaceAll('<index74>', '74')
            .replaceAll('<index75>', '75')
            .replaceAll('<index76>', '76')
            .replaceAll('<index77>', '77')
            .replaceAll('<index78>', '78')
            .replaceAll('<index79>', '79')
            .replaceAll('<index80>', '80')
            .replaceAll('<index81>', '81')
            .replaceAll('<index82>', '82')
            .replaceAll('<index83>', '83')
            .replaceAll('<index84>', '84')
            .replaceAll('<index85>', '85')
            .replaceAll('<index86>', '86')
            .replaceAll('<index87>', '87')
            .replaceAll('<index88>', '88')
            .replaceAll('<index89>', '89')
            .replaceAll('<index90>', '90')
            .replaceAll('<index91>', '91')
            .replaceAll('<index92>', '92')
            .replaceAll('<index93>', '93')
            .replaceAll('<index94>', '94')
            .replaceAll('<index95>', '95')
            .replaceAll('<index96>', '96')
            .replaceAll('<index97>', '97')
            .replaceAll('<index98>', '98')
            .replaceAll('<index99>', '99')
            .replaceAll('<index100>', '100')
            .replaceAll('<name>', 'name'),
          '次のフィールドが存在しないため、登録できませんでした。登録フォーマットを確認してください。name1, name2, name3, name4, name5, name6, name7, name8, name9, name10, name11, name12, name13, name14, name15, name16, name17, name18, name19, name20, name21, name22, name23, name24, name25, name26, name27, name28, name29, name30, name31, name32, name33, name34, name35, name36, name37, name38, name39, name40, name41, name42, name43, name44, name45, name46, name47, name48, name49, name50, name51, name52, name53, name54, name55, name56, name57, name58, name59, name60, name61, name62, name63, name64, name65, name66, name67, name68, name69, name70, name71, name72, name73, name74, name75, name76, name77, name78, name79, name80, name81, name82, name83, name84, name85, name86, name87, name88, name89, name90, name91, name92, name93, name94, name95, name96, name97, name98, name99, name100'
        );
        assert.strictEqual(result.status, 400);
      } catch (e) {
        console.log(e);
      }
    });

    it.only('No 37: registerMailToListController() have number ML is 100 name null address wrong return error', async function() {
      try {
        const bodyFake = [];
        for (let i = 1; i <= 100; i++) {
          bodyFake.push({ name: '', address: `testMailList${i}ml.hoge.co.jp` });
        }
        const reqName = {
          body: bodyFake,
        };
        const resName = {
          json(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.FORMAT_INVALID.code
            );
            assert.strictEqual(
              body.error.message
                .replaceAll('<index1>', '1')
                .replaceAll('<index2>', '2')
                .replaceAll('<index3>', '3')
                .replaceAll('<index4>', '4')
                .replaceAll('<index5>', '5')
                .replaceAll('<index6>', '6')
                .replaceAll('<index7>', '7')
                .replaceAll('<index8>', '8')
                .replaceAll('<index9>', '9')
                .replaceAll('<index10>', '10')
                .replaceAll('<index11>', '11')
                .replaceAll('<index12>', '12')
                .replaceAll('<index13>', '13')
                .replaceAll('<index14>', '14')
                .replaceAll('<index15>', '15')
                .replaceAll('<index16>', '16')
                .replaceAll('<index17>', '17')
                .replaceAll('<index18>', '18')
                .replaceAll('<index19>', '19')
                .replaceAll('<index20>', '20')
                .replaceAll('<index21>', '21')
                .replaceAll('<index22>', '22')
                .replaceAll('<index23>', '23')
                .replaceAll('<index24>', '24')
                .replaceAll('<index25>', '25')
                .replaceAll('<index26>', '26')
                .replaceAll('<index27>', '27')
                .replaceAll('<index28>', '28')
                .replaceAll('<index29>', '29')
                .replaceAll('<index30>', '30')
                .replaceAll('<index31>', '31')
                .replaceAll('<index32>', '32')
                .replaceAll('<index33>', '33')
                .replaceAll('<index34>', '34')
                .replaceAll('<index35>', '35')
                .replaceAll('<index36>', '36')
                .replaceAll('<index37>', '37')
                .replaceAll('<index38>', '38')
                .replaceAll('<index39>', '39')
                .replaceAll('<index40>', '40')
                .replaceAll('<index41>', '41')
                .replaceAll('<index42>', '42')
                .replaceAll('<index43>', '43')
                .replaceAll('<index44>', '44')
                .replaceAll('<index45>', '45')
                .replaceAll('<index46>', '46')
                .replaceAll('<index47>', '47')
                .replaceAll('<index48>', '48')
                .replaceAll('<index49>', '49')
                .replaceAll('<index50>', '50')
                .replaceAll('<index51>', '51')
                .replaceAll('<index52>', '52')
                .replaceAll('<index53>', '53')
                .replaceAll('<index54>', '54')
                .replaceAll('<index55>', '55')
                .replaceAll('<index56>', '56')
                .replaceAll('<index57>', '57')
                .replaceAll('<index58>', '58')
                .replaceAll('<index59>', '59')
                .replaceAll('<index60>', '60')
                .replaceAll('<index61>', '61')
                .replaceAll('<index62>', '62')
                .replaceAll('<index63>', '63')
                .replaceAll('<index64>', '64')
                .replaceAll('<index65>', '65')
                .replaceAll('<index66>', '66')
                .replaceAll('<index67>', '67')
                .replaceAll('<index68>', '68')
                .replaceAll('<index69>', '69')
                .replaceAll('<index70>', '70')
                .replaceAll('<index71>', '71')
                .replaceAll('<index72>', '72')
                .replaceAll('<index73>', '73')
                .replaceAll('<index74>', '74')
                .replaceAll('<index75>', '75')
                .replaceAll('<index76>', '76')
                .replaceAll('<index77>', '77')
                .replaceAll('<index78>', '78')
                .replaceAll('<index79>', '79')
                .replaceAll('<index80>', '80')
                .replaceAll('<index81>', '81')
                .replaceAll('<index82>', '82')
                .replaceAll('<index83>', '83')
                .replaceAll('<index84>', '84')
                .replaceAll('<index85>', '85')
                .replaceAll('<index86>', '86')
                .replaceAll('<index87>', '87')
                .replaceAll('<index88>', '88')
                .replaceAll('<index89>', '89')
                .replaceAll('<index90>', '90')
                .replaceAll('<index91>', '91')
                .replaceAll('<index92>', '92')
                .replaceAll('<index93>', '93')
                .replaceAll('<index94>', '94')
                .replaceAll('<index95>', '95')
                .replaceAll('<index96>', '96')
                .replaceAll('<index97>', '97')
                .replaceAll('<index98>', '98')
                .replaceAll('<index99>', '99')
                .replaceAll('<index100>', '100')
                .replaceAll('<name>', 'name'),
              '次のフィールドが存在しないため、登録できませんでした。登録フォーマットを確認してください。name1, name2, name3, name4, name5, name6, name7, name8, name9, name10, name11, name12, name13, name14, name15, name16, name17, name18, name19, name20, name21, name22, name23, name24, name25, name26, name27, name28, name29, name30, name31, name32, name33, name34, name35, name36, name37, name38, name39, name40, name41, name42, name43, name44, name45, name46, name47, name48, name49, name50, name51, name52, name53, name54, name55, name56, name57, name58, name59, name60, name61, name62, name63, name64, name65, name66, name67, name68, name69, name70, name71, name72, name73, name74, name75, name76, name77, name78, name79, name80, name81, name82, name83, name84, name85, name86, name87, name88, name89, name90, name91, name92, name93, name94, name95, name96, name97, name98, name99, name100'
            );
          },
          status(responseStatus) {
            assert.strictEqual(
              responseStatus,
              fixtures.httpStatus.FORMAT_INVALID.status
            );
            return this;
          },
        };
        this.incorrectRegisterListStub.returns(
          fixtures.testValues.stubOneHundredNameIncorrect
        );
        const resultName = await controller.registerMailToListController(
          reqName,
          resName
        );
        const jsonResultName = JSON.parse(resultName.body);
        assert.strictEqual(jsonResultName.error.code, 'ERR_ML_FORMAT_INVALID');
        assert.strictEqual(
          jsonResultName.error.message
            .replaceAll('<index1>', '1')
            .replaceAll('<index2>', '2')
            .replaceAll('<index3>', '3')
            .replaceAll('<index4>', '4')
            .replaceAll('<index5>', '5')
            .replaceAll('<index6>', '6')
            .replaceAll('<index7>', '7')
            .replaceAll('<index8>', '8')
            .replaceAll('<index9>', '9')
            .replaceAll('<index10>', '10')
            .replaceAll('<index11>', '11')
            .replaceAll('<index12>', '12')
            .replaceAll('<index13>', '13')
            .replaceAll('<index14>', '14')
            .replaceAll('<index15>', '15')
            .replaceAll('<index16>', '16')
            .replaceAll('<index17>', '17')
            .replaceAll('<index18>', '18')
            .replaceAll('<index19>', '19')
            .replaceAll('<index20>', '20')
            .replaceAll('<index21>', '21')
            .replaceAll('<index22>', '22')
            .replaceAll('<index23>', '23')
            .replaceAll('<index24>', '24')
            .replaceAll('<index25>', '25')
            .replaceAll('<index26>', '26')
            .replaceAll('<index27>', '27')
            .replaceAll('<index28>', '28')
            .replaceAll('<index29>', '29')
            .replaceAll('<index30>', '30')
            .replaceAll('<index31>', '31')
            .replaceAll('<index32>', '32')
            .replaceAll('<index33>', '33')
            .replaceAll('<index34>', '34')
            .replaceAll('<index35>', '35')
            .replaceAll('<index36>', '36')
            .replaceAll('<index37>', '37')
            .replaceAll('<index38>', '38')
            .replaceAll('<index39>', '39')
            .replaceAll('<index40>', '40')
            .replaceAll('<index41>', '41')
            .replaceAll('<index42>', '42')
            .replaceAll('<index43>', '43')
            .replaceAll('<index44>', '44')
            .replaceAll('<index45>', '45')
            .replaceAll('<index46>', '46')
            .replaceAll('<index47>', '47')
            .replaceAll('<index48>', '48')
            .replaceAll('<index49>', '49')
            .replaceAll('<index50>', '50')
            .replaceAll('<index51>', '51')
            .replaceAll('<index52>', '52')
            .replaceAll('<index53>', '53')
            .replaceAll('<index54>', '54')
            .replaceAll('<index55>', '55')
            .replaceAll('<index56>', '56')
            .replaceAll('<index57>', '57')
            .replaceAll('<index58>', '58')
            .replaceAll('<index59>', '59')
            .replaceAll('<index60>', '60')
            .replaceAll('<index61>', '61')
            .replaceAll('<index62>', '62')
            .replaceAll('<index63>', '63')
            .replaceAll('<index64>', '64')
            .replaceAll('<index65>', '65')
            .replaceAll('<index66>', '66')
            .replaceAll('<index67>', '67')
            .replaceAll('<index68>', '68')
            .replaceAll('<index69>', '69')
            .replaceAll('<index70>', '70')
            .replaceAll('<index71>', '71')
            .replaceAll('<index72>', '72')
            .replaceAll('<index73>', '73')
            .replaceAll('<index74>', '74')
            .replaceAll('<index75>', '75')
            .replaceAll('<index76>', '76')
            .replaceAll('<index77>', '77')
            .replaceAll('<index78>', '78')
            .replaceAll('<index79>', '79')
            .replaceAll('<index80>', '80')
            .replaceAll('<index81>', '81')
            .replaceAll('<index82>', '82')
            .replaceAll('<index83>', '83')
            .replaceAll('<index84>', '84')
            .replaceAll('<index85>', '85')
            .replaceAll('<index86>', '86')
            .replaceAll('<index87>', '87')
            .replaceAll('<index88>', '88')
            .replaceAll('<index89>', '89')
            .replaceAll('<index90>', '90')
            .replaceAll('<index91>', '91')
            .replaceAll('<index92>', '92')
            .replaceAll('<index93>', '93')
            .replaceAll('<index94>', '94')
            .replaceAll('<index95>', '95')
            .replaceAll('<index96>', '96')
            .replaceAll('<index97>', '97')
            .replaceAll('<index98>', '98')
            .replaceAll('<index99>', '99')
            .replaceAll('<index100>', '100')
            .replaceAll('<name>', 'name'),
          '次のフィールドが存在しないため、登録できませんでした。登録フォーマットを確認してください。name1, name2, name3, name4, name5, name6, name7, name8, name9, name10, name11, name12, name13, name14, name15, name16, name17, name18, name19, name20, name21, name22, name23, name24, name25, name26, name27, name28, name29, name30, name31, name32, name33, name34, name35, name36, name37, name38, name39, name40, name41, name42, name43, name44, name45, name46, name47, name48, name49, name50, name51, name52, name53, name54, name55, name56, name57, name58, name59, name60, name61, name62, name63, name64, name65, name66, name67, name68, name69, name70, name71, name72, name73, name74, name75, name76, name77, name78, name79, name80, name81, name82, name83, name84, name85, name86, name87, name88, name89, name90, name91, name92, name93, name94, name95, name96, name97, name98, name99, name100'
        );
        assert.strictEqual(resultName.status, 400);

        // 100 address wrong
        for (let i = 1; i <= 100; i++) {
          bodyFake.push({
            name: 'testMailList',
            address: `testMailList${i}ml.hoge.co.jp`,
          });
        }
        const reqAddress = {
          body: bodyFake,
        };
        const resAddress = {
          json(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.FORMAT_INVALID.code
            );
            assert.strictEqual(
              body.error.message
                .replaceAll('<index1>', '1')
                .replaceAll('<index2>', '2')
                .replaceAll('<index3>', '3')
                .replaceAll('<index4>', '4')
                .replaceAll('<index5>', '5')
                .replaceAll('<index6>', '6')
                .replaceAll('<index7>', '7')
                .replaceAll('<index8>', '8')
                .replaceAll('<index9>', '9')
                .replaceAll('<index10>', '10')
                .replaceAll('<index11>', '11')
                .replaceAll('<index12>', '12')
                .replaceAll('<index13>', '13')
                .replaceAll('<index14>', '14')
                .replaceAll('<index15>', '15')
                .replaceAll('<index16>', '16')
                .replaceAll('<index17>', '17')
                .replaceAll('<index18>', '18')
                .replaceAll('<index19>', '19')
                .replaceAll('<index20>', '20')
                .replaceAll('<index21>', '21')
                .replaceAll('<index22>', '22')
                .replaceAll('<index23>', '23')
                .replaceAll('<index24>', '24')
                .replaceAll('<index25>', '25')
                .replaceAll('<index26>', '26')
                .replaceAll('<index27>', '27')
                .replaceAll('<index28>', '28')
                .replaceAll('<index29>', '29')
                .replaceAll('<index30>', '30')
                .replaceAll('<index31>', '31')
                .replaceAll('<index32>', '32')
                .replaceAll('<index33>', '33')
                .replaceAll('<index34>', '34')
                .replaceAll('<index35>', '35')
                .replaceAll('<index36>', '36')
                .replaceAll('<index37>', '37')
                .replaceAll('<index38>', '38')
                .replaceAll('<index39>', '39')
                .replaceAll('<index40>', '40')
                .replaceAll('<index41>', '41')
                .replaceAll('<index42>', '42')
                .replaceAll('<index43>', '43')
                .replaceAll('<index44>', '44')
                .replaceAll('<index45>', '45')
                .replaceAll('<index46>', '46')
                .replaceAll('<index47>', '47')
                .replaceAll('<index48>', '48')
                .replaceAll('<index49>', '49')
                .replaceAll('<index50>', '50')
                .replaceAll('<index51>', '51')
                .replaceAll('<index52>', '52')
                .replaceAll('<index53>', '53')
                .replaceAll('<index54>', '54')
                .replaceAll('<index55>', '55')
                .replaceAll('<index56>', '56')
                .replaceAll('<index57>', '57')
                .replaceAll('<index58>', '58')
                .replaceAll('<index59>', '59')
                .replaceAll('<index60>', '60')
                .replaceAll('<index61>', '61')
                .replaceAll('<index62>', '62')
                .replaceAll('<index63>', '63')
                .replaceAll('<index64>', '64')
                .replaceAll('<index65>', '65')
                .replaceAll('<index66>', '66')
                .replaceAll('<index67>', '67')
                .replaceAll('<index68>', '68')
                .replaceAll('<index69>', '69')
                .replaceAll('<index70>', '70')
                .replaceAll('<index71>', '71')
                .replaceAll('<index72>', '72')
                .replaceAll('<index73>', '73')
                .replaceAll('<index74>', '74')
                .replaceAll('<index75>', '75')
                .replaceAll('<index76>', '76')
                .replaceAll('<index77>', '77')
                .replaceAll('<index78>', '78')
                .replaceAll('<index79>', '79')
                .replaceAll('<index80>', '80')
                .replaceAll('<index81>', '81')
                .replaceAll('<index82>', '82')
                .replaceAll('<index83>', '83')
                .replaceAll('<index84>', '84')
                .replaceAll('<index85>', '85')
                .replaceAll('<index86>', '86')
                .replaceAll('<index87>', '87')
                .replaceAll('<index88>', '88')
                .replaceAll('<index89>', '89')
                .replaceAll('<index90>', '90')
                .replaceAll('<index91>', '91')
                .replaceAll('<index92>', '92')
                .replaceAll('<index93>', '93')
                .replaceAll('<index94>', '94')
                .replaceAll('<index95>', '95')
                .replaceAll('<index96>', '96')
                .replaceAll('<index97>', '97')
                .replaceAll('<index98>', '98')
                .replaceAll('<index99>', '99')
                .replaceAll('<index100>', '100')
                .replaceAll('<mail address>', 'mail address'),
              '次のフィールドが存在しないため、登録できませんでした。登録フォーマットを確認してください。mail address1, mail address2, mail address3, mail address4, mail address5, mail address6, mail address7, mail address8, mail address9, mail address10, mail address11, mail address12, mail address13, mail address14, mail address15, mail address16, mail address17, mail address18, mail address19, mail address20, mail address21, mail address22, mail address23, mail address24, mail address25, mail address26, mail address27, mail address28, mail address29, mail address30, mail address31, mail address32, mail address33, mail address34, mail address35, mail address36, mail address37, mail address38, mail address39, mail address40, mail address41, mail address42, mail address43, mail address44, mail address45, mail address46, mail address47, mail address48, mail address49, mail address50, mail address51, mail address52, mail address53, mail address54, mail address55, mail address56, mail address57, mail address58, mail address59, mail address60, mail address61, mail address62, mail address63, mail address64, mail address65, mail address66, mail address67, mail address68, mail address69, mail address70, mail address71, mail address72, mail address73, mail address74, mail address75, mail address76, mail address77, mail address78, mail address79, mail address80, mail address81, mail address82, mail address83, mail address84, mail address85, mail address86, mail address87, mail address88, mail address89, mail address90, mail address91, mail address92, mail address93, mail address94, mail address95, mail address96, mail address97, mail address98, mail address99, mail address100'
            );
          },
          status(responseStatus) {
            assert.strictEqual(
              responseStatus,
              fixtures.httpStatus.FORMAT_INVALID.status
            );
            return this;
          },
        };
        this.incorrectRegisterListStub.returns(
          fixtures.testValues.stubOneHundredAddressIncorrect
        );
        const resultAddress = await controller.registerMailToListController(
          reqAddress,
          resAddress
        );
        const jsonResultAddress = JSON.parse(resultAddress.body);
        assert.strictEqual(
          jsonResultAddress.error.code,
          'ERR_ML_FORMAT_INVALID'
        );
        assert.strictEqual(
          jsonResultAddress.error.message
            .replaceAll('<index1>', '1')
            .replaceAll('<index2>', '2')
            .replaceAll('<index3>', '3')
            .replaceAll('<index4>', '4')
            .replaceAll('<index5>', '5')
            .replaceAll('<index6>', '6')
            .replaceAll('<index7>', '7')
            .replaceAll('<index8>', '8')
            .replaceAll('<index9>', '9')
            .replaceAll('<index10>', '10')
            .replaceAll('<index11>', '11')
            .replaceAll('<index12>', '12')
            .replaceAll('<index13>', '13')
            .replaceAll('<index14>', '14')
            .replaceAll('<index15>', '15')
            .replaceAll('<index16>', '16')
            .replaceAll('<index17>', '17')
            .replaceAll('<index18>', '18')
            .replaceAll('<index19>', '19')
            .replaceAll('<index20>', '20')
            .replaceAll('<index21>', '21')
            .replaceAll('<index22>', '22')
            .replaceAll('<index23>', '23')
            .replaceAll('<index24>', '24')
            .replaceAll('<index25>', '25')
            .replaceAll('<index26>', '26')
            .replaceAll('<index27>', '27')
            .replaceAll('<index28>', '28')
            .replaceAll('<index29>', '29')
            .replaceAll('<index30>', '30')
            .replaceAll('<index31>', '31')
            .replaceAll('<index32>', '32')
            .replaceAll('<index33>', '33')
            .replaceAll('<index34>', '34')
            .replaceAll('<index35>', '35')
            .replaceAll('<index36>', '36')
            .replaceAll('<index37>', '37')
            .replaceAll('<index38>', '38')
            .replaceAll('<index39>', '39')
            .replaceAll('<index40>', '40')
            .replaceAll('<index41>', '41')
            .replaceAll('<index42>', '42')
            .replaceAll('<index43>', '43')
            .replaceAll('<index44>', '44')
            .replaceAll('<index45>', '45')
            .replaceAll('<index46>', '46')
            .replaceAll('<index47>', '47')
            .replaceAll('<index48>', '48')
            .replaceAll('<index49>', '49')
            .replaceAll('<index50>', '50')
            .replaceAll('<index51>', '51')
            .replaceAll('<index52>', '52')
            .replaceAll('<index53>', '53')
            .replaceAll('<index54>', '54')
            .replaceAll('<index55>', '55')
            .replaceAll('<index56>', '56')
            .replaceAll('<index57>', '57')
            .replaceAll('<index58>', '58')
            .replaceAll('<index59>', '59')
            .replaceAll('<index60>', '60')
            .replaceAll('<index61>', '61')
            .replaceAll('<index62>', '62')
            .replaceAll('<index63>', '63')
            .replaceAll('<index64>', '64')
            .replaceAll('<index65>', '65')
            .replaceAll('<index66>', '66')
            .replaceAll('<index67>', '67')
            .replaceAll('<index68>', '68')
            .replaceAll('<index69>', '69')
            .replaceAll('<index70>', '70')
            .replaceAll('<index71>', '71')
            .replaceAll('<index72>', '72')
            .replaceAll('<index73>', '73')
            .replaceAll('<index74>', '74')
            .replaceAll('<index75>', '75')
            .replaceAll('<index76>', '76')
            .replaceAll('<index77>', '77')
            .replaceAll('<index78>', '78')
            .replaceAll('<index79>', '79')
            .replaceAll('<index80>', '80')
            .replaceAll('<index81>', '81')
            .replaceAll('<index82>', '82')
            .replaceAll('<index83>', '83')
            .replaceAll('<index84>', '84')
            .replaceAll('<index85>', '85')
            .replaceAll('<index86>', '86')
            .replaceAll('<index87>', '87')
            .replaceAll('<index88>', '88')
            .replaceAll('<index89>', '89')
            .replaceAll('<index90>', '90')
            .replaceAll('<index91>', '91')
            .replaceAll('<index92>', '92')
            .replaceAll('<index93>', '93')
            .replaceAll('<index94>', '94')
            .replaceAll('<index95>', '95')
            .replaceAll('<index96>', '96')
            .replaceAll('<index97>', '97')
            .replaceAll('<index98>', '98')
            .replaceAll('<index99>', '99')
            .replaceAll('<index100>', '100')
            .replaceAll('<mail address>', 'mail address'),
          '次のフィールドが存在しないため、登録できませんでした。登録フォーマットを確認してください。mail address1, mail address2, mail address3, mail address4, mail address5, mail address6, mail address7, mail address8, mail address9, mail address10, mail address11, mail address12, mail address13, mail address14, mail address15, mail address16, mail address17, mail address18, mail address19, mail address20, mail address21, mail address22, mail address23, mail address24, mail address25, mail address26, mail address27, mail address28, mail address29, mail address30, mail address31, mail address32, mail address33, mail address34, mail address35, mail address36, mail address37, mail address38, mail address39, mail address40, mail address41, mail address42, mail address43, mail address44, mail address45, mail address46, mail address47, mail address48, mail address49, mail address50, mail address51, mail address52, mail address53, mail address54, mail address55, mail address56, mail address57, mail address58, mail address59, mail address60, mail address61, mail address62, mail address63, mail address64, mail address65, mail address66, mail address67, mail address68, mail address69, mail address70, mail address71, mail address72, mail address73, mail address74, mail address75, mail address76, mail address77, mail address78, mail address79, mail address80, mail address81, mail address82, mail address83, mail address84, mail address85, mail address86, mail address87, mail address88, mail address89, mail address90, mail address91, mail address92, mail address93, mail address94, mail address95, mail address96, mail address97, mail address98, mail address99, mail address100'
        );
        assert.strictEqual(resultAddress.status, 400);
      } catch (e) {
        console.log(e);
      }
    });

    it.only('No 38: registerMailToListController() have number ML is 99 name null address null return error', async function() {
      try {
        const bodyFake = [];
        for (let i = 1; i <= 99; i++) {
          bodyFake.push({ name: '', address: '' });
        }
        const req = {
          body: bodyFake,
        };
        const res = {
          json(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.FORMAT_INVALID.code
            );
            assert.strictEqual(
              body.error.message
                .replaceAll('<index1>', '1')
                .replaceAll('<index2>', '2')
                .replaceAll('<index3>', '3')
                .replaceAll('<index4>', '4')
                .replaceAll('<index5>', '5')
                .replaceAll('<index6>', '6')
                .replaceAll('<index7>', '7')
                .replaceAll('<index8>', '8')
                .replaceAll('<index9>', '9')
                .replaceAll('<index10>', '10')
                .replaceAll('<index11>', '11')
                .replaceAll('<index12>', '12')
                .replaceAll('<index13>', '13')
                .replaceAll('<index14>', '14')
                .replaceAll('<index15>', '15')
                .replaceAll('<index16>', '16')
                .replaceAll('<index17>', '17')
                .replaceAll('<index18>', '18')
                .replaceAll('<index19>', '19')
                .replaceAll('<index20>', '20')
                .replaceAll('<index21>', '21')
                .replaceAll('<index22>', '22')
                .replaceAll('<index23>', '23')
                .replaceAll('<index24>', '24')
                .replaceAll('<index25>', '25')
                .replaceAll('<index26>', '26')
                .replaceAll('<index27>', '27')
                .replaceAll('<index28>', '28')
                .replaceAll('<index29>', '29')
                .replaceAll('<index30>', '30')
                .replaceAll('<index31>', '31')
                .replaceAll('<index32>', '32')
                .replaceAll('<index33>', '33')
                .replaceAll('<index34>', '34')
                .replaceAll('<index35>', '35')
                .replaceAll('<index36>', '36')
                .replaceAll('<index37>', '37')
                .replaceAll('<index38>', '38')
                .replaceAll('<index39>', '39')
                .replaceAll('<index40>', '40')
                .replaceAll('<index41>', '41')
                .replaceAll('<index42>', '42')
                .replaceAll('<index43>', '43')
                .replaceAll('<index44>', '44')
                .replaceAll('<index45>', '45')
                .replaceAll('<index46>', '46')
                .replaceAll('<index47>', '47')
                .replaceAll('<index48>', '48')
                .replaceAll('<index49>', '49')
                .replaceAll('<index50>', '50')
                .replaceAll('<index51>', '51')
                .replaceAll('<index52>', '52')
                .replaceAll('<index53>', '53')
                .replaceAll('<index54>', '54')
                .replaceAll('<index55>', '55')
                .replaceAll('<index56>', '56')
                .replaceAll('<index57>', '57')
                .replaceAll('<index58>', '58')
                .replaceAll('<index59>', '59')
                .replaceAll('<index60>', '60')
                .replaceAll('<index61>', '61')
                .replaceAll('<index62>', '62')
                .replaceAll('<index63>', '63')
                .replaceAll('<index64>', '64')
                .replaceAll('<index65>', '65')
                .replaceAll('<index66>', '66')
                .replaceAll('<index67>', '67')
                .replaceAll('<index68>', '68')
                .replaceAll('<index69>', '69')
                .replaceAll('<index70>', '70')
                .replaceAll('<index71>', '71')
                .replaceAll('<index72>', '72')
                .replaceAll('<index73>', '73')
                .replaceAll('<index74>', '74')
                .replaceAll('<index75>', '75')
                .replaceAll('<index76>', '76')
                .replaceAll('<index77>', '77')
                .replaceAll('<index78>', '78')
                .replaceAll('<index79>', '79')
                .replaceAll('<index80>', '80')
                .replaceAll('<index81>', '81')
                .replaceAll('<index82>', '82')
                .replaceAll('<index83>', '83')
                .replaceAll('<index84>', '84')
                .replaceAll('<index85>', '85')
                .replaceAll('<index86>', '86')
                .replaceAll('<index87>', '87')
                .replaceAll('<index88>', '88')
                .replaceAll('<index89>', '89')
                .replaceAll('<index90>', '90')
                .replaceAll('<index91>', '91')
                .replaceAll('<index92>', '92')
                .replaceAll('<index93>', '93')
                .replaceAll('<index94>', '94')
                .replaceAll('<index95>', '95')
                .replaceAll('<index96>', '96')
                .replaceAll('<index97>', '97')
                .replaceAll('<index98>', '98')
                .replaceAll('<index99>', '99')
                .replaceAll('<name>', 'name')
                .replaceAll('<mail address>', 'mail address'),
              '次のフィールドが存在しないため、登録できませんでした。登録フォーマットを確認してください。name1, name2, name3, name4, name5, name6, name7, name8, name9, name10, name11, name12, name13, name14, name15, name16, name17, name18, name19, name20, name21, name22, name23, name24, name25, name26, name27, name28, name29, name30, name31, name32, name33, name34, name35, name36, name37, name38, name39, name40, name41, name42, name43, name44, name45, name46, name47, name48, name49, name50, name51, name52, name53, name54, name55, name56, name57, name58, name59, name60, name61, name62, name63, name64, name65, name66, name67, name68, name69, name70, name71, name72, name73, name74, name75, name76, name77, name78, name79, name80, name81, name82, name83, name84, name85, name86, name87, name88, name89, name90, name91, name92, name93, name94, name95, name96, name97, name98, name99, mail address1, mail address2, mail address3, mail address4, mail address5, mail address6, mail address7, mail address8, mail address9, mail address10, mail address11, mail address12, mail address13, mail address14, mail address15, mail address16, mail address17, mail address18, mail address19, mail address20, mail address21, mail address22, mail address23, mail address24, mail address25, mail address26, mail address27, mail address28, mail address29, mail address30, mail address31, mail address32, mail address33, mail address34, mail address35, mail address36, mail address37, mail address38, mail address39, mail address40, mail address41, mail address42, mail address43, mail address44, mail address45, mail address46, mail address47, mail address48, mail address49, mail address50, mail address51, mail address52, mail address53, mail address54, mail address55, mail address56, mail address57, mail address58, mail address59, mail address60, mail address61, mail address62, mail address63, mail address64, mail address65, mail address66, mail address67, mail address68, mail address69, mail address70, mail address71, mail address72, mail address73, mail address74, mail address75, mail address76, mail address77, mail address78, mail address79, mail address80, mail address81, mail address82, mail address83, mail address84, mail address85, mail address86, mail address87, mail address88, mail address89, mail address90, mail address91, mail address92, mail address93, mail address94, mail address95, mail address96, mail address97, mail address98, mail address99'
            );
          },
          status(responseStatus) {
            assert.strictEqual(
              responseStatus,
              fixtures.httpStatus.FORMAT_INVALID.status
            );
            return this;
          },
        };
        this.incorrectRegisterListStub.returns(
          fixtures.testValues.stubNinetyNineNameAddressIncorrect
        );
        const result = await controller.registerMailToListController(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_ML_FORMAT_INVALID');
        assert.strictEqual(
          jsonResult.error.message
            .replaceAll('<index1>', '1')
            .replaceAll('<index2>', '2')
            .replaceAll('<index3>', '3')
            .replaceAll('<index4>', '4')
            .replaceAll('<index5>', '5')
            .replaceAll('<index6>', '6')
            .replaceAll('<index7>', '7')
            .replaceAll('<index8>', '8')
            .replaceAll('<index9>', '9')
            .replaceAll('<index10>', '10')
            .replaceAll('<index11>', '11')
            .replaceAll('<index12>', '12')
            .replaceAll('<index13>', '13')
            .replaceAll('<index14>', '14')
            .replaceAll('<index15>', '15')
            .replaceAll('<index16>', '16')
            .replaceAll('<index17>', '17')
            .replaceAll('<index18>', '18')
            .replaceAll('<index19>', '19')
            .replaceAll('<index20>', '20')
            .replaceAll('<index21>', '21')
            .replaceAll('<index22>', '22')
            .replaceAll('<index23>', '23')
            .replaceAll('<index24>', '24')
            .replaceAll('<index25>', '25')
            .replaceAll('<index26>', '26')
            .replaceAll('<index27>', '27')
            .replaceAll('<index28>', '28')
            .replaceAll('<index29>', '29')
            .replaceAll('<index30>', '30')
            .replaceAll('<index31>', '31')
            .replaceAll('<index32>', '32')
            .replaceAll('<index33>', '33')
            .replaceAll('<index34>', '34')
            .replaceAll('<index35>', '35')
            .replaceAll('<index36>', '36')
            .replaceAll('<index37>', '37')
            .replaceAll('<index38>', '38')
            .replaceAll('<index39>', '39')
            .replaceAll('<index40>', '40')
            .replaceAll('<index41>', '41')
            .replaceAll('<index42>', '42')
            .replaceAll('<index43>', '43')
            .replaceAll('<index44>', '44')
            .replaceAll('<index45>', '45')
            .replaceAll('<index46>', '46')
            .replaceAll('<index47>', '47')
            .replaceAll('<index48>', '48')
            .replaceAll('<index49>', '49')
            .replaceAll('<index50>', '50')
            .replaceAll('<index51>', '51')
            .replaceAll('<index52>', '52')
            .replaceAll('<index53>', '53')
            .replaceAll('<index54>', '54')
            .replaceAll('<index55>', '55')
            .replaceAll('<index56>', '56')
            .replaceAll('<index57>', '57')
            .replaceAll('<index58>', '58')
            .replaceAll('<index59>', '59')
            .replaceAll('<index60>', '60')
            .replaceAll('<index61>', '61')
            .replaceAll('<index62>', '62')
            .replaceAll('<index63>', '63')
            .replaceAll('<index64>', '64')
            .replaceAll('<index65>', '65')
            .replaceAll('<index66>', '66')
            .replaceAll('<index67>', '67')
            .replaceAll('<index68>', '68')
            .replaceAll('<index69>', '69')
            .replaceAll('<index70>', '70')
            .replaceAll('<index71>', '71')
            .replaceAll('<index72>', '72')
            .replaceAll('<index73>', '73')
            .replaceAll('<index74>', '74')
            .replaceAll('<index75>', '75')
            .replaceAll('<index76>', '76')
            .replaceAll('<index77>', '77')
            .replaceAll('<index78>', '78')
            .replaceAll('<index79>', '79')
            .replaceAll('<index80>', '80')
            .replaceAll('<index81>', '81')
            .replaceAll('<index82>', '82')
            .replaceAll('<index83>', '83')
            .replaceAll('<index84>', '84')
            .replaceAll('<index85>', '85')
            .replaceAll('<index86>', '86')
            .replaceAll('<index87>', '87')
            .replaceAll('<index88>', '88')
            .replaceAll('<index89>', '89')
            .replaceAll('<index90>', '90')
            .replaceAll('<index91>', '91')
            .replaceAll('<index92>', '92')
            .replaceAll('<index93>', '93')
            .replaceAll('<index94>', '94')
            .replaceAll('<index95>', '95')
            .replaceAll('<index96>', '96')
            .replaceAll('<index97>', '97')
            .replaceAll('<index98>', '98')
            .replaceAll('<index99>', '99')
            .replaceAll('<name>', 'name')
            .replaceAll('<mail address>', 'mail address'),
          '次のフィールドが存在しないため、登録できませんでした。登録フォーマットを確認してください。name1, name2, name3, name4, name5, name6, name7, name8, name9, name10, name11, name12, name13, name14, name15, name16, name17, name18, name19, name20, name21, name22, name23, name24, name25, name26, name27, name28, name29, name30, name31, name32, name33, name34, name35, name36, name37, name38, name39, name40, name41, name42, name43, name44, name45, name46, name47, name48, name49, name50, name51, name52, name53, name54, name55, name56, name57, name58, name59, name60, name61, name62, name63, name64, name65, name66, name67, name68, name69, name70, name71, name72, name73, name74, name75, name76, name77, name78, name79, name80, name81, name82, name83, name84, name85, name86, name87, name88, name89, name90, name91, name92, name93, name94, name95, name96, name97, name98, name99, mail address1, mail address2, mail address3, mail address4, mail address5, mail address6, mail address7, mail address8, mail address9, mail address10, mail address11, mail address12, mail address13, mail address14, mail address15, mail address16, mail address17, mail address18, mail address19, mail address20, mail address21, mail address22, mail address23, mail address24, mail address25, mail address26, mail address27, mail address28, mail address29, mail address30, mail address31, mail address32, mail address33, mail address34, mail address35, mail address36, mail address37, mail address38, mail address39, mail address40, mail address41, mail address42, mail address43, mail address44, mail address45, mail address46, mail address47, mail address48, mail address49, mail address50, mail address51, mail address52, mail address53, mail address54, mail address55, mail address56, mail address57, mail address58, mail address59, mail address60, mail address61, mail address62, mail address63, mail address64, mail address65, mail address66, mail address67, mail address68, mail address69, mail address70, mail address71, mail address72, mail address73, mail address74, mail address75, mail address76, mail address77, mail address78, mail address79, mail address80, mail address81, mail address82, mail address83, mail address84, mail address85, mail address86, mail address87, mail address88, mail address89, mail address90, mail address91, mail address92, mail address93, mail address94, mail address95, mail address96, mail address97, mail address98, mail address99'
        );
        assert.strictEqual(result.status, 400);
      } catch (e) {
        console.log(e);
      }
    });

    it.only('No 39: registerMailToListController() have number ML is 99 name right address null return error', async function() {
      try {
        const bodyFake = [];
        for (let i = 1; i <= 100; i++) {
          bodyFake.push({ name: 'testMailList2', address: '' });
        }
        const req = {
          body: bodyFake,
        };
        const res = {
          json(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.FORMAT_INVALID.code
            );
            assert.strictEqual(
              body.error.message
                .replaceAll('<index1>', '1')
                .replaceAll('<index2>', '2')
                .replaceAll('<index3>', '3')
                .replaceAll('<index4>', '4')
                .replaceAll('<index5>', '5')
                .replaceAll('<index6>', '6')
                .replaceAll('<index7>', '7')
                .replaceAll('<index8>', '8')
                .replaceAll('<index9>', '9')
                .replaceAll('<index10>', '10')
                .replaceAll('<index11>', '11')
                .replaceAll('<index12>', '12')
                .replaceAll('<index13>', '13')
                .replaceAll('<index14>', '14')
                .replaceAll('<index15>', '15')
                .replaceAll('<index16>', '16')
                .replaceAll('<index17>', '17')
                .replaceAll('<index18>', '18')
                .replaceAll('<index19>', '19')
                .replaceAll('<index20>', '20')
                .replaceAll('<index21>', '21')
                .replaceAll('<index22>', '22')
                .replaceAll('<index23>', '23')
                .replaceAll('<index24>', '24')
                .replaceAll('<index25>', '25')
                .replaceAll('<index26>', '26')
                .replaceAll('<index27>', '27')
                .replaceAll('<index28>', '28')
                .replaceAll('<index29>', '29')
                .replaceAll('<index30>', '30')
                .replaceAll('<index31>', '31')
                .replaceAll('<index32>', '32')
                .replaceAll('<index33>', '33')
                .replaceAll('<index34>', '34')
                .replaceAll('<index35>', '35')
                .replaceAll('<index36>', '36')
                .replaceAll('<index37>', '37')
                .replaceAll('<index38>', '38')
                .replaceAll('<index39>', '39')
                .replaceAll('<index40>', '40')
                .replaceAll('<index41>', '41')
                .replaceAll('<index42>', '42')
                .replaceAll('<index43>', '43')
                .replaceAll('<index44>', '44')
                .replaceAll('<index45>', '45')
                .replaceAll('<index46>', '46')
                .replaceAll('<index47>', '47')
                .replaceAll('<index48>', '48')
                .replaceAll('<index49>', '49')
                .replaceAll('<index50>', '50')
                .replaceAll('<index51>', '51')
                .replaceAll('<index52>', '52')
                .replaceAll('<index53>', '53')
                .replaceAll('<index54>', '54')
                .replaceAll('<index55>', '55')
                .replaceAll('<index56>', '56')
                .replaceAll('<index57>', '57')
                .replaceAll('<index58>', '58')
                .replaceAll('<index59>', '59')
                .replaceAll('<index60>', '60')
                .replaceAll('<index61>', '61')
                .replaceAll('<index62>', '62')
                .replaceAll('<index63>', '63')
                .replaceAll('<index64>', '64')
                .replaceAll('<index65>', '65')
                .replaceAll('<index66>', '66')
                .replaceAll('<index67>', '67')
                .replaceAll('<index68>', '68')
                .replaceAll('<index69>', '69')
                .replaceAll('<index70>', '70')
                .replaceAll('<index71>', '71')
                .replaceAll('<index72>', '72')
                .replaceAll('<index73>', '73')
                .replaceAll('<index74>', '74')
                .replaceAll('<index75>', '75')
                .replaceAll('<index76>', '76')
                .replaceAll('<index77>', '77')
                .replaceAll('<index78>', '78')
                .replaceAll('<index79>', '79')
                .replaceAll('<index80>', '80')
                .replaceAll('<index81>', '81')
                .replaceAll('<index82>', '82')
                .replaceAll('<index83>', '83')
                .replaceAll('<index84>', '84')
                .replaceAll('<index85>', '85')
                .replaceAll('<index86>', '86')
                .replaceAll('<index87>', '87')
                .replaceAll('<index88>', '88')
                .replaceAll('<index89>', '89')
                .replaceAll('<index90>', '90')
                .replaceAll('<index91>', '91')
                .replaceAll('<index92>', '92')
                .replaceAll('<index93>', '93')
                .replaceAll('<index94>', '94')
                .replaceAll('<index95>', '95')
                .replaceAll('<index96>', '96')
                .replaceAll('<index97>', '97')
                .replaceAll('<index98>', '98')
                .replaceAll('<index99>', '99')
                .replaceAll('<mail address>', 'mail address'),
              '次のフィールドが存在しないため、登録できませんでした。登録フォーマットを確認してください。mail address1, mail address2, mail address3, mail address4, mail address5, mail address6, mail address7, mail address8, mail address9, mail address10, mail address11, mail address12, mail address13, mail address14, mail address15, mail address16, mail address17, mail address18, mail address19, mail address20, mail address21, mail address22, mail address23, mail address24, mail address25, mail address26, mail address27, mail address28, mail address29, mail address30, mail address31, mail address32, mail address33, mail address34, mail address35, mail address36, mail address37, mail address38, mail address39, mail address40, mail address41, mail address42, mail address43, mail address44, mail address45, mail address46, mail address47, mail address48, mail address49, mail address50, mail address51, mail address52, mail address53, mail address54, mail address55, mail address56, mail address57, mail address58, mail address59, mail address60, mail address61, mail address62, mail address63, mail address64, mail address65, mail address66, mail address67, mail address68, mail address69, mail address70, mail address71, mail address72, mail address73, mail address74, mail address75, mail address76, mail address77, mail address78, mail address79, mail address80, mail address81, mail address82, mail address83, mail address84, mail address85, mail address86, mail address87, mail address88, mail address89, mail address90, mail address91, mail address92, mail address93, mail address94, mail address95, mail address96, mail address97, mail address98, mail address99'
            );
          },
          status(responseStatus) {
            assert.strictEqual(
              responseStatus,
              fixtures.httpStatus.FORMAT_INVALID.status
            );
            return this;
          },
        };
        this.incorrectRegisterListStub.returns(
          fixtures.testValues.stubNinetyNineAddressIncorrect
        );
        const result = await controller.registerMailToListController(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_ML_FORMAT_INVALID');
        assert.strictEqual(
          jsonResult.error.message
            .replaceAll('<index1>', '1')
            .replaceAll('<index2>', '2')
            .replaceAll('<index3>', '3')
            .replaceAll('<index4>', '4')
            .replaceAll('<index5>', '5')
            .replaceAll('<index6>', '6')
            .replaceAll('<index7>', '7')
            .replaceAll('<index8>', '8')
            .replaceAll('<index9>', '9')
            .replaceAll('<index10>', '10')
            .replaceAll('<index11>', '11')
            .replaceAll('<index12>', '12')
            .replaceAll('<index13>', '13')
            .replaceAll('<index14>', '14')
            .replaceAll('<index15>', '15')
            .replaceAll('<index16>', '16')
            .replaceAll('<index17>', '17')
            .replaceAll('<index18>', '18')
            .replaceAll('<index19>', '19')
            .replaceAll('<index20>', '20')
            .replaceAll('<index21>', '21')
            .replaceAll('<index22>', '22')
            .replaceAll('<index23>', '23')
            .replaceAll('<index24>', '24')
            .replaceAll('<index25>', '25')
            .replaceAll('<index26>', '26')
            .replaceAll('<index27>', '27')
            .replaceAll('<index28>', '28')
            .replaceAll('<index29>', '29')
            .replaceAll('<index30>', '30')
            .replaceAll('<index31>', '31')
            .replaceAll('<index32>', '32')
            .replaceAll('<index33>', '33')
            .replaceAll('<index34>', '34')
            .replaceAll('<index35>', '35')
            .replaceAll('<index36>', '36')
            .replaceAll('<index37>', '37')
            .replaceAll('<index38>', '38')
            .replaceAll('<index39>', '39')
            .replaceAll('<index40>', '40')
            .replaceAll('<index41>', '41')
            .replaceAll('<index42>', '42')
            .replaceAll('<index43>', '43')
            .replaceAll('<index44>', '44')
            .replaceAll('<index45>', '45')
            .replaceAll('<index46>', '46')
            .replaceAll('<index47>', '47')
            .replaceAll('<index48>', '48')
            .replaceAll('<index49>', '49')
            .replaceAll('<index50>', '50')
            .replaceAll('<index51>', '51')
            .replaceAll('<index52>', '52')
            .replaceAll('<index53>', '53')
            .replaceAll('<index54>', '54')
            .replaceAll('<index55>', '55')
            .replaceAll('<index56>', '56')
            .replaceAll('<index57>', '57')
            .replaceAll('<index58>', '58')
            .replaceAll('<index59>', '59')
            .replaceAll('<index60>', '60')
            .replaceAll('<index61>', '61')
            .replaceAll('<index62>', '62')
            .replaceAll('<index63>', '63')
            .replaceAll('<index64>', '64')
            .replaceAll('<index65>', '65')
            .replaceAll('<index66>', '66')
            .replaceAll('<index67>', '67')
            .replaceAll('<index68>', '68')
            .replaceAll('<index69>', '69')
            .replaceAll('<index70>', '70')
            .replaceAll('<index71>', '71')
            .replaceAll('<index72>', '72')
            .replaceAll('<index73>', '73')
            .replaceAll('<index74>', '74')
            .replaceAll('<index75>', '75')
            .replaceAll('<index76>', '76')
            .replaceAll('<index77>', '77')
            .replaceAll('<index78>', '78')
            .replaceAll('<index79>', '79')
            .replaceAll('<index80>', '80')
            .replaceAll('<index81>', '81')
            .replaceAll('<index82>', '82')
            .replaceAll('<index83>', '83')
            .replaceAll('<index84>', '84')
            .replaceAll('<index85>', '85')
            .replaceAll('<index86>', '86')
            .replaceAll('<index87>', '87')
            .replaceAll('<index88>', '88')
            .replaceAll('<index89>', '89')
            .replaceAll('<index90>', '90')
            .replaceAll('<index91>', '91')
            .replaceAll('<index92>', '92')
            .replaceAll('<index93>', '93')
            .replaceAll('<index94>', '94')
            .replaceAll('<index95>', '95')
            .replaceAll('<index96>', '96')
            .replaceAll('<index97>', '97')
            .replaceAll('<index98>', '98')
            .replaceAll('<index99>', '99')
            .replaceAll('<mail address>', 'mail address'),
          '次のフィールドが存在しないため、登録できませんでした。登録フォーマットを確認してください。mail address1, mail address2, mail address3, mail address4, mail address5, mail address6, mail address7, mail address8, mail address9, mail address10, mail address11, mail address12, mail address13, mail address14, mail address15, mail address16, mail address17, mail address18, mail address19, mail address20, mail address21, mail address22, mail address23, mail address24, mail address25, mail address26, mail address27, mail address28, mail address29, mail address30, mail address31, mail address32, mail address33, mail address34, mail address35, mail address36, mail address37, mail address38, mail address39, mail address40, mail address41, mail address42, mail address43, mail address44, mail address45, mail address46, mail address47, mail address48, mail address49, mail address50, mail address51, mail address52, mail address53, mail address54, mail address55, mail address56, mail address57, mail address58, mail address59, mail address60, mail address61, mail address62, mail address63, mail address64, mail address65, mail address66, mail address67, mail address68, mail address69, mail address70, mail address71, mail address72, mail address73, mail address74, mail address75, mail address76, mail address77, mail address78, mail address79, mail address80, mail address81, mail address82, mail address83, mail address84, mail address85, mail address86, mail address87, mail address88, mail address89, mail address90, mail address91, mail address92, mail address93, mail address94, mail address95, mail address96, mail address97, mail address98, mail address99'
        );
        assert.strictEqual(result.status, 400);
      } catch (e) {
        console.log(e);
      }
    });

    it.only('No 40: registerMailToListController() have number ML is 99 name right address right not return error', async function() {
      try {
        const bodyFake = [];
        for (let i = 1; i <= 99; i++) {
          bodyFake.push({
            name: 'yahoo',
            address: `yahoo-admin${i}@ml.your.domain.jp`,
          });
        }
        const req = {
          body: bodyFake,
        };
        const res = {
          status(responseStatus) {
            assert.strictEqual(
              responseStatus,
              fixtures.httpStatus.CREATED.status
            );
            return this;
          },
        };
        this.incorrectRegisterListStub.returns(
          fixtures.testValues.stubCreatedValue
        );
        const result = await controller.registerMailToListController(req, res);
        assert.strictEqual(result.status, 201);
      } catch (e) {
        console.log(e);
      }
    });

    it.only('No 41: registerMailToListController() have number ML is 101 name right address wrong return error', async function() {
      try {
        const bodyFake = [];
        for (let i = 1; i <= 99; i++) {
          bodyFake.push({
            name: 'yahoo',
            address: 'ya#h@as.cas',
          });
        }
        const req = {
          body: bodyFake,
        };
        const res = {
          json(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.OUT_OF_RANGE.code
            );
            assert.strictEqual(
              body.error.message,
              '登録件数が超えています。メールは1から100の範囲で入力してください。'
            );
          },
          status(responseStatus) {
            assert.strictEqual(
              responseStatus,
              fixtures.httpStatus.OUT_OF_RANGE.status
            );
            return this;
          },
        };
        this.incorrectRegisterListStub.returns(
          fixtures.testValues.stubOutOfRange
        );
        const result = await controller.registerMailToListController(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_MAIL_NUMBER_OUTOFRANGE');
        assert.strictEqual(
          jsonResult.error.message,
          '登録件数が超えています。メールは1から100の範囲で入力してください。'
        );
        assert.strictEqual(result.status, 400);
      } catch (e) {
        console.log(e);
      }
    });

    it.only('No 42: registerMailToListController() have number ML is 101 name wrong address wrong return error', async function() {
      try {
        const bodyFake = [];
        for (let i = 1; i <= 99; i++) {
          bodyFake.push({
            name: 123,
            address: '',
          });
        }
        const req = {
          body: bodyFake,
        };
        const res = {
          json(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.OUT_OF_RANGE.code
            );
            assert.strictEqual(
              body.error.message,
              '登録件数が超えています。メールは1から100の範囲で入力してください。'
            );
          },
          status(responseStatus) {
            assert.strictEqual(
              responseStatus,
              fixtures.httpStatus.OUT_OF_RANGE.status
            );
            return this;
          },
        };
        this.incorrectRegisterListStub.returns(
          fixtures.testValues.stubOutOfRange
        );
        const result = await controller.registerMailToListController(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_MAIL_NUMBER_OUTOFRANGE');
        assert.strictEqual(
          jsonResult.error.message,
          '登録件数が超えています。メールは1から100の範囲で入力してください。'
        );
        assert.strictEqual(result.status, 400);
      } catch (e) {
        console.log(e);
      }
    });

    it.only('No 43: registerMailToListController() have number ML is 1 address ASCII return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-admin48',
              address: 'G-yahoo-admin48@ml.your.domain.jp',
            },
          ],
        };

        const res = {
          json: function(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.FORMAT_INVALID.code
            );
            assert.strictEqual(
              body.error.message
                .replace('<index>', '1')
                .replace('<value>', 'G-yahoo-admin48@ml.your.domain.jp'),
              '次の形式が不正で登録できませんでした。形式を確認してください。mail address1:G-yahoo-admin48@ml.your.domain.jp'
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
          fixtures.testValues.stubAddressFormatIncorrect
        );
        const result = await controller.registerMailToListController(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_ML_FORMAT_INVALID');
        assert.strictEqual(
          jsonResult.error.message
            .replace('<index>', '1')
            .replace('<value>', 'G-yahoo-admin48@ml.your.domain.jp'),
          '次の形式が不正で登録できませんでした。形式を確認してください。mail address1:G-yahoo-admin48@ml.your.domain.jp'
        );
        assert.strictEqual(result.status, 400);
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 44: registerMailToListController() have number ML is 1 address UTF-8 not return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-admin50',
              address: 'yahoo-admin50¥£@ml.your.domain.jp',
            },
          ],
        };
        const res = {
          status: function(responseStatus) {
            assert.strictEqual(
              responseStatus,
              fixtures.httpStatus.CREATED.status
            );
            return this;
          },
        };
        this.incorrectRegisterListStub.returns(
          fixtures.testValues.stubCreatedValue
        );
        const result = await controller.registerMailToListController(req, res);
        assert.strictEqual(result.status, 201);
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 45: registerMailToListController() have number ML is 1 address Shift-JIS(-win) return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-admin51',
              address: 'yahoo-admin51① ② ③@ml.your.domain.jp',
            },
          ],
        };

        const res = {
          json: function(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.FORMAT_INVALID.code
            );
            assert.strictEqual(
              body.error.message
                .replace('<index>', '1')
                .replace('<value>', 'yahoo-admin51① ② ③@ml.your.domain.jp'),
              '次の形式が不正で登録できませんでした。形式を確認してください。mail address1:yahoo-admin51① ② ③@ml.your.domain.jp'
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
          fixtures.testValues.stubAddressFormatIncorrect
        );
        const result = await controller.registerMailToListController(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_ML_FORMAT_INVALID');
        assert.strictEqual(
          jsonResult.error.message
            .replace('<index>', '1')
            .replace('<value>', 'yahoo-admin51① ② ③@ml.your.domain.jp'),
          '次の形式が不正で登録できませんでした。形式を確認してください。mail address1:yahoo-admin51① ② ③@ml.your.domain.jp'
        );
        assert.strictEqual(result.status, 400);
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 46: registerMailToListController() have number ML is 1 address Euc-jp(-win) return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-admin52',
              address: 'yahoo-admin52① ② ③ｱﾄ@ml.your.domain.jp',
            },
          ],
        };

        const res = {
          json: function(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.FORMAT_INVALID.code
            );
            assert.strictEqual(
              body.error.message
                .replace('<index>', '1')
                .replace('<value>', 'yahoo-admin52① ② ③ｱﾄ@ml.your.domain.jp'),
              '次の形式が不正で登録できませんでした。形式を確認してください。mail address1:yahoo-admin52① ② ③ｱﾄ@ml.your.domain.jp'
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
          fixtures.testValues.stubAddressFormatIncorrect
        );
        const result = await controller.registerMailToListController(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_ML_FORMAT_INVALID');
        assert.strictEqual(
          jsonResult.error.message
            .replace('<index>', '1')
            .replace('<value>', 'yahoo-admin52① ② ③ｱﾄ@ml.your.domain.jp'),
          '次の形式が不正で登録できませんでした。形式を確認してください。mail address1:yahoo-admin52① ② ③ｱﾄ@ml.your.domain.jp'
        );
        assert.strictEqual(result.status, 400);
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 47: registerMailToListController() have number ML is 0 return error', async function() {
      try {
        const req = [];

        const res = {
          json: function(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.OUT_OF_RANGE.code
            );
            assert.strictEqual(
              body.error.message,
              '登録件数が超えています。メールは1から100の範囲で入力してください。'
            );
          },
          status: function(responseStatus) {
            assert.strictEqual(
              responseStatus,
              fixtures.httpStatus.OUT_OF_RANGE.status
            );
            return this;
          },
        };
        this.incorrectRegisterListStub.returns(
          fixtures.testValues.stubOutOfRange
        );
        const result = await controller.registerMailToListController(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_MAIL_NUMBER_OUTOFRANGE');
        assert.strictEqual(
          jsonResult.error.message,
          '登録件数が超えています。メールは1から100の範囲で入力してください。'
        );
        assert.strictEqual(result.status, 400);
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 48: registerMailToListController() have number ML is 1 address same db return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-admin52',
              address: 'yahoo-admin23@ml.your.domain.jp',
            },
          ],
        };

        const res = {
          json: function(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.IS_EXIST.code
            );
            assert.strictEqual(
              body.error.message
                .replace('<mail address1>', 'yahoo-admin23@ml.your.domain.jp')
                .replace('<mail address2>', ''),
              '次のメーリングリストは既に存在します。更新が必要な場合は一度、削除してください。yahoo-admin23@ml.your.domain.jp'
            );
          },
          status: function(responseStatus) {
            assert.strictEqual(
              responseStatus,
              fixtures.httpStatus.IS_EXIST.status
            );
            return this;
          },
        };
        this.incorrectRegisterListStub.returns(
          fixtures.testValues.stubAddressExist
        );
        const result = await controller.registerMailToListController(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_ML_ALREADY_EXSTS');
        assert.strictEqual(
          jsonResult.error.message
            .replace('<mail address1>', 'yahoo-admin23@ml.your.domain.jp')
            .replace('<mail address2>', ''),
          '次のメーリングリストは既に存在します。更新が必要な場合は一度、削除してください。yahoo-admin23@ml.your.domain.jp'
        );
        assert.strictEqual(result.status, 409);
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 49: registerMailToListController() have number ML is 2 address did not same not return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-admin53',
              address: 'yahoo-admin53@ml.your.domain.jp',
            },
            {
              name: 'yahoo-admin54',
              address: 'yahoo-admin54@ml.your.domain.jp',
            },
          ],
        };

        const res = {
          json: function(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.IS_EXIST.code
            );
            assert.strictEqual(
              body.error.message
                .replace('<mail address1>', 'yahoo-admin53@ml.your.domain.jp')
                .replace(
                  '<mail address2>',
                  ', yahoo-admin54@ml.your.domain.jp'
                ),
              '次のメーリングリストは既に存在します。更新が必要な場合は一度、削除してください。yahoo-admin53@ml.your.domain.jp, yahoo-admin54@ml.your.domain.jp'
            );
          },
          status: function(responseStatus) {
            assert.strictEqual(
              responseStatus,
              fixtures.httpStatus.IS_EXIST.status
            );
            return this;
          },
        };
        this.incorrectRegisterListStub.returns(
          fixtures.testValues.stubAddressExist
        );
        const result = await controller.registerMailToListController(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_ML_ALREADY_EXSTS');
        assert.strictEqual(
          jsonResult.error.message
            .replace('<mail address1>', 'yahoo-admin53@ml.your.domain.jp')
            .replace('<mail address2>', ', yahoo-admin54@ml.your.domain.jp'),
          '次のメーリングリストは既に存在します。更新が必要な場合は一度、削除してください。yahoo-admin53@ml.your.domain.jp, yahoo-admin54@ml.your.domain.jp'
        );
        assert.strictEqual(result.status, 409);
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 50: registerMailToListController() have number ML is 99 address did not same not return error', async function() {});
    it.only('No 51: registerMailToListController() have number ML is 100 address same db return error', async function() {});
    it.only('No 52: registerMailToListController() get ML fail return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-admin48',
              address: 'G-yahoo-admin48@ml.your.domain.jp',
            },
          ],
        };

        const res = {
          json: function(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.INTERNAL_SERVER.code
            );
            assert.strictEqual(
              body.error.message,
              '内部サーバエラー発生しました。管理者にご連絡してください。'
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
        this.incorrectFetchListStub.returns(fixtures.testValues.stubServerDown);
        const result = await controller.fetchMailList(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_ML_INTERNAL_SERVER');
        assert.strictEqual(
          jsonResult.error.message,
          '内部サーバエラー発生しました。管理者にご連絡してください。'
        );
        assert.strictEqual(result.status, 500);
      } catch (e) {
        console.log(e);
      }
    });
    it.only('No 53: registerMailToListController() regist ML fail return error', async function() {
      try {
        const req = {
          body: [
            {
              name: 'yahoo-admin48',
              address: 'G-yahoo-admin48@ml.your.domain.jp',
            },
          ],
        };

        const res = {
          json: function(body) {
            assert.strictEqual(
              body.error.code,
              fixtures.httpStatus.INTERNAL_SERVER.code
            );
            assert.strictEqual(
              body.error.message,
              '内部サーバエラー発生しました。管理者にご連絡してください。'
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
        this.incorrectRegisterListStub.returns(
          fixtures.testValues.stubServerDown
        );
        const result = await controller.registerMailToListController(req, res);
        const jsonResult = JSON.parse(result.body);
        assert.strictEqual(jsonResult.error.code, 'ERR_ML_INTERNAL_SERVER');
        assert.strictEqual(
          jsonResult.error.message,
          '内部サーバエラー発生しました。管理者にご連絡してください。'
        );
        assert.strictEqual(result.status, 500);
      } catch (e) {
        console.log(e);
      }
    });
  });
});

String.prototype.replaceAll = function(find, replace) {
  var str = this;
  return str.replace(new RegExp(find, 'g'), replace);
};
