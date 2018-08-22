/* eslint-disable no-unused-vars */
/* eslint-env mocha */
import { describe } from 'mocha';
import { assert } from 'chai';
import config from '../../../src/config/config';
import fixtures from '../fixtures';

describe('test config in src/config', () => {
  describe('check port object', () => {
    it('correct number of port for app', () => {
      assert.strictEqual(fixtures.port.app, config.port.app);
    });
    it('correct number of port for jsonServer', () => {
      assert.strictEqual(fixtures.port.jsonServer, config.port.jsonServer);
    });
  });
  describe('check errors object', () => {
    describe('check status object', () => {
      it('correct number of ok', () => {
        assert.strictEqual(fixtures.errors.status.ok, config.errors.status.ok);
      });
      it('correct number of internalServerError', () => {
        assert.strictEqual(
          fixtures.errors.status.internalServerError,
          config.errors.status.internalServerError
        );
      });
      it('correct number of notFound', () => {
        assert.strictEqual(
          fixtures.errors.status.notFound,
          config.errors.status.notFound
        );
      });
    });
    describe('check number object', () => {
      it('correct number of process exit code', () => {
        assert.strictEqual(
          fixtures.errors.number.processExit,
          config.errors.number.processExit
        );
      });
    });
    describe('check errorCode(String)', () => {
      it('correct string of errorCode for permissionDenied', () => {
        assert.strictEqual(
          fixtures.errors.errorCode.permissionDenied,
          config.errors.errorCode.permissionDenied
        );
      });
      it('correct string of errorCode for addressInUsed', () => {
        assert.strictEqual(
          fixtures.errors.errorCode.addressInUsed,
          config.errors.errorCode.addressInUsed
        );
      });
    });
  });
});
