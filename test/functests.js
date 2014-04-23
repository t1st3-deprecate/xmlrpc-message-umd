/* global define,describe,it,mocha,chai */
/* jshint unused:false */

'use strict';

(function (root, factory) {
  // Test for AMD modules
  if (typeof define === 'function' && define.amd) {
    // AMD
    require.config({
      baseUrl: '',
      paths: {
        jquery: 'assets/js/lib/jquery.min',
        mocha: 'assets/js/lib/mocha',
        chai: 'assets/js/lib/chai',
        chaijquery: 'assets/js/lib/chai-jquery',
        bootstrap: 'assets/js/lib/bootstrap.min',
        xmlrpcmessage: 'assets/js/lib/xmlrpc-message-umd',
        btoa: 'assets/js/lib/btoa-umd'
      },
      shim: {
        jquery: {
          exports: '$'
        },
        chaijquery: ['jquery', 'chai'],
        bootstrap: ['jquery'],
        xmlrpcmessage: {
          exports: 'XMLRPCMessage'
        }
      },
      scriptType: 'text/javascript'
    });
    define([
      'chai',
      'xmlrpcmessage',
      'jquery',
      'mocha',
      'bootstrap'
    ], factory);
  // Test for Node.js
  } else if (typeof exports === 'object') {
    // Node
    module.exports = factory(require('chai'), require('../src/xmlrpc-message-umd'));
  // Browser globals
  } else {
    // Browser globals
    root.XMLRPCMessage = factory(root.chai, root.XMLRPCMessage);
  }
}(this, function (chai, XMLRPCMessage) {

  if (typeof exports !== 'object') {
    mocha.setup('bdd');
  }
  var should = chai.should();

  describe('Functional tests', function () {
    describe('Test XMLRPC', function () {
      it('should return the correct XML', function (done) {
        var a = ['chicken', 'duck', 'goose'];
        var bin = XMLRPCMessage.btoa('Hello world');
        var obj = {};
        obj.x = 20;
        obj.y = 'cow';
        obj.z = 3.14;
        var msg = new XMLRPCMessage();
        msg.setMethod('system.myMethod');
        msg.addParameter('mississippi');
        msg.addParameter(7);
        msg.addParameter(false);
        msg.addParameter(bin);
        msg.addParameter(a);
        msg.addParameter(obj);
        
        var str = '<?xml version=\'1.0\'?>\n';
        str += '<methodCall>\n';
        str += '<methodName>system.myMethod</methodName>\n';
        str += '<params>\n';
        str += '<param>\n';
        str += '<value><string>mississippi</string></value>\n';
        str += '</param>\n';
        str += '<param>\n';
        str += '<value><int>7</int></value>\n';
        str += '</param>\n';
        str += '<param>\n';
        str += '<value><boolean>0</boolean></value>\n';
        str += '</param>\n';
        str += '<param>\n';
        str += '<value><base64>SGVsbG8gd29ybGQ=</base64></value>\n';
        str += '</param>\n';
        str += '<param>\n';
        str += '<value><array><data>\n';
        str += '<value><string>chicken</string></value>\n';
        str += '<value><string>duck</string></value>\n';
        str += '<value><string>goose</string></value>\n';
        str += '</data></array>\n';
        str += '</value>\n';
        str += '</param>\n';
        str += '<param>\n';
        str += '<value><struct>\n';
        str += '<member>\n';
        str += '<name>x</name>\n';
        str += '<value><int>20</int></value>\n';
        str += '</member>\n';
        str += '<member>\n';
        str += '<name>y</name>\n';
        str += '<value><string>cow</string></value>\n';
        str += '</member>\n';
        str += '<member>\n';
        str += '<name>z</name>\n';
        str += '<value><double>3.14</double></value>\n';
        str += '</member>\n';
        str += '</struct>\n';
        str += '</value>\n';
        str += '</param>\n';
        str += '</params>\n';
        str += '</methodCall>';

        msg.xml().should.equal(str);
        done();
      });
    });
  });
  
  if (typeof exports !== 'object') {
    mocha.run();
  }
}));
