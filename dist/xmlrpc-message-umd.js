/*!
* xmlrpc-message-umd
*
* @link https://github.com/t1st3/xmlrpc-message-umd
* @author t1st3
* @version 1.1.0
* @license https://github.com/t1st3/xmlrpc-message-umd/blob/master/LICENSE.md
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

(function (root, factory) {
  /* istanbul ignore next */
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
    root.XMLRPCMessage = factory();
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
  XMLRPCMessage.prototype.addParameter = function (data, type) {
    // Check data
    if (arguments.length === 0) {
      // keep chainability
      return this;
    }
    this.params[this.params.length] = {
      data: data,
      type: type
    };
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
    var xml = '',
    i = 0,
    obj = {},
    data = null;
    xml += '<?xml version=\'1.0\'?>\n';
    xml += '<methodCall>\n';
    xml += '<methodName>' + this.method + '</methodName>\n';
    xml += '<params>\n';
    for (i = 0; i < this.params.length; i++) {
      obj = this.params[i];
      data = obj.data;
      xml += '<param>\n';
      xml += '<value>';
      if (obj.type) {
        xml += XMLRPCMessage.getParamXML(data, XMLRPCMessage.dataTypeOf(data, obj.type));
      } else {
        xml += XMLRPCMessage.getParamXML(data, XMLRPCMessage.dataTypeOf(data));
      }
      xml += '</value>\n';
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
  * @param {string} forceType
  * @since 0.1.0
  */
  XMLRPCMessage.dataTypeOf = function (o, forceType) {
    if (forceType) {
      return forceType;
    }
    // false if no o
    if (!o && o !== false) {
      return false;
    }
    var type = typeof(o),
    con = null;
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
        con = o.constructor;
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
    return '<boolean>' + value + '</boolean>';
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
  * XMLize base64 data
  * @method doBase64XML
  * @memberof XMLRPCMessage
  * @param {Object} data
  * @since 0.1.0
  */
  XMLRPCMessage.doBase64XML = function (data) {
    // empty if no data
    if (!data) {
      return '';
    }
    var xml = '<base64>';
    xml += data;
    xml += '</base64>';
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
    var xml = '<array><data>\n',
    i = 0;
    for (i = 0; i < data.length; i++) {
      xml += '<value>';
      if (typeof data[i] === 'object' && data[i].type && data[i].val) {
        xml += XMLRPCMessage.getParamXML(data[i].val, data[i].type);
      } else {
        xml += XMLRPCMessage.getParamXML(data[i], XMLRPCMessage.dataTypeOf(data[i]));
      }
      xml += '</value>\n';
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
    var xml = '<struct>\n',
    i = 0;
    for (i in data) {
      xml += '<member>\n';
      xml += '<name>' + i + '</name>\n';
      xml += '<value>';
      if (typeof data[i] === 'object' && data[i].type && data[i].val) {
        xml += XMLRPCMessage.getParamXML(data[i].val, data[i].type);
      } else {
        xml += XMLRPCMessage.getParamXML(data[i], XMLRPCMessage.dataTypeOf(data[i]));
      }
      xml += '</value>\n';
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
      case 'base64':
        xml = XMLRPCMessage.doBase64XML(data);
        break;
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
    var year = date.getYear().toString(),
    month = XMLRPCMessage.leadingZero(date.getMonth().toString()),
    day = XMLRPCMessage.leadingZero(date.getDate().toString()),
    time = XMLRPCMessage.leadingZero(date.getHours().toString()),
    converted = '';
    time += ':' + XMLRPCMessage.leadingZero(date.getMinutes().toString());
    time += ':' + XMLRPCMessage.leadingZero(date.getSeconds().toString());
    converted = year + month + day + 'T' + time;
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
