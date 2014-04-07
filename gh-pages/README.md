---
layout: readme
title: xmlrpc-message-umd
---

{{ page.title }}
==================


[![NPM version](https://badge.fury.io/js/{{ page.title }}.png)](http://badge.fury.io/js/{{ page.title }})
[![Dependency Status](https://david-dm.org/t1st3/{{ page.title }}.png?theme=shields.io)](https://david-dm.org/t1st3/{{ page.title }})
[![Build Status](https://travis-ci.org/T1st3/{{ page.title }}.png?branch=master)](https://travis-ci.org/T1st3/{{ page.title }})



About
-----------

**[Project home](http://t1st3.github.io/{{ page.title }}/)**

`{{ page.title }}` is a Javascript XMLRPC message builder. 
This module only provides a message builder; it does not make any request by itself.
Basically, it is just a small set of utils that create a correct "ready-to-be-sent" XMLRPC string.


This module is written using the [UMD definition](https://github.com/umdjs/umd) of modules.
It enforces the `returnExports.js` pattern, which "defines a module that works in Node, AMD and browser globals".

So you can use this module in the following contexts:

  - Node.js
  - Browser globals
  - AMD (with Require.js or any other AMD loader)





Installation
-----------

Installing depends on the context:

**Node.js**

`{{ page.title }}` is available on NPM.
You can install it with the following command:

```
npm install {{ page.title }}
```

**Browser globals and AMD**


`{{ page.title }}` is available on [Bower](http://bower.io/). To install it from Bower, just run 

```
bower install {{ page.title }}
```


You also can download the whole project (and build it from its source; see below).

Once downloaded and unzipped, you should initiate the project with the following commands (recommended):

```
cd /path/to/{{ page.title }}
grunt init
```



Usage
-----------

Once the module is added to your project, .........


You can find fully functional examples and tests in the `docs` folder.



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
[![devDependency Status](https://david-dm.org/t1st3/{{ page.title }}/dev-status.svg?theme=shields.io)](https://david-dm.org/t1st3/{{ page.title }}#info=devDependencies)



Documentation
-----------

You can find the documentation in the [JSDoc](http://usejsdoc.org/) format in the `docs/jsdoc` folder.

[Project home](http://t1st3.github.io/{{ page.title }}/) contains some more info (tests, demo, ...).


Credits
-----------




License
-----------

This piece of code is triple-licensed: [MIT / BSD / GPL licenses](https://github.com/T1st3/{{ page.title }}/blob/master/LICENSE.md)


