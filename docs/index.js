'use strict';

require.config({
  baseUrl: '',
  paths: {
    jquery: 'lib/jquery',
    bootstrap: 'lib/bootstrap.min',
    xmlrpcmessage: 'lib/xmlrpc-message-umd'
  },
  shim: {
    jquery: {
      exports: '$'
    },
    bootstrap: {
      deps: [
        'jquery'
      ]
    },
    xmlrpcmessage: {
      exports: 'XMLRPCMessage'
    }
  },
  scriptType: 'text/javascript'
});

require([
  'jquery',
  'xmlrpcmessage',
  'bootstrap'
], function ($, XMLRPCMessage) {
  var a = ['chicken', 'duck', 'goose'];
  var obj = {};
  obj.x = 20;
  obj.y = 'cow';
  obj.z = 3.14;
  var date = new Date();
  var msg = new XMLRPCMessage();
  msg.setMethod('system.myMethod');
  msg.addParameter('mississippi');
  msg.addParameter(7);
  msg.addParameter(false);
  msg.addParameter(a);
  msg.addParameter(obj);
  msg.addParameter(date);

  $('#result').val(msg.xml());
});
