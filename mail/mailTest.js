/* eslint-env mocha */
import chai from 'chai';
import express from 'express';
import { describe } from 'mocha';
import * as jsonServer from 'json-server';
import fixtures from './../../fixtures';
import Mail from './../../../src/models/mail/index';

const should = chai.should();
const server = express();

describe('test for model/mail/index', () => {
  before(() => {
    server.use('/db', jsonServer.router('./mock/config/mockDb.json'));
    server.listen(fixtures.port.mailClassTestJsonServer);
  });
  describe('positive test', () => {
    it('get mail list without id from DB returns 200', done => {
      const values = fixtures.testValues.mailModelTest.fetchAll;
      Mail.fetchRegisteredMailList(values, result => {
        result.should.be.an('object');
        should.exist(result.text);
        result.text.should.be.an('array');
        should.exist(result.status);
        result.status.should.equal(fixtures.errors.number.ok);
        done();
      });
    });
  });
  describe('negative test', () => {
    it('get mail list from non-existent DB returns 500', done => {
      const values = fixtures.testValues.mailModelTest.errFetchMail;
      Mail.fetchRegisteredMailList(values, result => {
        result.should.be.an('object');
        should.exist(result.text);
        result.text.should.be.a('string');
        should.exist(result.status);
        result.status.should.not.equal(fixtures.errors.number.ok);
        done();
      });
    });
  });
});
