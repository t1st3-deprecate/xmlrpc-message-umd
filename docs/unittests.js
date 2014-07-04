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
        lodash: 'assets/js/lib/lodash.min',
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
    root.XMLRPCMessageTests = factory(root.chai, root.XMLRPCMessage);
  }
}(this, function (chai, XMLRPCMessage) {

  if (typeof exports !== 'object') {
    mocha.setup('bdd');
  }
  var should = chai.should();

  describe('tests against constructor', function () {
    describe('Correct param for method', function () {
      it('method should be set', function (done) {
        var msg = new XMLRPCMessage('myMethod');
        msg.method.should.equal('myMethod');
        done();
      });
    });
    describe('Test method existence', function () {
      it('XMLRPCMessage should have addParameter method', function (done) {
        var msg = new XMLRPCMessage();
        msg.addParameter.should.be.a('function');
        done();
      });
      it('XMLRPCMessage should have setMethod method', function (done) {
        var msg = new XMLRPCMessage();
        msg.setMethod.should.be.a('function');
        done();
      });
      it('XMLRPCMessage should have xml method', function (done) {
        var msg = new XMLRPCMessage();
        msg.xml.should.be.a('function');
        done();
      });
    });
  });

  describe('tests against setMethod', function () {
    describe('No param for methodName', function () {
      it('XMLRPCMessage should not have been altered', function (done) {
        var msg = new XMLRPCMessage(),
        res = msg.setMethod();
        msg.should.equal(res);
        done();
      });
    });
    describe('Correct param for methodName', function () {
      it('method should be set', function (done) {
        var msg = new XMLRPCMessage();
        msg.setMethod('my.method');
        'my.method'.should.equal(msg.method);
        done();
      });
    });
  });

  describe('tests against addParameter', function () {
    describe('No param for data', function () {
      it('XMLRPCMessage should not have been altered', function (done) {
        var msg = new XMLRPCMessage(),
        res = msg.addParameter();
        msg.should.equal(res);
        done();
      });
    });
    describe('Correct param "xyz" for data', function () {
      it('Should return "xyz"', function (done) {
        var msg = new XMLRPCMessage();
        msg.addParameter('xyz');
        msg.params[0].should.equal('xyz');
        done();
      });
    });
    describe('Correct param 22 for data', function () {
      it('Should return 22', function (done) {
        var msg = new XMLRPCMessage();
        msg.addParameter(20);
        msg.addParameter(22);
        msg.params[1].should.equal(22);
        done();
      });
    });
    describe('Correct param 39.5 for data', function () {
      it('Should return 39.5', function (done) {
        var msg = new XMLRPCMessage();
        msg.addParameter(39.5);
        msg.params[0].should.equal(39.5);
        done();
      });
    });
    describe('Correct param [] for data', function () {
      it('Should return an array with length = 0', function (done) {
        var msg = new XMLRPCMessage();
        msg.addParameter([]);
        msg.params[0].should.have.length(0);
        done();
      });
    });
      describe('Correct param ["a", "b"] for data', function () {
      it('Should return an array with length = 2', function (done) {
        var msg = new XMLRPCMessage();
        msg.addParameter(['a', 'b']);
        msg.params[0].should.have.length(2);
        done();
      });
    });
    describe('Correct param {} for data', function () {
      it('Should return an object', function (done) {
      var msg = new XMLRPCMessage();
        msg.addParameter({});
        msg.params[0].should.have.be.a('object');
        done();
      });
    });
    describe('Correct param {a: "b", c: "d"} for data', function () {
      it('Should return an object with "a" property of length 1', function (done) {
        var msg = new XMLRPCMessage();
        msg.addParameter({a: 'b', c: 'd'});
        msg.params[0].should.have.property('a').with.length(1);
        done();
      });
    });
    describe('Correct param Date for data', function () {
      it('Should return Date', function (done) {
        var y2k = new Date(2000, 1, 1, 0, 0, 0, 0),
        msg = new XMLRPCMessage();
        msg.addParameter(y2k);
        msg.params[0].should.equal(y2k);
        done();
      });
    });
    describe('Correct param btoa("Hello world") for data', function () {
      it('Should return SGVsbG8gd29ybGQ=', function (done) {
        var bin = XMLRPCMessage.btoa('Hello world'),
        msg = new XMLRPCMessage();
        msg.addParameter(bin);
        msg.params[0].a.should.equal('SGVsbG8gd29ybGQ=');
        done();
      });
    });
  });

  describe('tests against xml', function () {
    describe('No param', function () {
      it('Should return the correct XML', function (done) {
        var msg = new XMLRPCMessage(),
        str = '',
        res = msg.xml();
        str += '<?xml version=\'1.0\'?>\n<methodCall>\n<methodName>undefined';
        str += '</methodName>\n<params>\n</params>\n</methodCall>';
        res.should.equal(str);
        done();
      });
    });
    describe('Correct params', function () {
      it('should return the correct XML', function (done) {
        console.log('This should be a functional test rather than a unit one');
        var a = ['chicken', 'duck', 'goose'],
        bin = XMLRPCMessage.btoa('Hello world'),
        obj = {},
        msg = null,
        str = '';
        obj.x = 20;
        obj.y = 'cow';
        obj.z = 3.14;
        msg = new XMLRPCMessage();
        msg.setMethod('system.myMethod');
        msg.addParameter('mississippi');
        msg.addParameter(7);
        msg.addParameter(false);
        msg.addParameter(bin);
        msg.addParameter(a);
        msg.addParameter(obj);

        str = '<?xml version=\'1.0\'?>\n';
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

  describe('tests against dataTypeOf', function () {
    describe('No param for o', function () {
      it('Should return false', function (done) {
        var type = XMLRPCMessage.dataTypeOf();
        type.should.equal(false);
        done();
      });
    });
    describe('Correct param "xyz" for o', function () {
      it('Should return "string"', function (done) {
        var type = XMLRPCMessage.dataTypeOf('xyz');
        type.should.equal('string');
        done();
      });
    });
    describe('Correct param 22 for o', function () {
      it('Should return "int"', function (done) {
        var type = XMLRPCMessage.dataTypeOf(22);
        type.should.equal('int');
        done();
      });
    });
    describe('Correct param 39.5 for o', function () {
      it('Should return "double"', function (done) {
        var type = XMLRPCMessage.dataTypeOf(39.5);
        type.should.equal('double');
        done();
      });
    });
    describe('Correct param [] for o', function () {
      it('Should return "array"', function (done) {
        var type = XMLRPCMessage.dataTypeOf([]);
        type.should.equal('array');
        done();
      });
    });
      describe('Correct param ["a", "b"] for o', function () {
      it('Should return "array"', function (done) {
        var type = XMLRPCMessage.dataTypeOf(['a', 'b']);
        type.should.equal('array');
        done();
      });
    });
    describe('Correct param {} for o', function () {
      it('Should return "struct"', function (done) {
        var type = XMLRPCMessage.dataTypeOf({});
        type.should.equal('struct');
        done();
      });
    });
    describe('Correct param {a: "b", c: "d"} for o', function () {
      it('Should return "struct"', function (done) {
        var type = XMLRPCMessage.dataTypeOf({a: 'b', c: 'd'});
        type.should.equal('struct');
        done();
      });
    });
    describe('Correct param Date for o', function () {
      it('Should return "date"', function (done) {
        var y2k = new Date(2000, 1, 1, 0, 0, 0, 0),
        type = XMLRPCMessage.dataTypeOf(y2k);
        type.should.equal('date');
        done();
      });
    });
    describe('Correct param base64 for o', function () {
      it('Should return "base64"', function (done) {
        var type = XMLRPCMessage.dataTypeOf(XMLRPCMessage.btoa('iiiiiiii'));
        type.should.equal('base64');
        done();
      });
    });
  });

  describe('tests against doValueXML', function () {
    describe('No param for data', function () {
      it('Should return ""', function (done) {
        var xml = XMLRPCMessage.doValueXML();
        xml.should.equal('');
        done();
      });
    });
    describe('Correct param "abc" for data', function () {
      it('Should return <string>abc</string>', function (done) {
        var xml = XMLRPCMessage.doValueXML('abc', 'string');
        xml.should.equal('<string>abc</string>');
        done();
      });
    });
    describe('Correct param 8 for data', function () {
      it('Should return <int>8</int>', function (done) {
        var xml = XMLRPCMessage.doValueXML(8, 'int');
        xml.should.equal('<int>8</int>');
        done();
      });
    });
    describe('Correct param 9.7 for data', function () {
      it('Should return <double>9.7</double>', function (done) {
        var xml = XMLRPCMessage.doValueXML(9.7, 'double');
        xml.should.equal('<double>9.7</double>');
        done();
      });
    });
  });

  describe('tests against doBooleanXML', function () {
    describe('No param for data', function () {
      it('Should return ""', function (done) {
        var xml = XMLRPCMessage.doBooleanXML();
        xml.should.equal('');
        done();
      });
    });
    describe('Correct param true for data', function () {
      it('Should return <boolean>1</boolean>', function (done) {
        var xml = XMLRPCMessage.doBooleanXML(true);
        xml.should.equal('<boolean>1</boolean>');
        done();
      });
    });
    describe('Correct param false for data', function () {
      it('Should return <boolean>0</boolean>', function (done) {
        var xml = XMLRPCMessage.doBooleanXML(false);
        xml.should.equal('<boolean>0</boolean>');
        done();
      });
    });
  });

  describe('tests against doDateXML', function () {
    describe('No param for data', function () {
      it('Should return ""', function (done) {
        var xml = XMLRPCMessage.doDateXML();
        xml.should.equal('');
        done();
      });
    });
    describe('Correct param for data', function () {
      it('Should return <dateTime.iso8601></dateTime.iso8601>', function (done) {
        var y2k = new Date(2000, 1, 1, 0, 0, 0, 0),
        xml = XMLRPCMessage.doDateXML(y2k);
        xml.should.equal('<dateTime.iso8601>1000101T00:00:00</dateTime.iso8601>');
        done();
      });
    });
  });

  describe('tests against doArrayXML', function () {
    describe('No param for data', function () {
      it('Should return ""', function (done) {
        var xml = XMLRPCMessage.doArrayXML();
        xml.should.equal('');
        done();
      });
    });
    describe('Correct param [] for data', function () {
      it('Should return <array><data>\n</data></array>\n', function (done) {
        var xml = XMLRPCMessage.doArrayXML([]);
        xml.should.equal('<array><data>\n</data></array>\n');
        done();
      });
    });
    describe('Correct param ["a"] for data', function () {
      it('Should return the correct XML', function (done) {
        var xml = XMLRPCMessage.doArrayXML(['a']),
        str = '<array><data>\n';
        str += '<value><string>a</string></value>\n';
        str += '</data></array>\n';
        done();
      });
    });
    describe('Correct param ["a", "b", "c"] for data', function () {
      it('Should return the correct XML', function (done) {
        var xml = XMLRPCMessage.doArrayXML(['a', 'b', 'c']),
        str = '<array><data>\n';
        str += '<value><string>a</string></value>\n';
        str += '<value><string>b</string></value>\n';
        str += '<value><string>c</string></value>\n';
        str += '</data></array>\n';
        done();
      });
    });
  });

  describe('tests against doStructXML', function () {
    describe('No param for data', function () {
      it('Should return ""', function (done) {
        var xml = XMLRPCMessage.doStructXML();
        xml.should.equal('');
        done();
      });
    });
    describe('Correct param {} for data', function () {
      it('Should return <struct></struct>', function (done) {
        var xml = XMLRPCMessage.doStructXML({});
        xml.should.equal('<struct>\n</struct>\n');
        done();
      });
    });
    describe('Correct param {a: "b"} for data', function () {
      it('Should return the correct XML', function (done) {
        var xml = XMLRPCMessage.doStructXML({a: 'b'}),
        str = '<struct>\n';
        str += '<member>\n';
        str += '<name>a</name>\n';
        str += '<value><string>b</string></value>\n';
        str += '</member>\n';
        str += '</struct>\n';
        xml.should.equal(str);
        done();
      });
    });
    describe('Correct param {c: "d", e: 4} for data', function () {
      it('Should return the correct XML', function (done) {
        var xml = XMLRPCMessage.doStructXML({c: 'd', e: 4}),
        str = '<struct>\n';
        str += '<member>\n';
        str += '<name>c</name>\n';
        str += '<value><string>d</string></value>\n';
        str += '</member>\n';
        str += '<member>\n';
        str += '<name>e</name>\n';
        str += '<value><int>4</int></value>\n';
        str += '</member>\n';
        str += '</struct>\n';
        xml.should.equal(str);
        done();
      });
    });
  });

  describe('tests against getParamXML', function () {
    describe('No param for type & data', function () {
      it('Should return false', function (done) {
        var xml = XMLRPCMessage.getParamXML();
        xml.should.equal(false);
        done();
      });
    });
    describe('Wrong param for type', function () {
      it('Should return <string>abc</string>', function (done) {
        var xml = XMLRPCMessage.getParamXML('abc');
        xml.should.equal('<string>abc</string>');
        done();
      });
    });
    describe('Correct params "abc" & "string"', function () {
      it('Should return <string>abc</string>', function (done) {
        var xml = XMLRPCMessage.getParamXML('abc', 'string');
        xml.should.equal('<string>abc</string>');
        done();
      });
    });
    describe('Correct params false & "boolean"', function () {
      it('Should return <boolean>0</boolean>', function (done) {
        var xml = XMLRPCMessage.getParamXML(false, 'boolean');
        xml.should.equal('<boolean>0</boolean>');
        done();
      });
    });
    describe('Correct params 4 & "int"', function () {
      it('Should return <int>4</int>', function (done) {
        var xml = XMLRPCMessage.getParamXML(4, 'int');
        xml.should.equal('<int>4</int>');
        done();
      });
    });
    describe('Correct params 4.5 & "double"', function () {
      it('Should return <double>4</double>', function (done) {
        var xml = XMLRPCMessage.getParamXML(4.5, 'double');
        xml.should.equal('<double>4.5</double>');
        done();
      });
    });
    describe('Correct params Date & "date"', function () {
      it('Should return <dateTime.iso8601>1000101T00:00:00</dateTime.iso8601>', function (done) {
        var y2k = new Date(2000, 1, 1, 0, 0, 0, 0),
        xml = XMLRPCMessage.getParamXML(y2k, 'date');
        xml.should.equal('<dateTime.iso8601>1000101T00:00:00</dateTime.iso8601>');
        done();
      });
    });
    describe('Correct params ["chicken", "duck", "goose"] & "array"', function () {
      it('Should return the correct XML', function (done) {
        var a = ['chicken', 'duck', 'goose'],
        xml = XMLRPCMessage.getParamXML(a, 'array'),
        str = '<array><data>\n';
        str += '<value><string>chicken</string></value>\n';
        str += '<value><string>duck</string></value>\n';
        str += '<value><string>goose</string></value>\n';
        str += '</data></array>\n';
        xml.should.equal(str);
        done();
      });
    });
    describe('Correct params {x: 20, y: "cow", z: 3.14}  & "struct"', function () {
      it('Should return the correct XML', function (done) {
        var obj = {},
        xml = null,
        str = '<struct>\n';
        obj.x = 20;
        obj.y = 'cow';
        obj.z = 3.14;
        xml = XMLRPCMessage.getParamXML(obj, 'struct');
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
        xml.should.equal(str);
        done();
      });
    });
  });

  describe('tests against dateToISO8601', function () {
    describe('No param for date', function () {
      it('Should return false', function (done) {
        var date = XMLRPCMessage.dateToISO8601();
        date.should.equal(false);
        done();
      });
    });
    describe('Wrong param (not object) for date', function () {
      it('Should return false', function (done) {
        var date = XMLRPCMessage.dateToISO8601('abc');
        date.should.equal(false);
        done();
      });
    });
    describe('Wrong param (object, but not instance of Date) for date', function () {
      it('Should return false', function (done) {
        var date = XMLRPCMessage.dateToISO8601({a: 'b'});
        date.should.equal(false);
        done();
      });
    });
    describe('Correct param for date', function () {
      it('Should return "1000101T00:00:00"', function (done) {
        var y2k = new Date(2000, 1, 1, 0, 0, 0, 0),
        date = XMLRPCMessage.dateToISO8601(y2k);
        '1000101T00:00:00'.should.equal(date);
        done();
      });
    });
  });

  describe('tests against leadingZero', function () {
    describe('No param for n', function () {
      it('Should return false', function (done) {
        var n = XMLRPCMessage.leadingZero();
        n.should.equal(false);
        done();
      });
    });
    describe('Wrong param for n', function () {
      it('Should return false', function (done) {
        var n = XMLRPCMessage.leadingZero({});
        n.should.equal(false);
        done();
      });
    });
    describe('Correct param "5" for n', function () {
      it('Should return "05"', function (done) {
        var n = XMLRPCMessage.leadingZero('05');
        '05'.should.equal(n);
        done();
      });
    });
    describe('Correct param "10" for n', function () {
      it('Should return "10"', function (done) {
        var n = XMLRPCMessage.leadingZero('10');
        '10'.should.equal(n);
        done();
      });
    });
  });

  describe('tests against btoa', function () {
    describe('No param for data', function () {
      it('Should return false', function (done) {
        var data = XMLRPCMessage.btoa();
        data.should.equal(false);
        done();
      });
    });
    describe('Correct param "Hello world" for data', function () {
      it('Should return "SGVsbG8gd29ybGQ="', function (done) {
        var data = XMLRPCMessage.btoa('Hello world');
        'SGVsbG8gd29ybGQ='.should.equal(data.a);
        done();
      });
    });
  });

  if (typeof exports !== 'object') {
    mocha.run();
  }
}));
