/*
 * Main Gulpfile for xmlrpc-message-umd
 *
 * Tasks available in this file:
 * - gulp info
 * - gulp init
 * - gulp test
 * - gulp build
 * - gulp serve
 * - gulp ci
 *
 */

'use strict';

var pkg = require('./package.json'),

exec = require('child_process').exec,

ip = require('ip'),
chalk = require('chalk'),
del = require('del'),
somebody = require('somebody'),
pkgAuthor = somebody.parse(pkg.author),

qrcode = require('qrcode-terminal'),

gulp = require('gulp'),
rename = require('gulp-rename'),
replace = require('gulp-replace'),
uglify = require('gulp-uglify'),
sourcemaps = require('gulp-sourcemaps'),
jshint = require('gulp-jshint'),
jscs = require('gulp-jscs'),
mocha = require('gulp-mocha'),
mochaPhantomJS = require('gulp-mocha-phantomjs'),
istanbul = require('gulp-istanbul'),

bower = require('gulp-bower'),
mainBowerFiles = require('main-bower-files'),
bump = require('gulp-bump'),

browserSync = require('browser-sync');

gulp.task('bower', function () {
  return bower()
    .pipe(gulp.dest('./bower_components'));
});

/*
 * INIT TASKS
 */

gulp.task('init-clean', ['bower'], function () {
  return del([
    './tmp',
    './test/app/lib'
  ]);
});

gulp.task('init-files', ['init-clean'], function () {
  return gulp.src(mainBowerFiles({
    paths: {
        bowerDirectory: './bower_components',
        bowerrc: './.bowerrc',
        bowerJson: './bower.json'
    },
    includeDev: true
  }), {
    base: './bower_components'
  })
    .pipe(gulp.dest('./test/app/lib'));
});

gulp.task('init', ['init-files'], function (cb) {
  cb();
});

/*
 * TEST TASKS
 */

gulp.task('test-clean', function () {
  return del([
    './test/app/lib/' + pkg.name + '/dist/' + pkg.name + '.js'
  ]);
});

gulp.task('test-copy', ['test-clean'], function () {
  return gulp.src('./src/*.js')
    .pipe(gulp.dest('./test/app/lib/' + pkg.name + '/dist'));
});

gulp.task('test-browser-amd', ['test-copy'], function () {
  return gulp
    .src('./test/tests_amd.html')
    .pipe(mochaPhantomJS({reporter: 'spec', phantomjs: {useColors: true}}));
});

gulp.task('test-browser-global', ['test-browser-amd'], function () {
  return gulp
    .src('./test/tests_amd.html')
    .pipe(mochaPhantomJS({reporter: 'spec', phantomjs: {useColors: true}}));
});

gulp.task('test-node', ['test-browser-global'], function () {
  return gulp.src('test/tests.js', {read: false})
    .pipe(mocha({reporter: 'spec'}));
});

gulp.task('test', [
  'test-node'
], function (cb) {
  cb();
});

/*
 * BUILD TASKS
 */

gulp.task('build-clean', ['test'], function () {
  return del(['./dist/*']);
});

gulp.task('lint', ['build-clean'], function () {
  return gulp.src(['src/**/*.js', 'test/tests.js', 'gulpfile.js'])
    .pipe(jshint('./.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('jscs', ['lint'], function () {
  return gulp.src(['src/**/*.js', 'test/tests.js', 'gulpfile.js'])
    .pipe(jscs('./.jscs.json'));
});

gulp.task('build-copy', ['jscs'], function () {
  return gulp.src('./src/*.js')
    .pipe(gulp.dest('./dist'));
});

gulp.task('build-uglify', ['build-copy'], function () {
  return gulp.src('./src/' + pkg.name + '.js')
    .pipe(rename(pkg.name + '.min.js'))
    .pipe(uglify({
      mangle: false,
      preserveComments: 'some'
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build-sourcemaps', ['build-uglify'], function () {
  return gulp.src('./dist/' + pkg.name + '.min.js')
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['build-sourcemaps'], function (cb) {
  cb();
});

/*
 * SERVE TASKS
 */

gulp.task('serve-lib', [], function () {
  return gulp.src([
    './src/' + pkg.name + '.js'
  ])
    .pipe(gulp.dest('./test/app/lib/' + pkg.name + '/dist'));
});

gulp.task('browser-sync', [], function () {
  browserSync({
    server: {
      baseDir: './test',
      index: 'tests_amd.html'
    },
    watchOptions: {
      debounceDelay: 2000
    },
    reloadDelay: 1000,
    port: 3000,
    host: ip.address(),
    ui: {
      port: 3001,
      weinre: {
        port: 9090
      }
    }
  });
});

gulp.task('serve', ['serve-lib', 'browser-sync'], function () {
  console.log('\n\n');
  console.log(ip.address() + ':3000');
  console.log('\n');
  qrcode.generate(ip.address() + ':3000');
  gulp.watch(['./src/**/*.js', 'test/tests.js'], ['serve-lib', browserSync.reload]);
});

/*
 * CI TASKS
 */

gulp.task('pre-coverage', function () {
  return gulp.src(['./src/**/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('coverage', ['pre-coverage'], function () {
  return gulp.src(['test/*.js'])
    .pipe(mocha())
    .pipe(istanbul.writeReports())
    .pipe(istanbul.enforceThresholds({ thresholds: { global: 50 } }));
});

gulp.task('ci', ['coverage'], function (cb) {
  var cmd = 'printf ./coverage/lcov.info';
  cmd += ' | ./node_modules/coveralls/bin/coveralls.js';
  exec(cmd, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cmd = './node_modules/codeclimate-test-reporter/bin/codeclimate.js < ';
    cmd += './coverage/lcov.info';
    exec(cmd, function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      del([
        './coverage'
      ], cb);
    });
  });
});

/*
 * VERSION TASKS
 */

gulp.task('patch', function () {
  gulp.src(['./package.json', './bower.json'])
    .pipe(bump({
      type: 'patch',
      key: 'version'
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('minor', function () {
  gulp.src(['./package.json', './bower.json'])
    .pipe(bump({
      type: 'minor',
      key: 'version'
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('major', function () {
  gulp.src(['./package.json', './bower.json'])
    .pipe(bump({
      type: 'major',
      key: 'version'
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('version-src', function () {
  return gulp.src(['./src/**/*.js'])
    .pipe(replace(/(version [0-9]+.[0-9]+.[0-9]+)/g, 'version ' + require('./package.json').version))
    .pipe(gulp.dest('./src'));
});

gulp.task('version-test', function () {
  return gulp.src(['./test/tests.js'])
    .pipe(replace(/(version [0-9]+.[0-9]+.[0-9]+)/g, 'version ' + require('./package.json').version))
    .pipe(gulp.dest('./test'));
});

gulp.task('version', ['version-src', 'version-test'], function (cb) {
  cb();
});

/*
 * INFO TASK
 */

gulp.task('info', function (cb) {
  var txt;
  console.log('\n\n');
  console.log('[' + chalk.green('NAME') + '] ' + pkg.name);
  console.log('[' + chalk.green('DESCRIPTION') + '] ' + pkg.description);
  console.log('[' + chalk.green('VERSION') + '] ' + pkg.version);
  console.log('[' + chalk.green('HOMEPAGE') + '] ' + pkg.homepage);
  console.log('[' + chalk.green('GITHUB REPOSITORY') + '] ' + pkg.repository.url);
  console.log('[' + chalk.green('NPM URL') + '] https://npmjs.org/package/' + pkg.name);
  console.log('[' + chalk.green('BOWER URL') + '] http://bower.io/search/?q=' + pkg.name);
  console.log('[' + chalk.green('BUG TRACKER') + '] ' + pkg.bugs.url);
  txt = '[' + chalk.green('DOWNLOAD LATEST') + '] ';
  txt += 'https://github.com/' + pkgAuthor.name + '/' + pkg.name + '/archive/master.zip';
  console.log(txt);
  txt = '[' + chalk.green('ALL VERSION TAGS') + '] ';
  txt += 'https://github.com/' + pkgAuthor.name + '/' + pkg.name + '/tags';
  console.log(txt);
  txt = '[' + chalk.green('RSS/ATOM FOR VERSION TAGS') + '] ';
  txt += 'https://github.com/' + pkgAuthor.name + '/' + pkg.name + '/tags.atom';
  console.log(txt);
  txt = '[' + chalk.green('DAVID-DM URL') + '] ';
  txt += 'https://david-dm.org/' + pkgAuthor.name + '/' + pkg.name;
  console.log(txt);
  txt = '[' + chalk.green('TRAVIS-CI URL') + '] ';
  txt += 'https://travis-ci.org/' + pkgAuthor.name + '/' + pkg.name;
  console.log(txt);
  txt = '[' + chalk.green('COVERALLS URL') + '] ';
  txt += 'https://coveralls.io/r/' + pkgAuthor.name;
  txt += '/' + pkg.name + '?branch=master';
  console.log(txt);
  txt = '[' + chalk.green('LICENSE') + '] ';
  txt += 'https://github.com/' + pkgAuthor.name + '/' + pkg.name + '/blob/master/LICENSE';
  console.log(txt);
  console.log('\n\n');
  qrcode.generate(pkg.homepage);
  console.log('\n\n');
  cb();
});

gulp.task('default', ['info', 'build']);
