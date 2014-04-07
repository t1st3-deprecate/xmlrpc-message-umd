---
layout: readme
title: xmlrpc-message-umd
---

xmlrpc-message-umd
==================


[![NPM version](https://badge.fury.io/js/xmlrpc-message-umd.png)](http://badge.fury.io/js/xmlrpc-message-umd)
[![Dependency Status](https://david-dm.org/t1st3/xmlrpc-message-umd.png?theme=shields.io)](https://david-dm.org/t1st3/xmlrpc-message-umd)
[![Build Status](https://travis-ci.org/T1st3/xmlrpc-message-umd.png?branch=master)](https://travis-ci.org/T1st3/xmlrpc-message-umd)



About
-----------

**[Project home](http://t1st3.github.io/xmlrpc-message-umd/)**

`xmlrpc-message-umd` is a Javascript XMLRPC message builder. 
This module only provides a message builder; it does not make any request by itself.
Basically, it is just a small set of utils that create a correct "ready-to-be-sent" XMLRPC string.


This module is written using the [UMD definition](https://github.com/umdjs/umd) of modules.
It enforces the `returnExports.js` pattern, which "defines a module that works in Node, AMD and browser globals".

So you can use this module in the following contexts:

  - Node.js
  - Browser globals
  - AMD (with Require.js or any other AMD loader)





Installation for production
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


Installation for development
-----------


You also can download the whole project (and build it from its source; see below).

Either use `git clone` command to get it:

```
git clone https://github.com/T1st3/xmlrpc-message-umd.git
```

Or download the [whole master branch](https://github.com/T1st3/xmlrpc-message-umd/archive/master.zip) of the project.

Once downloaded and unzipped or obtained via git clone, the project can be initiated with the following commands:

```
cd /path/to/xmlrpc-message-umd
grunt init
```



Usage
-----------

Once the module is added to your project, you can build an XMLRPC-formatted message like this:

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



Documentation
-----------

You can find fully functional examples, tests and documentation in the [JSDoc](http://usejsdoc.org/) format in the `docs` folder.

You can also browse these examples and tests online:

- [Demo (AMD)](http://t1st3.github.io/xmlrpc-message-umd/)
- [Tests (AMD)](http://t1st3.github.io/xmlrpc-message-umd/amd_tests.html)
- [this README](http://t1st3.github.io/xmlrpc-message-umd/README.html)
- [JSDoc](http://t1st3.github.io/xmlrpc-message-umd/jsdoc/index.html)



Build from source
-----------

You can build from the source using Grunt. The source is located in the "src" folder; the built target is located in the "dist" folder.

To build, just run the Grunt task using:

```
grunt build
```

You can also launch the `grunt serve` task to load the `docs/` pages in your browser and benefit from livereload of the page in the browser once you edit one of your source file or one of the example files:

```
grunt serve
```

[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
[![devDependency Status](https://david-dm.org/t1st3/xmlrpc-message-umd/dev-status.svg?theme=shields.io)](https://david-dm.org/t1st3/xmlrpc-message-umd#info=devDependencies)




Credits
-----------

Beside all [dependencies](https://david-dm.org/t1st3/xmlrpc-message-umd) 
and [dev dependencies](https://david-dm.org/t1st3/xmlrpc-message-umd#info=devDependencies) shown on David-DM,
this project also uses the following for its tests and examples:

* jQuery [Website](http://jquery.com/) | [MIT License](https://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt)
* Bootstrap [Website](http://getbootstrap.com/) | [MIT License](https://github.com/twbs/bootstrap/blob/master/LICENSE-MIT)
* Modernizr [Website](http://modernizr.com/) | [MIT License](http://modernizr.com/license/)
* Font-Awesome [Website](http://fontawesome.io/) | [Sil OFL 1.1 + MIT License](http://fontawesome.io/license/)
* HTML5Boilerplate [Website](http://html5boilerplate.com/) | [MIT License](https://github.com/h5bp/html5-boilerplate/blob/master/LICENSE.md)
* Require.js [Website](http://requirejs.org/) | [new BSD or MIT License](https://github.com/jrburke/requirejs/blob/master/LICENSE)
* Mocha [Website](http://visionmedia.github.io/mocha/) | [MIT License](https://github.com/visionmedia/mocha/blob/master/LICENSE)
* Chai [Website](http://chaijs.com/) | [MIT License](https://github.com/chaijs/chai)
* Chai-jQuery [Website](https://github.com/chaijs/chai-jquery) | [MIT License](https://github.com/chaijs/chai-jquery/blob/master/LICENSE)



License
-----------

This piece of code is triple-licensed: [MIT / BSD / GPL licenses](https://github.com/T1st3/xmlrpc-message-umd/blob/master/LICENSE.md)

You can also view it in a re-formatted fashion: [MIT / BSD / GPL licenses](http://t1st3.github.io/xmlrpc-message-umd/LICENSE.html).
