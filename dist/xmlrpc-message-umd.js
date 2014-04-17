/*!
* xmlrpc-message-umd
* 
* @link https://github.com/T1st3/xmlrpc-message-umd
* @author T1st3
* @version 0.2.3
* @license https://github.com/T1st3/xmlrpc-message-umd/blob/master/LICENSE
* 
* 
* This AMD module is based on an XMLRPC message formatter written by Scott Andrew LePera
* 
* Original work:
* Copyright 2001 Scott Andrew LePera
* scott@scottandrew.com
* http://www.scottandrew.com/xml-rpc
* 
* Original License: 
* You are granted the right to use and/or redistribute this 
* code only if this license and the copyright notice are included 
* and you accept that no warranty of any kind is made or implied 
* by the author.
*
*/

/* global define */

'use strict';

(function (window, factory) {
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
    window.XMLRPCMessage = factory();
  }
}(this, function () {
  /** 
  * An XMLRPC message builder, AMD style
  * @module XMLRPCMessage
  * @namespace XMLRPCMessage
  */
  
  /**
  * @constructor
  * @since 0.1.0
  */
  var XMLRPCMessage = function (method) {
    // set method if supplied
    if (method) {
      this.setMethod(method);
    }
    this.params = [];
    return this;
  };
  
  /**
  * set method
  * @method setMethod
  * @memberof XMLRPCMessage
  * @param {string} methodName
  * @since 0.1.0
  */
  XMLRPCMessage.prototype.setMethod = function (methodName) {
    // Check methodName 
    if (!methodName) {
      // keep chainability
      return this;
    }
    this.method = methodName;
    // keep chainability
    return this;
  };

  /**
  * add parameter
  * @method addParameter
  * @memberof XMLRPCMessage
  * @param {*} data
  * @since 0.1.0
  */
  XMLRPCMessage.prototype.addParameter = function (data) {
    // Check data
    if (arguments.length === 0) {
      // keep chainability
      return this;
    }
    this.params[this.params.length] = data;
    // keep chainability
    return this;
  };

  /**
  * render xml message
  * @method xml
  * @memberof XMLRPCMessage
  * @since 0.1.0
  */
  XMLRPCMessage.prototype.xml = function () {

    var xml = '';
    xml += '<?xml version=\'1.0\'?>\n';
    xml += '<methodCall>\n';
    xml += '<methodName>' + this.method + '</methodName>\n';
    xml += '<params>\n';

    for (var i = 0; i < this.params.length; i++) {
      var data = this.params[i];
      xml += '<param>\n';

      xml += '<value>' + XMLRPCMessage.getParamXML(data, XMLRPCMessage.dataTypeOf(data)) + '</value>\n';

      xml += '</param>\n';
    }
    
    xml += '</params>\n';
    xml += '</methodCall>';
    
    return xml;
  };

  /**
  * get type of a var
  * @method dataTypeOf
  * @memberof XMLRPCMessage
  * @param {*} o
  * @since 0.1.0
  */
  XMLRPCMessage.dataTypeOf = function (o) {
    // false if no o
    if (!o && o !== false) {
      return false;
    }
    var type = typeof(o);
    type = type.toLowerCase();
    switch (type) {
      case 'number':
        if (Math.round(o) === o) {
          type = 'int';
        } else {
          type = 'double';
        }
        break;
      case 'object':
        var con = o.constructor;
        if (con === Date) {
          type = 'date';
        } else {
          if (con === Array) {
            type = 'array';
          } else {
            type = 'struct';
          }
        }
        break;
    }
    return type;
  };

  /**
  * XMLize a string or a number
  * @method doValueXML
  * @memberof XMLRPCMessage
  * @param {*} data
  * @param {string} type
  * @since 0.1.0
  */
  XMLRPCMessage.doValueXML = function (data, type) {
    // empty if no data
    if (!data) {
      return '';
    }
    var xml = '<' + type + '>' + data + '</' + type + '>';
    return xml;
  };

  /**
  * XMLize a boolean
  * @method doBooleanXML
  * @memberof XMLRPCMessage
  * @param {boolean} data
  * @since 0.1.0
  */
  XMLRPCMessage.doBooleanXML = function (data) {
    // empty if no data
    if (!data && data !== false) {
      return '';
    }
    var value = (data === true) ? 1 : 0;
    var xml = '<boolean>' + value + '</boolean>';
    return xml;
  };

  /**
  * XMLize a date
  * @method doDateXML
  * @memberof XMLRPCMessage
  * @param {Object} data
  * @since 0.1.0
  */
  XMLRPCMessage.doDateXML = function (data) {
    // empty if no data
    if (!data) {
      return '';
    }
    var xml = '<dateTime.iso8601>';
    xml += XMLRPCMessage.dateToISO8601(data);
    xml += '</dateTime.iso8601>';
    return xml;
  };

  /**
  * XMLize an array
  * @method doArrayXML
  * @memberof XMLRPCMessage
  * @param {Orray} data
  * @since 0.1.0
  */
  XMLRPCMessage.doArrayXML = function (data) {
    // empty if no data
    if (!data) {
      return '';
    }
    var xml = '<array><data>\n';
    for (var i = 0; i < data.length; i++) {
      xml += '<value>' + XMLRPCMessage.getParamXML(data[i], XMLRPCMessage.dataTypeOf(data[i])) + '</value>\n';
    }
    xml += '</data></array>\n';
    return xml;
  };

  /**
  * Create an XML 'struct' block
  * @method doStructXML
  * @memberof XMLRPCMessage
  * @param {Object|Array} data
  * @since 0.1.0
  */
  XMLRPCMessage.doStructXML = function (data) {
    // empty if no data
    if (!data) {
      return '';
    }
    var xml = '<struct>\n';
    for (var i in data) {
      xml += '<member>\n';
      xml += '<name>' + i + '</name>\n';
      xml += '<value>' + XMLRPCMessage.getParamXML(data[i], XMLRPCMessage.dataTypeOf(data[i])) + '</value>\n';
      xml += '</member>\n';
    }
    xml += '</struct>\n';
    return xml;
  };

  /**
  * XMLize any var
  * @method getParamXML
  * @memberof XMLRPCMessage
  * @param {*} data
  * @param {string} type
  * @since 0.1.0
  */
  XMLRPCMessage.getParamXML = function (data, type) {
    if (!data && data !== false) {
      return false;
    }
    if (!type) {
      type = 'string';
    }
    var xml;
    switch (type) {
      case 'date':
        xml = XMLRPCMessage.doDateXML(data);
        break;
      case 'array':
        xml = XMLRPCMessage.doArrayXML(data);
        break;
      case 'struct':
        xml = XMLRPCMessage.doStructXML(data);
        break;
      case 'boolean':
        xml = XMLRPCMessage.doBooleanXML(data);
        break;
      default:
        xml = XMLRPCMessage.doValueXML(data, type);
        break;
    }
    return xml;
  };

  /**
  * Date to Iso8601
  * @method dateToISO8601
  * @memberof XMLRPCMessage
  * @param {Object} date
  * @since 0.1.0
  */
  XMLRPCMessage.dateToISO8601 = function (date) {
    // return false if no data
    if (!date) {
      return false;
    }
    // return false if date not an object or not instance of Date
    if (typeof(date) !== 'object' || !(date instanceof Date)) {
      return false;
    }
    var year = date.getYear().toString();
    var month = XMLRPCMessage.leadingZero(date.getMonth().toString());
    var day = XMLRPCMessage.leadingZero(date.getDate().toString());
    var time = XMLRPCMessage.leadingZero(date.getHours().toString()) + ':' + XMLRPCMessage.leadingZero(date.getMinutes().toString()) + ':' + XMLRPCMessage.leadingZero(date.getSeconds().toString());

    var converted = year + month + day + 'T' + time;
    return converted;
  };

  /**
  * Adds a leading '0' to one-char numbers
  * @method leadingZero
  * @memberof XMLRPCMessage
  * @param {number|string} n
  * @since 0.1.0
  */
  XMLRPCMessage.leadingZero = function (n) {
    if (!n) {
      return false;
    }
    if (typeof(n) !== 'number' && typeof(n) !== 'string') {
      return false;
    }
    if (n.length === 1) {
      n = '0' + n;
    }
    return n;
  };

  return XMLRPCMessage;
}));
