xmlrpc-message-umd
==================


[![NPM version](https://badge.fury.io/js/xmlrpc-message-umd.svg)](http://badge.fury.io/js/xmlrpc-message-umd)
[![Dependency Status](https://david-dm.org/t1st3/xmlrpc-message-umd.svg?theme=shields.io)](https://david-dm.org/t1st3/xmlrpc-message-umd)
[![Build Status](https://travis-ci.org/T1st3/xmlrpc-message-umd.png?branch=master)](https://travis-ci.org/T1st3/xmlrpc-message-umd)



About
---
You'll find all about this project on its **[project pages](http://t1st3.github.io/xmlrpc-message-umd/)**



Installation for production
---
Installing depends on the context:

**Node.js**

`xmlrpc-message-umd` is available on [NPM](https://www.npmjs.org/package/xmlrpc-message-umd)
[![NPM](http://t1st3.github.io/xmlrpc-message-umd/assets/img/vendor/npm-16x16.png)](https://www.npmjs.org/package/xmlrpc-message-umd).
You can install it with the following command:

    npm install xmlrpc-message-umd


**Browser globals and AMD**


`xmlrpc-message-umd` is available on [Bower](http://bower.io/)
[![Bower](http://t1st3.github.io/xmlrpc-message-umd/assets/img/vendor/bower-16x16.png)](https://bower.io/). 
To install it from Bower, just run 

    bower install xmlrpc-message-umd

Published versions on both NPM and Bower should stay in sync:
[![NPM version](https://badge.fury.io/js/xmlrpc-message-umd.svg)](http://badge.fury.io/js/xmlrpc-message-umd)
[![NPM version](https://badge.fury.io/bo/xmlrpc-message-umd.svg)](http://badge.fury.io/js/xmlrpc-message-umd)



Installation for development
---
You also can download the whole project (and build it from its source; see below).

Either use `git clone` command to get it:

    git clone https://github.com/T1st3/xmlrpc-message-umd.git

Or download the latest version of [the whole project](https://github.com/T1st3/xmlrpc-message-umd/archive/master.zip).




Documentation
---
You can find fully functional examples, tests and documentation in the [JSDoc](http://usejsdoc.org/) format in the `docs` folder.

You can also browse these examples and tests online:

- [Demo (AMD)](http://t1st3.github.io/xmlrpc-message-umd/)
- [Tests (AMD)](http://t1st3.github.io/xmlrpc-message-umd/amd_tests.html)
- [this README](http://t1st3.github.io/xmlrpc-message-umd/readme.html)
- [JSDoc](http://t1st3.github.io/xmlrpc-message-umd/jsdoc/index.html)



Build from source
---
First, see "Installation for development" above.
Then, you need [Grunt](http://gruntjs.com/) to build the project.

The source is located in the "src" folder; the built target is located in the "dist" folder.

To build, just run:

    grunt build

To test, you can use Grunt:

    grunt test

or you can use the npm command directly

    npm tests


**Serve and livereload**

You can also use the `serve` task to load the `docs/` pages in your browser.

    grunt serve

Once it has loaded the page in the browser, this task watches for any modification in the source.
If changes happen in the source, the task automatically reloads the page in the browser (livereload).



Build the docs
---
The files contained in `docs/` are generated with another Grunt task:

    grunt doc

Please note that this task has a few more dependencies:

* [Ruby](https://www.ruby-lang.org/)
* [Jekyll](http://jekyllrb.com/)

And finally, you also need the Ruby Gem named kramdown:

    gem install kramdown



Credits
---
Status of dependencies:

[![Dependency Status](https://david-dm.org/t1st3/xmlrpc-message-umd.svg?theme=shields.io)](https://david-dm.org/t1st3/xmlrpc-message-umd)
[![devDependency Status](https://david-dm.org/t1st3/xmlrpc-message-umd/dev-status.svg?theme=shields.io)](https://david-dm.org/t1st3/xmlrpc-message-umd#info=devDependencies)


Beside the dependencies, this project also uses the following for its tests and examples:

* jQuery [Website](http://jquery.com/) / [MIT License](https://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt)
* Bootstrap [Website](http://getbootstrap.com/) / [MIT License](https://github.com/twbs/bootstrap/blob/master/LICENSE-MIT)
* Modernizr [Website](http://modernizr.com/) / [MIT License](http://modernizr.com/license/)
* Font-Awesome [Website](http://fontawesome.io/) / [Sil OFL 1.1 + MIT License](http://fontawesome.io/license/)
* HTML5Boilerplate [Website](http://html5boilerplate.com/) / [MIT License](https://github.com/h5bp/html5-boilerplate/blob/master/LICENSE.md)
* Require.js [Website](http://requirejs.org/) / [new BSD or MIT License](https://github.com/jrburke/requirejs/blob/master/LICENSE)
* Mocha [Website](http://visionmedia.github.io/mocha/) / [MIT License](https://github.com/visionmedia/mocha/blob/master/LICENSE)
* Chai [Website](http://chaijs.com/) / [MIT License](https://github.com/chaijs/chai)
* Chai-jQuery [Website](https://github.com/chaijs/chai-jquery) / [MIT License](https://github.com/chaijs/chai-jquery/blob/master/LICENSE)
* CodeMirror [Website](http://codemirror.net/) / [MIT License](https://github.com/marijnh/CodeMirror/blob/master/LICENSE)


This project is [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/).





License
---
This piece of code is triple-licensed: [MIT / BSD / GPL licenses](https://github.com/T1st3/xmlrpc-message-umd/blob/master/LICENSE.md)

You can also view it in a re-formatted fashion: [MIT / BSD / GPL licenses](http://t1st3.github.io/xmlrpc-message-umd/license.html).



Author
---
[T1st3](https://github.com/T1st3/)
[![T1st3](http://t1st3.github.io/xmlrpc-message-umd/assets/img/gravatar-16x16.png)](https://github.com/T1st3/)