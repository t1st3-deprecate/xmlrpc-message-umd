xmlrpc-message-umd
==================


[![NPM version](https://badge.fury.io/js/xmlrpc-message-umd.svg)](http://badge.fury.io/js/xmlrpc-message-umd)
[![Dependency Status](https://david-dm.org/t1st3/xmlrpc-message-umd.svg?theme=shields.io)](https://david-dm.org/t1st3/xmlrpc-message-umd)
[![Build Status](https://travis-ci.org/T1st3/xmlrpc-message-umd.svg?branch=master)](https://travis-ci.org/T1st3/xmlrpc-message-umd)
[![Coverage Status](https://coveralls.io/repos/T1st3/xmlrpc-message-umd/badge.png)](https://coveralls.io/r/T1st3/xmlrpc-message-umd)



About
---

`xmlrpc-message-umd` is a Javascript XMLRPC message builder. 

This module only provides a message builder; it does not make any request by itself.
Basically, it is just a small set of utils that create a correct “ready-to-be-sent” XMLRPC string.

You'll find all about this project on its **[project pages](http://t1st3.github.io/xmlrpc-message-umd/)**




Installation for production
---

**with Node.js**

`xmlrpc-message-umd` is available on [NPM](https://www.npmjs.org/package/xmlrpc-message-umd)
[![NPM](http://t1st3.github.io/xmlrpc-message-umd/assets/img/vendor/npm-16x16.png)](https://www.npmjs.org/package/xmlrpc-message-umd).

[![NPM version](https://badge.fury.io/js/xmlrpc-message-umd.svg)](http://badge.fury.io/js/xmlrpc-message-umd)

You can install it with the following command:

    npm install xmlrpc-message-umd


**Browser globals and AMD**


`xmlrpc-message-umd` is available on [Bower](http://bower.io/search/?q=xmlrpc-message-umd)
[![Bower](http://t1st3.github.io/xmlrpc-message-umd/assets/img/vendor/bower-16x16.png)](http://bower.io/search/?q=xmlrpc-message-umd).

[![Bower version](https://badge.fury.io/bo/xmlrpc-message-umd.svg)](http://badge.fury.io/js/xmlrpc-message-umd)

To install it from Bower, just run 

    bower install xmlrpc-message-umd

Note that published versions on both NPM and Bower should stay in sync.



Installation for development
---


You also can download the whole project (and build it from its source; see below).

Either use `git clone` command to get it:

    git clone https://github.com/T1st3/xmlrpc-message-umd.git

Or download the latest version of [the whole project](https://github.com/T1st3/xmlrpc-message-umd/archive/master.zip).

Then, get the dependencies of the project from both Bower and NPM:

    npm install
    bower install



Documentation
---


You can find fully functional examples, tests and a documentation in the [JSDoc](http://usejsdoc.org/) format in the `docs` folder.

You can also browse these documents and tests online:

- [Demo](http://t1st3.github.io/xmlrpc-message-umd/demo.html)
- [this README and more info](http://t1st3.github.io/xmlrpc-message-umd)
- [JSDoc](http://t1st3.github.io/xmlrpc-message-umd/jsdoc.html)
- [Credits](http://t1st3.github.io/xmlrpc-message-umd/credits.html)
- [Tests](http://t1st3.github.io/xmlrpc-message-umd/tests.html)




Build from source
---


First, see "Installation for development" above. 
Do not forget to get the dependencies!

Then, you also need to install [Grunt](http://gruntjs.com/) globally to build the project.

    npm install -g grunt-cli

See more at the ["Getting started with Grunt" page](http://gruntjs.com/getting-started).


---

You are now ready to build!

The source is located in the "src" folder; the built target is located in the "dist" folder.

To build, just run:

    grunt build

To test, you can use Grunt:

    grunt test




**Serve and livereload**

You can also use the `serve` task to load the `docs` pages in your browser.

    grunt serve

Once it has loaded the page in the browser, this task watches for any modification in the source.
If changes happen in the source, the task automatically reloads the page in the browser (livereload).


This project is [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/).



Dependencies
---

Status of dependencies:

[![Dependency Status](https://david-dm.org/t1st3/xmlrpc-message-umd.svg?theme=shields.io)](https://david-dm.org/t1st3/xmlrpc-message-umd)
[![devDependency Status](https://david-dm.org/t1st3/xmlrpc-message-umd/dev-status.svg?theme=shields.io)](https://david-dm.org/t1st3/xmlrpc-message-umd#info=devDependencies)



Build the docs and Github pages
---

Please note that this task has a few more dependencies:

* [Ruby](https://www.ruby-lang.org/) and [RubyGems](https://rubygems.org/)
* [Jekyll](http://jekyllrb.com/)
* [Kramdown](http://kramdown.gettalong.org/)


Check [the build-docs page](http://t1st3.github.io/xmlrpc-message-umd/build_docs.html) for more info.




Credits
---


See [the credits page](http://t1st3.github.io/xmlrpc-message-umd/credits.html) to see more.


License
---


This piece of code is triple-licensed: [MIT / BSD / GPL licenses](https://github.com/T1st3/xmlrpc-message-umd/blob/master/LICENSE.md)

You can also view it in a re-formatted fashion: [MIT / BSD / GPL licenses](http://t1st3.github.io/xmlrpc-message-umd/license.html).



Initial author
---

[T1st3](https://github.com/T1st3/) 
[![T1st3](http://t1st3.github.io/xmlrpc-message-umd/assets/img/gravatar-16x16.png)](https://github.com/T1st3/)

