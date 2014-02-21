xmlrpc-message-umd
==================


[![NPM version](https://badge.fury.io/js/xmlrpc-message-umd.png)](http://badge.fury.io/js/xmlrpc-message-umd)
[![Dependency Status](https://david-dm.org/t1st3/xmlrpc-message-umd.png?theme=shields.io)](https://david-dm.org/t1st3/xmlrpc-message-umd)
[![Build Status](https://travis-ci.org/T1st3/xmlrpc-message-umd.png?branch=master)](https://travis-ci.org/T1st3/xmlrpc-message-umd)



About
-----------

`xmlrpc-message-umd` is a Javascript XMLRPC message builder. 
This module only provides a message builder; it does not make any request by itself.
Basically, it is just a small set of utils that create a correct "ready-to-be-sent" XMLRPC string.


This module is written using the [UMD definition](https://github.com/umdjs/umd) of modules.
It enforces the `returnExports.js` pattern, which "defines a module that works in Node, AMD and browser globals".

So you can use this module in the following contexts:

  - Node.js
  - Browser globals
  - AMD (with Require.js or any other AMD loader)


You can get more info on Addy Osmani's fantastic post about these definitions:
http://addyosmani.com/writing-modular-js/


Installation
-----------

Installing depends on the context:

**Node.js**

`xmlrpc-message-umd` is available on NPM.
You can install it with the following command:

```
npm install xmlrpc-message-umd
```

**Browser globals and AMD**


`xmlrpc-message-umd` is available on [Bower](http://bower.io/). To install it from Bower, just run 

```
bower install xmlrpc-message-umd
```


You also can download the whole project (and build it from its source; see below).

Once downloaded and unzipped, the project can be initiated with the following commands:

```
cd /path/to/xmlrpc-message-umd
grunt init
```



Usage
-----------

Once the module is added to your project, you can buid an XMLRPC-formatted message like this:

```
		var a = ["chicken","duck","goose"];
		var obj = new Object();
		obj.x = 20;
		obj.y = "cow";
		obj.z = 3.14;
		var date = new Date();
		var msg = new XMLRPCMessage("system.myMethod");
		msg.setMethod("system.myMethod");
		msg.addParameter("mississippi");
		msg.addParameter(7);
		msg.addParameter(false);
		msg.addParameter(a);
		msg.addParameter(obj);
		msg.addParameter(date);
		msg.xml();
```

in order to get the following message:

```
		<?xml version="1.0"?>
		<methodCall>
		<methodName>system.myMethod</methodName>
		<params>
		<param>
		<value><string>mississippi</string></value>
		</param>
		<param>
		<value><i4>7</i4></value>
		</param>
		<param>
		<value><boolean>0</boolean></value>
		</param>
		<param>
		<value><array><data>
		<value><string>chicken</string></value>
		<value><string>duck</string></value>
		<value><string>goose</string></value>
		</data></array>
		</value>
		</param>
		<param>
		<value><struct>
		<member>
		<name>x</name>
		<value><i4>20</i4></value>
		</member>
		<member>
		<name>y</name>
		<value><string>cow</string></value>
		</member>
		<member>
		<name>z</name>
		<value><double>3.14</double></value>
		</member>
		</struct>
		</value>
		</param>
		<param>
		<value><dateTime.iso8601>1131129T02:57:13</dateTime.iso8601></value>
		</param>
		</params>
		</methodCall>
```

You can find a fully functional example in the `demo` folder.



Build from source
-----------

You can build from the source using Grunt. The source is located in the "src" folder; the built target is located in the "dist" folder.

To build, just run the Grunt task using:

```
grunt build
```

You can also launch the `grunt serve` task to load the `demo/amd` folder in your browser and benefit from livereload of the page in the browser once you edit one of your source file or one of the example files:

```
grunt serve
```

[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
[![devDependency Status](https://david-dm.org/t1st3/xmlrpc-message-umd/dev-status.svg?theme=shields.io)](https://david-dm.org/t1st3/xmlrpc-message-umd#info=devDependencies)



Documentation
-----------

You can find the documentation in the [JSDoc](http://usejsdoc.org/) format in the `doc/jsdoc` folder.



Credits
-----------

* XML-RPC JavaScript Message Builder by Scott Andrew [Website](http://www.scottandrew.com/xml-rpc/)


License
-----------

This piece of code is triple-licensed: MIT/BSD/GPL

[MIT license](https://github.com/T1st3/xmlrpc-message-umd/blob/master/LICENSE-MIT).
[BSD license](https://github.com/T1st3/xmlrpc-message-umd/blob/master/LICENSE-BSD).
[GPL license](https://github.com/T1st3/xmlrpc-message-umd/blob/master/LICENSE-GPL).


