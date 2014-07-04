'use strict';

var pkg = require('./package.json');

var _ = require('lodash');
var gulp = require('gulp');

//var plugins = require('gulp-load-plugins')();
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');
var notify = require('gulp-notify');
var bower = require('gulp-bower');
var template = require('gulp-template');
var replace = require('gulp-replace');
var exec = require('child_process').exec;
var jsdoc = require('gulp-jsdoc');
var header = require('gulp-header');
var gzip = require('gulp-gzip');
var browserSync = require('browser-sync');
var qr = require('qr-image');
var qrcode = require('qrcode-terminal');
var imagemin = require('gulp-imagemin');
var dependo = require('dependo');
var figlet = require('figlet');
var cowsay = require('cowsay');
var ip = require('ip');

/*
 * TEST TASKS
 */

gulp.task('test_figlet', function (cb) {
  figlet.text('gulp test', {
    font: 'Ogre',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  }, function(err, data) {
    if (err) {
      console.log('Something went wrong with FIGlet');
      console.dir(err);
      return;
    }
    console.log('\n\n');
    console.log(data);
    console.log('\n\n');
    cb();
  });
});

gulp.task('test', ['test_figlet'], function (cb) {
  exec('./node_modules/mocha/bin/_mocha test/*tests.js --reporter spec', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    console.log(cowsay.say({
      text : 'gulp test - DONE',
      e : 'oO',
      T : 'U '
    }));
    console.log('\n\n');
    cb(err);
    gulp.src('./')
      .pipe(notify({
        title: 'Test Runner',
        message: 'Successfully tested application'
      }));
  });
});

/*
 * BUILD TASKS
 */

gulp.task('build_figlet', ['test'], function (cb) {
  figlet.text('gulp build', {
    font: 'Ogre',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  }, function(err, data) {
    if (err) {
      console.log('Something went wrong with FIGlet');
      console.dir(err);
      return;
    }
    console.log('\n\n');
    console.log(data);
    console.log('\n\n');
    cb();
  });
});

gulp.task('build_clean', ['build_figlet'], function (cb) {
  del(['dist'], cb);
});

gulp.task('lint', ['build_figlet'], function () {
  gulp.src(['src/**/*.js', 'test/unittests.js', 'test/functests.js', 'gulpfile.js'])
    .pipe(jshint('./.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('jscs', ['lint', 'build_figlet'], function () {
  gulp.src(['src/**/*.js', 'test/unittests.js', 'test/functests.js', 'gulpfile.js'])
    .pipe(jscs('./.jscs.json'));
});

gulp.task('version', ['build_figlet'], function () {
  gulp.src(['src/**/*.js'])
    .pipe(replace(/(version [0-9]+.[0-9]+.[0-9]+)/g, 'version ' + pkg.version))
    .pipe(gulp.dest('./src'));
  
  gulp.src(['./bower.json'])
    .pipe(replace(/(.version.: .[0-9]+.[0-9]+.[0-9]+.)/g, '"version": "' + pkg.version + '"'))
    .pipe(gulp.dest('./'));
});

gulp.task('build_copy', ['build_figlet', 'build_clean', 'lint', 'jscs', 'version'], function () {
  gulp.src('./src/' + pkg.name + '.js')
    .pipe(gulp.dest('dist'));
});

gulp.task('uglify', ['build_figlet', 'build_clean', 'lint', 'jscs'], function () {
  gulp.src('./src/' + pkg.name + '.js')
    .pipe(rename(pkg.name + '.min.js'))
    .pipe(uglify({
      mangle: false,
      preserveComments: 'some'
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['build_figlet', 'build_copy', 'uglify'], function () {
  console.log('\n\n');
  console.log(cowsay.say({
    text : 'gulp build - DONE',
    e : 'oO',
    T : 'U '
  }));
  console.log('\n\n');
  gulp.src('./')
    .pipe(notify({
      title: 'Task Builder',
      message: 'Successfully built application'
    }));
});

/*
 * SERVE TASKS
 */

gulp.task('serve_figlet', function (cb) {
  figlet.text('gulp serve', {
    font: 'Ogre',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  }, function(err, data) {
    if (err) {
      console.log('Something went wrong with FIGlet');
      console.dir(err);
      return;
    }
    console.log('\n\n');
    console.log(data);
    console.log('\n\n');
    cb();
  });
});

gulp.task('serve_lib', ['serve_figlet'], function () {
  gulp.src([
    'src/' + pkg.name + '.js'
  ])
    .pipe(gulp.dest('docs/assets/js/lib'));
});

gulp.task('watch', ['serve_figlet'], function() {
  gulp.watch(['./src/**/*.js', 'test/**/*.js'], ['serve_lib']);
});

gulp.task('browser-sync', ['serve_figlet'], function() {  
  browserSync.init(['docs/assets/js/lib/*.js'], {
    server: {
      baseDir: './docs'
    }
  });
});

gulp.task('serve', ['serve_figlet', 'watch', 'browser-sync'], function () {
  console.log(cowsay.say({
    text : 'Server started on ' + ip.address() + ':3000 - DONE',
    e : 'oO',
    T : 'U '
  }));
  console.log('\n\n');
  console.log(ip.address() + ':3000');
  console.log('\n');
  qrcode.generate(ip.address() + ':3000');
  console.log('\n\n');
  gulp.src('./')
    .pipe(notify({
      title: 'Serve',
      message: 'Successfully served application'
    }));
});

/*
 * DOC TASKS
 */

gulp.task('doc_figlet', ['build'], function (cb) {
  figlet.text('gulp doc', {
    font: 'Ogre',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  }, function(err, data) {
    if (err) {
      console.log('Something went wrong with FIGlet');
      console.dir(err);
      return;
    }
    console.log('\n\n');
    console.log(data);
    console.log('\n\n');
    cb();
  });
});

gulp.task('bower', ['doc_figlet'], function () {
  return bower()
    .pipe(gulp.dest('./bower_components'));
});

gulp.task('doc_clean', ['doc_figlet'], function (cb) {
  del([
    'gh-pages/_layouts', 'gh-pages/assets/', 'gh-pages/coverage/', 'gh-pages/jsdoc/', 'gh-pages/dependo/', 
    'gh-pages/_config.yml', 'gh-pages/*.md', 'gh-pages/lib', 'gh-pages/_includes/umd_*', '!gh-pages/.git', 'docs'
  ], cb);
});

gulp.task('qr', ['bower', 'doc_clean'], function () {
  var qrPng = qr.image(pkg.homepage, { type: 'png' });
  qrPng.pipe(require('fs').createWriteStream('bower_components/t1st3-assets/dist/assets/img/qr.png'));
});

gulp.task('doc_copy', ['bower', 'doc_clean', 'qr'], function () {
  
  /* JS */
  gulp.src([
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/jquery/dist/jquery.min.map',
    'bower_components/requirejs/require.js',
    'bower_components/mocha/mocha.js',
    'bower_components/chai/chai.js',
    'bower_components/chai-jquery/chai-jquery.js',
    'bower_components/modernizr/modernizr.js',
    'bower_components/bootstrap/dist/js/bootstrap.min.js',
    'bower_components/codemirror/lib/codemirror.js',
    'bower_components/jshint/dist/jshint.js',
    'src/' + pkg.name + '.js'
  ])
    .pipe(gulp.dest('gh-pages/assets/js/lib'));
    
  gulp.src([
    'bower_components/codemirror/mode/javascript/javascript.js'
  ])
    .pipe(gulp.dest('gh-pages/assets/js/lib/codemirror'));
  
  gulp.src([
    'test/unittests.js',
    'test/functests.js'
  ])
    .pipe(gulp.dest('gh-pages'));
    
  /* CSS */
  gulp.src([
    'bower_components/bootstrap/dist/css/bootstrap.min.css',
    'bower_components/mocha/mocha.css',
    'bower_components/codemirror/lib/codemirror.css',
    'bower_components/font-awesome/css/font-awesome.min.css',
    'bower_components/t1st3-assets/dist/assets/css/404.css'
  ])
    .pipe(gulp.dest('gh-pages/assets/css'));
  
  gulp.src([
    'bower_components/t1st3-assets/dist/assets/css/t1st3.css'
  ])
    .pipe(rename('t1st3.min.css'))
    .pipe(gulp.dest('gh-pages/assets/css'));
  
  /* FONTS */
  gulp.src([
    'bower_components/font-awesome/fonts/*',
    'bower_components/bootstrap/dist/fonts/*'
  ])
    .pipe(gulp.dest('gh-pages/assets/fonts'));
  
  /* IMG */
  gulp.src('bower_components/t1st3-assets/dist/assets/img/**/*.png')
    .pipe(imagemin())
    .pipe(gulp.dest('gh-pages/assets/img'));
    
  /* XML */
  gulp.src([
    'bower_components/t1st3-assets/dist/umd_sitemap.xml'
  ])
    .pipe(rename('sitemap.xml'))
    .pipe(gulp.dest('gh-pages'));
    
  /* HTML */
  gulp.src([
    'bower_components/t1st3-assets/dist/_includes/umd_bottom-menu.html',
    'bower_components/t1st3-assets/dist/_includes/umd_head.html',
    'bower_components/t1st3-assets/dist/_includes/umd_header.html',
    'bower_components/t1st3-assets/dist/_includes/umd_footer.html'
  ])
    .pipe(gulp.dest('gh-pages/_includes'));
  
  gulp.src([
    'bower_components/t1st3-assets/dist/_layouts/**/*'
  ])
    .pipe(gulp.dest('gh-pages/_layouts'));
});

gulp.task('doc_template', ['doc_copy'], function () {
  _([
    '404.html',
    'tests.html',
    'unittests_amd.html',
    'unittests_global.html',
    'functests_amd.html',
    'functests_global.html',
    'coverage.html',
    'build_docs.html',
    'credits.html',
    'jsdoc.html',
    'license.md',
    'dependencies.html',
    'cjs_dependencies.html',
    'amd_dependencies.html',
    'sitemap.html',
    '_config.yml'
  ]).forEach(function (num) {
      gulp.src('bower_components/t1st3-assets/dist/umd_' + num)
      .pipe(template({
        ProjectName: pkg.name,
        ProjectVersion: pkg.version,
        ProjectDependencies: ''
      }))
      .pipe(rename(num))
      .pipe(gulp.dest('gh-pages'));
  });
});

gulp.task('banner', ['doc_template'], function () {
  gulp.src('./README.md')
    .pipe(header('---\nlayout: umd_readme\ntitle: ' + pkg.name + '\nsitemap:\n  priority: 1\n  changefreq: monthly\n---\n\n'))
    .pipe(rename('index.md'))
    .pipe(gulp.dest('gh-pages'));
});

gulp.task('jsdoc', ['doc_copy'], function () {
  gulp.src('./src/**/*.js')
    .pipe(jsdoc('./gh-pages/jsdoc'));
});

gulp.task('dependo', ['doc_copy'], function () {
  function getDateTime() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? '0' : '') + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? '0' : '') + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? '0' : '') + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? '0' : '') + month;
    var day  = date.getDate();
    day = (day < 10 ? '0' : '') + day;
    return year + ':' + month + ':' + day + ':' + hour + ':' + min + ':' + sec;
  }
  var fs = require('fs');
  var path = require('path');
  fs.mkdirParent = function (dirPath, mode, callback) {
    fs.mkdir(dirPath, mode, function (error) {
      if (error && error.errno === 34) {
        fs.mkdirParent(path.dirname(dirPath), mode, callback);
        fs.mkdirParent(dirPath, mode, callback);
      }
      //callback && callback(error);
    });
  };
  fs.mkdirParent('./gh-pages/dependo/');
  
  var dep = new dependo('./src/', {
    format: 'cjs',
    exclude: '^node_modules|bower_components',
    transform: function(d){
      return d;
    }
  });
  var html = dep.generateHtml();
  fs.writeFile('./gh-pages/dependo/cjs_deps.html', html, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('[' + getDateTime() + '] Dependo: ./gh-pages/dependo/cjs_deps.html was saved!');
    }
  });
  
  dep = new dependo('./src/', {
    format: 'amd',
    exclude: '^node_modules|bower_components',
    transform: function(d){
      return d;
    }
  });
  html = dep.generateHtml();
  fs.writeFile('./gh-pages/dependo/amd_deps.html', html, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('[' + getDateTime() + '] Dependo: ./gh-pages/dependo/amd_deps.html was saved!');
    }
  });
});

gulp.task('coverage', ['doc_copy'], function (cb) {
  exec('istanbul cover ./node_modules/mocha/bin/_mocha test/*tests.js --report lcov --dir=gh-pages/coverage -- -R spec && cat ./gh-pages/coverage/lcov.info', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('gzip', ['doc_template'], function () {
  gulp.src('./gh-pages/sitemap.xml')
    .pipe(gzip())
    .pipe(gulp.dest('./gh-pages'));
});

gulp.task('jekyll', ['doc_clean', 'qr', 'doc_copy', 'doc_template', 'banner', 'jsdoc', 'coverage', 'gzip', 'dependo'], function (cb) {
  exec('jekyll build --config ./gh-pages/_config.yml --source ./gh-pages --destination ./docs', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('doc', ['doc_figlet', 'doc_clean', 'qr', 'doc_copy', 'doc_template', 'banner', 'jsdoc', 'coverage', 'gzip', 'dependo', 'jekyll'], function () {
  console.log('\n\n');
  console.log(cowsay.say({
    text : 'gulp doc - DONE',
    e : 'oO',
    T : 'U '
  }));
  console.log('\n\n');
  gulp.src('./')
    .pipe(notify({
      title: 'Doc Builder',
      message: 'Doc successfully created'
    }));
});

/*
 * INFO TASKS
 */

gulp.task('info_figlet', function (cb) {
  figlet.text('gulp info', {
    font: 'Ogre',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  }, function(err, data) {
    if (err) {
      console.log('Something went wrong with FIGlet');
      console.dir(err);
      return;
    }
    console.log('\n\n');
    console.log(data);
    console.log('\n\n');
    cb();
  });
});

gulp.task('info', ['info_figlet'], function () {
  console.log('\n\n');
  console.log('[NAME] ' + pkg.name);
  console.log('[DESCRIPTION] ' + pkg.description);
  console.log('[VERSION] ' + pkg.version);
  console.log('[HOMEPAGE] ' + pkg.homepage);
  console.log('[GITHUB REPOSITORY] ' + pkg.repository.url);
  console.log('[NPM URL] https://npmjs.org/package/' + pkg.name);
  console.log('[BOWER URL] http://bower.io/search/?q=' + pkg.name);
  console.log('[BUG-TRACKER] ' + pkg.bugs.url);
  console.log('\n');
  console.log('[DOWNLOAD LATEST] https://github.com/T1st3/' + pkg.name + '/archive/master.zip');
  console.log('[ALL VERSION TAGS] https://github.com/T1st3/' + pkg.name + '/tags');
  console.log('[RSS/ATOM FOR VERSION TAGS] https://github.com/T1st3/' + pkg.name + '/tags.atom');
  console.log('\n');
  console.log('[DEPENDENCIES] ' + pkg.homepage + '/dependencies.html');
  console.log('[COMMONJS DEPENDENCIES] ' + pkg.homepage + '/cjs_dependencies.html');
  console.log('[AMD DEPENDENCIES] ' + pkg.homepage + '/amd_dependencies.html');
  console.log('[DAVID-DM URL] https://david-dm.org/t1st3/' + pkg.name);
  console.log('\n');
  console.log('[TESTS] ' + pkg.homepage + '/tests.html');
  console.log('[TRAVIS-CI URL] https://travis-ci.org/T1st3/' + pkg.name);
  console.log('[UNIT TESTS (AMD)] ' + pkg.homepage + '/unittests_amd.html');
  console.log('[UNIT TESTS (GLOBAL)] ' + pkg.homepage + '/unittests_global.html');
  console.log('[FUNCTIONAL TESTS (AMD)] ' + pkg.homepage + '/functests_amd.html');
  console.log('[FUNCTIONAL TESTS (GLOBAL)] ' + pkg.homepage + '/functests_global.html');
  console.log('[CODE COVERAGE] ' + pkg.homepage + '/coverage.html');
  console.log('[COVERALLS URL] https://coveralls.io/r/T1st3/' + pkg.name + '?branch=master');
  console.log('\n');
  console.log('[DEMO] ' + pkg.homepage + '/demo.html');
  console.log('[JSDOC] ' + pkg.homepage + '/jsdoc.html');
  console.log('[BUILD THE DOC] ' + pkg.homepage + '/build_docs.html');
  console.log('[CREDITS] ' + pkg.homepage + '/credits.html');
  console.log('[LICENSE] https://github.com/T1st3/' + pkg.name + '/blob/master/LICENSE');
  console.log('[SITEMAP] ' + pkg.homepage + '/sitemap.html');
  console.log('\n\n');
  qrcode.generate(pkg.homepage);
  console.log('\n\n');
  console.log(cowsay.say({
    text : 'gulp info - DONE',
    e : 'oO',
    T : 'U '
  }));
  console.log('\n\n');
  gulp.src('./')
    .pipe(notify({
      title: 'INFO',
      message: ''
    }));
});

gulp.task('default', ['info', 'build']);
