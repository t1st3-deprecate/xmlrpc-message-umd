'use strict';

/* global mocha,describe,it */

require.config({
  baseUrl: '',
  paths: {
    jquery: 'lib/jquery',
    mocha: 'lib/mocha',
    chai: 'lib/chai',
    chaijquery: 'lib/chai-jquery',
    bootstrap: 'lib/bootstrap.min'
  },
  shim: {
    jquery: {
      exports: '$'
    },
    chaijquery: ['jquery', 'chai'],
    bootstrap: ['jquery']
  },
  scriptType: 'text/javascript'
});

require([
  'chai',
  'chaijquery',
  'jquery',
  'mocha',
  'bootstrap'
], function (chai, chaiJquery, $) {

  var should = chai.should();
  chai.use(chaiJquery);

  mocha.setup('bdd');

  describe('module tests', function () {
    describe('#mathWorks()', function () {
      it('should return true', function (done) {
        (4).should.equal(2 + 2);
        done();
      });
    });
  });
  
  describe('module tests', function () {
    describe('#mathWorksAgain()', function () {
      it('should return true', function (done) {
        (64).should.equal(8 * 8);
        done();
      });
    });
  });
  
  describe('module tests', function () {
    describe('#mathWorksHard()', function () {
      it('should return true', function (done) {
        (16).should.equal(64 / 4);
        done();
      });
    });
  });
  
  mocha.run();
});
