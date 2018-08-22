/* eslint-env mocha */
/* eslint-disable no-unused-vars */
import { assert } from 'chai';
import supertest from 'supertest';
import { describe } from 'mocha';
import app from '../../src/app';
import fixtures from './fixtures';

const requestApp = supertest.agent(app);

describe('test app in src/app', () => {
  describe('negative test', () => {
    it('access incorrect path(/hoge) returns 404', done => {
      requestApp.get('/hoge').end((err, res) => {
        assert.strictEqual(fixtures.errors.status.notFound, res.status);
        done();
      });
    });
  });
});
