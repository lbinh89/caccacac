/* eslint-disable no-unused-vars */
/* eslint-env mocha */
import chai from 'chai';
import express from 'express';
import { describe } from 'mocha';
import * as jsonServer from 'json-server';
import fixtures from './../../fixtures';
import mail from './../../../src/models/mail/index';

const should = chai.should();
const server = express();

describe('test for model/mail/index', () => {
  before(() => {
    server.use('/db', jsonServer.router('./mock/config/mockDb.json'));
    server.listen(fixtures.port.mailIndexTestJsonServer);
  });
  describe('positive test', () => {
    it('get mail list without id returns 200', done => {
      const values = fixtures.testValues.mailIndexTest.fetchAll;
      mail.fetchRegisteredMailList(
        { parameters: { values: values } },
        result => {
          result.should.be.an('object');
          should.exist(result.text);
          result.text.should.be.an('array');
          should.exist(result.status);
          result.status.should.equal(fixtures.errors.number.ok);
          done();
        }
      );
    });
    it('get mail list with id returns 200', done => {
      const values = fixtures.testValues.mailIndexTest.fetchById;
      mail.fetchRegisteredMailList(
        { parameters: { values: values } },
        result => {
          result.should.be.an('object');
          should.exist(result.text);
          result.text.should.be.an('array');
          should.exist(result.status);
          result.status.should.equal(fixtures.errors.number.ok);
          done();
        }
      );
    });
    it('register mail with id=888 to list returns 201', done => {
      const values = fixtures.testValues.mailIndexTest.registerMail;
      mail.registerMailToList(values, result => {
        result.should.be.an('object');
        should.exist(result.text);
        result.text.should.be.an('object');
        should.exist(result.status);
        result.status.should.equal(fixtures.errors.number.created);
        done();
      });
    });
    it('remove mail with id=888 from list returns 204', done => {
      const values = fixtures.testValues.mailIndexTest.removeMail;
      mail.removeMailFromList(values, result => {
        result.should.be.an('object');
        should.exist(result.text);
        result.text.should.be.an('object');
        should.exist(result.status);
        result.status.should.equal(fixtures.errors.number.deleted);
        done();
      });
    });
  });
  describe('negative test', () => {
    it('get mail list from non-existent DB returns 500', done => {
      const values = fixtures.testValues.mailIndexTest.errFetchMail;
      mail.fetchRegisteredMailList(
        { parameters: { values: values } },
        result => {
          result.should.be.an('object');
          should.exist(result.text);
          result.text.should.be.an('string');
          should.exist(result.status);
          result.status.should.not.equal(fixtures.errors.number.ok);
          done();
        }
      );
    });
    it('register mail list from non-existent DB returns 500', done => {
      const values = fixtures.testValues.mailIndexTest.errRegisterMail;
      mail.registerMailToList(values, result => {
        result.should.be.an('object');
        should.exist(result.text);
        result.text.should.be.an('string');
        should.exist(result.status);
        result.status.should.not.equal(fixtures.errors.number.ok);
        done();
      });
    });
    it('remove mail with non-exist id from DB returns 404', done => {
      const values = fixtures.testValues.mailIndexTest.errIdRemoveMail;
      mail.removeMailFromList(values, result => {
        result.should.be.an('object');
        should.exist(result.text);
        result.text.should.be.an('string');
        should.exist(result.status);
        result.status.should.not.equal(fixtures.errors.number.deleted);
        result.status.should.equal(fixtures.errors.number.notFound);
        done();
      });
    });
    it('remove mail with id from  non-existent DB returns 500', done => {
      const values = fixtures.testValues.mailIndexTest.errIpRemoveMail;
      mail.removeMailFromList(values, result => {
        result.should.be.an('object');
        should.exist(result.text);
        result.text.should.be.an('string');
        should.exist(result.status);
        result.status.should.not.equal(fixtures.errors.number.deleted);
        result.status.should.equal(fixtures.errors.number.notFound);
        done();
      });
    });
  });
});
