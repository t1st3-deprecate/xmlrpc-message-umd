'use strict';

/* global mocha,describe,it */

require.config({
  baseUrl: '',
  paths: {
    jquery: 'lib/jquery',
    mocha: 'lib/mocha',
    chai: 'lib/chai',
    chaijquery: 'lib/chai-jquery',
    bootstrap: 'lib/bootstrap.min',
    xmlrpcmessage: 'lib/xmlrpc-message-umd',
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

require([
  'chai',
  'chaijquery',
  'jquery',
  'xmlrpcmessage',
  'mocha',
  'bootstrap'
], function (chai, chaiJquery, $, XMLRPCMessage) {

  var should = chai.should();
  chai.use(chaiJquery);

  mocha.setup('bdd');

  describe('xmlrpc-message tests', function () {
    describe('#callbackWorks()', function () {
      it('should return the correct XML', function (done) {
        var a = ['chicken', 'duck', 'goose'];
        var obj = {};
        obj.x = 20;
        obj.y = 'cow';
        obj.z = 3.14;
        var date = new Date();
        var msg = new XMLRPCMessage('system.myMethod');
        msg.setMethod('system.myMethod');
        msg.addParameter('mississippi');
        msg.addParameter(7);
        msg.addParameter(false);
        msg.addParameter(a);
        msg.addParameter(obj);
        
        var str = "<?xml version='1.0'?>\n";
        str += '<methodCall>\n';
        str += '<methodName>system.myMethod</methodName>\n';
        str += '<params>\n';
        str += '<param>\n';
        str += '<value><string>mississippi</string></value>\n';
        str += '</param>\n';
        str += '<param>\n';
        str += '<value><i4>7</i4></value>\n';
        str += '</param>\n';
        str += '<param>\n';
        str += '<value><boolean>0</boolean></value>\n';
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
        str += '<value><i4>20</i4></value>\n';
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
  
  mocha.run();
});
