'use strict';

require.config({
  baseUrl: '',
  paths: {
    jquery: 'assets/lib/jquery/dist/jquery.min',
    mocha: 'assets/lib/mocha/mocha',
    chai: 'assets/lib/chai/chai',
    chaijquery: 'assets/lib/chai-jquery/chai-jquery',
    bootstrap: 'assets/lib/bootstrap/dist/js/bootstrap.min',
    lodash: 'assets/lib/lodash/dist/lodash.min',
    btoa: 'assets/lib/btoa-umd/dist/btoa-umd.min',
    xmlrpcmessage: 'assets/lib/xmlrpc-message-umd'
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
  'assets/js/lib/codemirror',
  'assets/js/lib/codemirror/javascript',
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
