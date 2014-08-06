/*!
* btoa-umd
*
* @link https://github.com/T1st3/btoa-umd
* @author T1st3
* @version 0.6.0
* @license https://github.com/T1st3/btoa-umd/blob/master/LICENSE
*
*/

/* global define */

'use strict';

(function (root, factory) {
  // Test for AMD modules
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  // Test for Node.js
  } else if (typeof exports === 'object') {
    // Node
    module.exports = factory();
  // Browser globals
  } else {
    // Browser globals
    root.Btoa = factory();
  }
}(this, function () {
  /**
  * btoa(), UMD style
  * @module Btoa
  * @namespace Btoa
  */

  /**
  * @constructor
  * @param {string} b
  * @since 0.1.0
  */
  var Btoa = function (b) {
    this.a = '';
    this.b = '';
    if (typeof define === 'function' && define.amd) {
      this.browser = true;
    } else if (typeof exports === 'object') {
      this.browser = false;
    } else {
      this.browser = true;
    }
    // set method if supplied
    if (b) {
      this.handle(b);
      return this;
    }
    // keep chainability
    return this;
  };

  /**
  * handle B to A
  * @method handle
  * @memberof Btoa
  * @param {string} b
  * @since 0.1.0
  */
  Btoa.prototype.handle = function (b) {
    // Check a
    if (!b || arguments.length === 0) {
      // keep chainability
      return this;
    }
    this.b = b;

    var buffer;

    if (this.browser === true) {
      /* global window */
      if (typeof window.btoa === 'function') {
        this.a = window.btoa(b);
      } else {
        this.a = Btoa.encode(b);
      }
    } else {
      if (b instanceof Buffer) {
        buffer = b;
      } else {
        buffer = new Buffer(b.toString(), 'binary');
      }
      this.a = buffer.toString('base64');
    }
    // keep chainability
    return this;
  };

  /**
  * encode fix for browser which don't support btoa
  * @method encode
  * @memberof Btoa
  * @param {string} b
  * @since 0.2.0
  */
  Btoa.encode = function (b) {
    if (!b || arguments.length === 0) {
      return '';
    }
    var _byte = [],
    _char = [],
    _result = [],
    j = 0, i = 0,
    CHAR_MAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    /*jshint bitwise: false*/
    for (i = 0; i < b.length; i += 3) {
      _byte[0] = b.charCodeAt(i);
      _byte[1] = b.charCodeAt(i + 1);
      _byte[2] = b.charCodeAt(i + 2);
      _char[0] = _byte[0] >> 2;
      _char[1] = ((_byte[0] & 3) << 4) | (_byte[1] >> 4);
      _char[2] = ((_byte[1] & 15) << 2) | (_byte[2] >> 6);
      _char[3] = _byte[2] & 63;
      if (isNaN(_byte[1])) {
        _char[2] = _char[3] = 64;
      } else if (isNaN(_byte[2])) {
        _char[3] = 64;
      }
      _result[j++] = CHAR_MAP.charAt(_char[0]) +
        CHAR_MAP.charAt(_char[1]) +
        CHAR_MAP.charAt(_char[2]) +
        CHAR_MAP.charAt(_char[3]);
    }
    return _result.join('');
  };

  return Btoa;
}));
