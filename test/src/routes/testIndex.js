/* eslint-disable no-unused-vars */
/* eslint-env mocha */

import express from 'express';
import supertest from 'supertest';
import { describe } from 'mocha';
import chai from 'chai';
import sinon from 'sinon';
import index from '../../../src/routes/index';
import Controller from '../../../src/controllers/Controller';
import fixtures from '../fixtures';

const assert = chai.assert;
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '10mb' }));
app.use(index);

describe('test for routes/index', () => {
  describe('positive test', () => {
    /*
    before(function() {
      this.correctFetchMailListStub = sinon.stub(
        Controller.prototype,
        'fetchMailList'
      );
    });
    afterEach(function() {
      this.correctFetchMailListStub.reset();
    });
    it('get correct path(/list) returns 200', function() {
      this.correctFetchMailListStub.callsFake(function(req, res) {
        res = fixtures.testValues.stubReturnValue;
        return req, res;
      });
      supertest(app).get('/list');
    });
    */
  });
  describe('negative test', () => {
    it('get incorrect path(/) returns 404', done => {
      supertest(app)
        .get('/')
        .end((err, res) => {
          assert.strictEqual(fixtures.errors.status.notFound, res.status);
          done();
        });
    });
  });
});
