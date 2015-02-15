'use strict';

require.config({
  baseUrl: '',
  paths: {
    jquery: 'app/lib/jquery/dist/jquery.min',
    bootstrap: 'app/lib/bootstrap/dist/js/bootstrap.min'
  },
  shim: {
    jquery: {
      exports: '$'
    },
    bootstrap: {
      deps: [
        'jquery'
      ]
    }
  },
  scriptType: 'text/javascript'
});

require([
  'jquery',
  'app/lib/codemirror/lib/codemirror',
  'app/lib/codemirror/mode/javascript/javascript',
  'bootstrap'
], function ($, CodeMirror) {
  $(document).ready(function () {
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
