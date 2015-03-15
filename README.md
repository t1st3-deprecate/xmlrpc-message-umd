xmlrpc-message-umd
==================


[![NPM version](https://img.shields.io/npm/v/xmlrpc-message-umd.svg)](https://www.npmjs.com/package/xmlrpc-message-umd)
[![Dependency Status](https://img.shields.io/david/T1st3/xmlrpc-message-umd.svg)](https://david-dm.org/t1st3/xmlrpc-message-umd)
[![Build Status](https://img.shields.io/travis/T1st3/xmlrpc-message-umd.svg)](https://travis-ci.org/T1st3/xmlrpc-message-umd)
[![Coverage Status](https://img.shields.io/coveralls/T1st3/xmlrpc-message-umd.svg)](https://coveralls.io/r/T1st3/xmlrpc-message-umd)
[![Code Climate](https://img.shields.io/codeclimate/github/T1st3/xmlrpc-message-umd.svg)](https://codeclimate.com/github/T1st3/xmlrpc-message-umd)



About
---

`xmlrpc-message-umd` is a Javascript XMLRPC message builder. 

This module only provides a message builder; it does not make any request by itself.
Basically, it is just a small set of utils that create a correct “ready-to-be-sent” XMLRPC string.

You'll find all about this project on its **[project pages](http://www.tiste.org/xmlrpc-message-umd/)**


Installation for production
---

**with Node.js**

`xmlrpc-message-umd` is available on [NPM](https://www.npmjs.com/package/xmlrpc-message-umd)
[![NPM](http://www.tiste.org/xmlrpc-message-umd/assets/img/vendor/npm.png)](https://www.npmjs.com/package/xmlrpc-message-umd).

[![NPM version](https://img.shields.io/npm/v/xmlrpc-message-umd.svg)](https://www.npmjs.com/package/xmlrpc-message-umd)

You can install it with the following command:

    npm install xmlrpc-message-umd


**Browser globals and AMD**


`xmlrpc-message-umd` is available on [Bower](http://bower.io/search/?q=xmlrpc-message-umd)
[![Bower](http://www.tiste.org/xmlrpc-message-umd/assets/img/vendor/bower.png)](http://bower.io/search/?q=xmlrpc-message-umd).

[![Bower version](https://img.shields.io/bower/v/xmlrpc-message-umd.svg)](http://bower.io/search/?q=xmlrpc-message-umd)

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

- [Demo](http://www.tiste.org/xmlrpc-message-umd/demo.html)
- [this README and more info](http://www.tiste.org/xmlrpc-message-umd)
- [JSDoc](http://www.tiste.org/xmlrpc-message-umd/jsdoc.html)
- [Credits](http://www.tiste.org/xmlrpc-message-umd/credits.html)
- [Tests](http://www.tiste.org/xmlrpc-message-umd/tests.html)
- [Coverage](http://www.tiste.org/xmlrpc-message-umd/coverage.html)
- [Dependencies](http://www.tiste.org/xmlrpc-message-umd/dependencies.html)




Build from source
---


First, see "Installation for development" above. 
Do not forget to get the dependencies!

Then, you also need to install [Gulp](http://gulpjs.com/) globally to build the project.

    npm install -g gulp

See more at the ["Getting started with Gulp" page](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md#getting-started).

Once you got the dependencies and installed Gulp globally, to get info about the package from the command line, just run:

    gulp info


---

You are now ready to build!

The source is located in the "src" folder; the built target is located in the "dist" folder.

To build, just run:

    gulp build

---

**Tests**

Note that you need a few more dependencies to test the project.

See [the tests page for more info](http://www.tiste.org/xmlrpc-message-umd/tests.html)

To test, you can use either the `npm test` command or the `gulp test` command:

    npm test

or

    gulp test


---

**Serve and livereload**

You can also use the `serve` task to load the `test/` HTML pages in your browser.

    gulp serve

Once it has loaded the page in the browser, this task watches for any modification in the source.
If changes happen in the source, the task automatically reloads the page in the browser (livereload).




Build the docs and Github pages
---

Please note that this task has a few more dependencies:

* [Istanbul](http://gotwarlost.github.io/istanbul/)
* [Ruby](https://www.ruby-lang.org/) and [RubyGems](https://rubygems.org/)
* [Jekyll](http://jekyllrb.com/)
* [Kramdown](http://kramdown.gettalong.org/)


Check [the build-docs page](http://www.tiste.org/xmlrpc-message-umd/build_docs.html) for more info.




Credits
---


See [the credits page](http://www.tiste.org/xmlrpc-message-umd/credits.html) to see more.


License
---


This piece of code is triple-licensed: [MIT / BSD / GPL licenses](https://github.com/T1st3/xmlrpc-message-umd/blob/master/LICENSE)

You can also view it in a re-formatted fashion: [MIT / BSD / GPL licenses](http://www.tiste.org/xmlrpc-message-umd/license.html).



Initial author
---

[T1st3](https://github.com/T1st3/) 
[![T1st3](http://www.tiste.org/xmlrpc-message-umd/assets/img/gravatar-16x16.png)](https://github.com/T1st3/)

