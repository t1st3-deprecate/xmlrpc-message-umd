/*
 * xmlrpc-message-umd
 * 
 * @link https://github.com/T1st3/xmlrpc-message-umd
 * @author T1st3
 * @version 0.1.2
 * @license https://github.com/T1st3/xmlrpc-message-umd/blob/master/LICENSE-MIT
 * @license https://github.com/T1st3/xmlrpc-message-umd/blob/master/LICENSE-BSD
 * @license https://github.com/T1st3/xmlrpc-message-umd/blob/master/LICENSE-GPL
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

(function (window, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define([], factory);
	} else if (typeof exports === 'object') {
		// Node
		module.exports = factory();
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
	var XMLRPCMessage = function () {
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
		if (!methodName) {
			return;
		}
		this.method = methodName;
	};

	/**
	 * add parameter
	 * @method addParameter
	 * @memberof XMLRPCMessage
	 * @param {*} data
	 * @since 0.1.0
	 */
	XMLRPCMessage.prototype.addParameter = function (data) {
		if (arguments.length === 0) {
			return;
		}
		this.params[this.params.length] = data;
	};

	/**
	 * render xml message
	 * @method xml
	 * @memberof XMLRPCMessage
	 * @since 0.1.0
	 */
	XMLRPCMessage.prototype.xml = function () {

		var method = this.method;

		var xml = '';
		xml += '<?xml version=\'1.0\'?>\n';
		xml += '<methodCall>\n';
		xml += '<methodName>' + method + '</methodName>\n';
		xml += '<params>\n';

		for (var i = 0; i < this.params.length; i++) {
			var data = this.params[i];
			xml += '<param>\n';

			xml += '<value>' + XMLRPCMessage.getParamXML(XMLRPCMessage.dataTypeOf(data), data) + '</value>\n';
			
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
		var type = typeof(o);
		type = type.toLowerCase();
		switch (type) {
			case 'number':
				if (Math.round(o) === o) {
					type = 'i4';
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
	 * @param {string} type
	 * @param {*} data
	 * @since 0.1.0
	 */
	XMLRPCMessage.doValueXML = function (type, data) {
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
		var xml = '<dateTime.iso8601>';
		xml += dateToISO8601(data);
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
		var xml = '<array><data>\n';
		for (var i = 0; i < data.length; i++) {
			xml += '<value>' + XMLRPCMessage.getParamXML(XMLRPCMessage.dataTypeOf(data[i]), data[i]) + '</value>\n';
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
		var xml = '<struct>\n';
		for (var i in data) {
			xml += '<member>\n';
			xml += '<name>' + i + '</name>\n';
			xml += '<value>' + XMLRPCMessage.getParamXML(XMLRPCMessage.dataTypeOf(data[i]), data[i]) + '</value>\n';
			xml += '</member>\n';
		}
		xml += '</struct>\n';
		return xml;
	};

	/**
	 * XMLize any var
	 * @method getParamXML
	 * @memberof XMLRPCMessage
	 * @param {string} type
	 * @param {*} data
	 * @since 0.1.0
	 */
	XMLRPCMessage.getParamXML = function (type, data) {
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
				xml = XMLRPCMessage.doValueXML(type, data);
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
	var dateToISO8601 = function (date) {
		var year = date.getYear().toString();
		var month = leadingZero(date.getMonth().toString());
		var day = leadingZero(date.getDate().toString());
		var time = leadingZero(date.getHours().toString()) + ':' + leadingZero(date.getMinutes().toString()) + ':' + leadingZero(date.getSeconds().toString());

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
	var leadingZero = function (n) {
		if (n.length === 1) {
			n = '0' + n;
		}
		return n;
	};

	return XMLRPCMessage;
}));
