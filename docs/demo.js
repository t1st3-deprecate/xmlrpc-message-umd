'use strict';

require.config({
  baseUrl: '',
  paths: {
    jquery: 'app/lib/jquery/dist/jquery.min',
    mocha: 'app/lib/mocha/mocha',
    chai: 'app/lib/chai/chai',
    chaijquery: 'app/lib/chai-jquery/chai-jquery',
    bootstrap: 'app/lib/bootstrap/dist/js/bootstrap.min',
    lodash: 'app/lib/lodash/dist/lodash.min',
    btoa: 'app/lib/btoa-umd/dist/btoa-umd.min',
    xmlrpcmessage: 'app/lib/xmlrpc-message-umd/dist/xmlrpc-message-umd'
  },
  shim: {
    jquery: {
      exports: '$'
    },
    lodash: {
      exports: '_'
    },
    chaijquery: ['jquery', 'chai'],
    bootstrap: ['jquery'],
    btoa: {
      exports: 'Btoa'
    },
    xmlrpcmessage: {
      deps: ['btoa'],
      exports: 'XMLRPCMessage'
    }
  },
  scriptType: 'text/javascript'
});

require([
  'jquery',
  'xmlrpcmessage',
  'app/lib/codemirror/lib/codemirror',
  'app/lib/codemirror/mode/javascript/javascript',
  'bootstrap'
], function ($, XMLRPCMessage, CodeMirror) {
  $(document).ready(function () {
    $('#in').on('click', function () {
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
    $('#reset').on('click', function () {
      $('#result').val('');
    });
    
    $('pre.js > code.js').each(function () {
      var self = $(this).parent();
      self.find('code.js').hide(),
      CodeMirror(self[0], {
        value: self.find('code.js').html(),
        mode: 'javascript',
        tabSize: 2,
        lineNumbers: true,
        readOnly: true
      });
    });
  });
});
