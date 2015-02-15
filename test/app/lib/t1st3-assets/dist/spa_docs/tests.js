/* global define,describe,it */
/* jshint unused:false */

'use strict';

(function (root, factory) {
  // Test for AMD modules
  if (typeof define === 'function' && define.amd) {
    // AMD
    require.config({
      baseUrl: '',
      paths: {
        jquery: 'app/lib/jquery/dist/jquery.min',
        mocha: 'app/lib/mocha/mocha',
        chai: 'app/lib/chai/chai',
        chaijquery: 'app/lib/chai-jquery/chai-jquery',
        bootstrap: 'app/lib/bootstrap/dist/js/bootstrap.min'
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
    define([
      'chai',
      'jquery',
      'mocha',
      'bootstrap'
    ], factory);
  // Test for Node.js
  } else if (typeof exports === 'object') {
    // Node
    module.exports = factory(require('chai'));
  // Browser globals
  } else {
    // Browser globals
    root.myModule = factory(root.chai);
  }
}(this, function (chai) {

  if (typeof exports !== 'object') {
    mocha.setup('bdd');
  }
  var should = chai.should();

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
  
  if (typeof exports !== 'object') {
    mocha.run();
  }
}));
