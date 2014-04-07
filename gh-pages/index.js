'use strict';

require.config({
  baseUrl: '',
  paths: {
    jquery: 'lib/jquery',
    bootstrap: 'lib/bootstrap.min'
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
  'bootstrap'
], function () {
  
});
