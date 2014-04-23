/*!
* btoa-umd
* 
* @link https://github.com/T1st3/btoa-umd
* @author T1st3
* @version 0.1.3
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
    if (!b) {
      // keep chainability
      return this;
    }
    this.b = b;
    
    var browser = true;
    if (typeof define === 'function' && define.amd) {
      browser = true;
    } else if (typeof exports === 'object') {
      browser = false;
    }
    
    if (browser === true) {
      /* global window */
      this.a = window.btoa(b);
    } else {
      var buffer;
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
  
  return Btoa;
}));
