'use strict';

var pkg = require('./package.json'),

fs = require('fs'),
path = require('path'),
exec = require('child_process').exec,

ip = require('ip'),
chalk = require('chalk'),
del = require('del'),
somebody = require('somebody'),
pkgAuthor = somebody.parse(pkg.author),

figletShown = 0,
figlet = require('figlet'),
cowsay = require('cowsay'),
qrcode = require('qrcode-terminal'),

gulp = require('gulp'),
rename = require('gulp-rename'),
uglify = require('gulp-uglify'),
sourcemaps = require('gulp-sourcemaps'),
jshint = require('gulp-jshint'),
jscs = require('gulp-jscs'),

bower = require('gulp-bower'),
mainBowerFiles = require('main-bower-files'),
notify = require('gulp-notify'),

browserSync = require('browser-sync');

fs.mkdirParent = function (dirPath, mode, callback) {
  fs.mkdir(dirPath, mode, function (error) {
    if (error && error.errno === 34) {
      fs.mkdirParent(path.dirname(dirPath), mode, callback);
      fs.mkdirParent(dirPath, mode, callback);
    }
    //callback && callback(error);
  });
};

function displayCowsay (txt, cb) {
  console.log('\n\n');
  console.log(chalk.magenta(cowsay.say({
    text: pkg.name + ' - ' + txt,
    e: 'oO',
    T: 'U '
  })));
  console.log('\n\n');
  cb();
}

function triggerNotification (title, txt, cb) {
  gulp.src('./')
    .pipe(notify({
      title: pkg.name + ' - ' + title,
      message: txt
    }));
  cb();
}

gulp.task('figlet', [], function (cb) {
  if (figletShown === 0) {
    figlet.text(pkg.name, {
      font: 'Small',
      horizontalLayout: 'default',
      verticalLayout: 'default'
    }, function(err, data) {
      if (err) {
        console.log('Something went wrong with FIGlet');
        console.dir(err);
        return;
      }
      console.log('\n\n');
      console.log(chalk.green(data));
      console.log(chalk.blue(pkg.version));
      console.log('\n\n');
      figletShown = 1;
      cb();
    });
  }
});

gulp.task('bower', ['figlet'], function () {
  return bower()
    .pipe(gulp.dest('./bower_components'));
});

/*
 * INIT TASKS
 */

gulp.task('init_clean', ['bower'], function (cb) {
  del([
    './tmp',
    './test/app/lib'
  ], cb);
});

gulp.task('init', ['init_clean'], function (cb) {
  gulp.src(mainBowerFiles({
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

  triggerNotification ('Init', 'Successfully initiated the project.', function () {
    displayCowsay('gulp init - DONE', cb);
  });
});

/*
 * TEST TASKS
 */

gulp.task('test_copy', ['figlet'], function (cb) {
  del([
    './test/app/lib/' + pkg.name + '/dist/' + pkg.name + '.js'
  ], function() {
    gulp.src('./src/*.js')
      .pipe(gulp.dest('./test/app/lib/' + pkg.name + '/dist'));
    cb();
  });
});

gulp.task('test_node', ['figlet'], function (cb) {
  var cmd = './node_modules/mocha/bin/_mocha test/tests.js --reporter spec';
  exec(cmd, function (err, stdout, stderr) {
    console.log('\n\n');
    console.log(chalk.green('Node.js tests'));
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('test_browser_amd', ['test_copy'], function (cb) {
  var cmd = './node_modules/mocha-phantomjs/bin/mocha-phantomjs';
  cmd += ' ./test/tests_amd.html --reporter spec';
  exec(cmd, function (err, stdout, stderr) {
    console.log('\n\n');
    console.log(chalk.green('Browser tests, using AMD modules'));
    console.log(chalk.cyan('(executed in PhantomJS)'));
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('test_browser_global', ['test_copy'], function (cb) {
  var cmd = './node_modules/mocha-phantomjs/bin/mocha-phantomjs';
  cmd += ' test/tests_global.html --reporter spec';
  exec(cmd, function (err, stdout, stderr) {
    console.log('\n\n');
    console.log(chalk.green('Browser tests, using global variables'));
    console.log(chalk.cyan('(executed in PhantomJS)'));
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('test', [
  'test_node', 'test_browser_amd', 'test_browser_global'
], function (cb) {
  triggerNotification ('Test Runner', 'All tests OK', function () {
    displayCowsay('gulp test - DONE', cb);
  });
});

/*
 * BUILD TASKS
 */

gulp.task('build_clean', ['figlet', 'test'], function (cb) {
  del(['./dist/*'], cb);
});

gulp.task('lint', ['build_clean'], function (cb) {
  gulp.src(['src/**/*.js', 'test/tests.js', 'gulpfile.js', 'gulpdoc.js'])
    .pipe(jshint('./.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
  cb();
});

gulp.task('jscs', ['lint'], function (cb) {
  gulp.src(['src/**/*.js', 'test/tests.js', 'gulpfile.js', 'gulpdoc.js'])
    .pipe(jscs('./.jscs.json'));
  cb();
});

gulp.task('build_copy', ['jscs'], function (cb) {
  gulp.src('./src/**/*')
    .pipe(gulp.dest('./dist'));
  del([
    './test/app/lib/' + pkg.name + '/dist/' + pkg.name + '.js'
  ], function() {
    gulp.src('./src/*.js')
      .pipe(gulp.dest('./test/app/lib/' + pkg.name + '/dist'));
    cb();
  });
});

gulp.task('uglify', ['build_copy'], function (cb) {
  gulp.src('./src/' + pkg.name + '.js')
    .pipe(rename(pkg.name + '.min.js'))
    .pipe(uglify({
      mangle: false,
      preserveComments: 'some'
    }))
    .pipe(gulp.dest('./dist'));
  gulp.src('./src/' + pkg.name + '.js')
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'));
  cb();
});

gulp.task('build', ['uglify'], function (cb) {
  triggerNotification ('Builder', 'Successfully built application', function () {
    displayCowsay('gulp build - DONE', cb);
  });
});

/*
 * SERVE TASKS
 */

gulp.task('serve_lib', [], function (cb) {
  gulp.src([
    './src/' + pkg.name + '.js'
  ])
    .pipe(gulp.dest('./test/app/lib/' + pkg.name + '/dist'));
  cb();
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

gulp.task('serve', ['figlet', 'serve_lib', 'browser-sync'], function (cb) {
  triggerNotification ('App server', 'Successfully served application', function () {
    console.log('\n\n');
    console.log(ip.address() + ':3000');
    console.log('\n');
    qrcode.generate(ip.address() + ':3000');
    gulp.watch(['./src/**/*.js', 'test/tests.js'], ['serve_lib', browserSync.reload]);
    displayCowsay('Server started on ' + ip.address() + ':3000 - DONE', cb);
  });
});

/*
 * CI TASKS
 */

gulp.task('coverage_instrument', ['build'], function (cb) {
  var cmd = 'istanbul instrument ./src/' + pkg.name + '.js';
  cmd += ' > ./test/app/lib/' + pkg.name + '/dist/' + pkg.name + '.js';
  exec(cmd, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    del([
      'tmp', 'tmp2'
    ], function () {
      fs.mkdirParent('./tmp/');
      cb();
    });
  });
});

gulp.task('coverage_browser_global', ['coverage_instrument'], function (cb) {
  var cmd = './node_modules/mocha-phantomjs/bin/mocha-phantomjs ./test/tests_global.html';
  cmd += ' -R json-cov -f ./tmp2/tmp.json';
  exec(cmd, function (err, stdout, stderr) {
    console.log(stderr);
    fs.writeFile('./tmp/coverage_global.json', stdout, function(err) {
      if (err) {
        console.log(err);
      }
      cb(err);
    });
  });
});

gulp.task('coverage_browser_amd', ['coverage_browser_global'], function (cb) {
  var cmd = './node_modules/mocha-phantomjs/bin/mocha-phantomjs ./test/tests_amd.html';
  cmd += ' -R json-cov -f ./tmp2/tmp.json';
  exec(cmd, function (err, stdout, stderr) {
    console.log(stderr);
    fs.writeFile('./tmp/coverage_amd.json', stdout, function(err) {
      if (err) {
        console.log(err);
      }
      cb(err);
    });
  });
});

gulp.task('coverage_node', ['coverage_browser_amd'], function (cb) {
  var cmd = 'istanbul cover ./node_modules/mocha/bin/_mocha test/tests.js';
  cmd += ' --dir ./tmp -- -R json-cov';
  exec(cmd, function (err, stdout, stderr) {
    stdout = null;
    console.log(stderr);
    cb(err);
  });
});

gulp.task('coverage', [
  'coverage_browser_global', 'coverage_browser_amd', 'coverage_node'
], function (cb) {
  var cmd = 'istanbul report --dir ./gh-pages/coverage/';
  cmd += ' --root ./tmp/ --config ./.istanbul.yml lcov';
  exec(cmd, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    del([
      './tmp', './tmp2'
    ], cb);
  });
});

gulp.task('uninstrument', ['coverage'], function (cb) {
  del([
    './test/app/lib/' + pkg.name + '/dist/' + pkg.name + '.js'
  ], function() {
    gulp.src('./src/*.js')
      .pipe(gulp.dest('./test/app/lib/' + pkg.name + '/dist'));
    cb();
  });
});

gulp.task('ci', ['uninstrument'], function (cb) {
  var cmd = 'printf ./gh-pages/coverage/lcov.info';
  cmd += ' | ./node_modules/coveralls/bin/coveralls.js';
  exec(cmd, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cmd = './node_modules/codeclimate-test-reporter/bin/codeclimate.js < ';
    cmd += './gh-pages/coverage/lcov.info';
    exec(cmd, function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      del([
        './tmp', './tmp2'
      ], cb);
    });
  });
});

/*
 * INFO TASK
 */

gulp.task('info', ['figlet'], function (cb) {
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
  console.log('\n');
  txt = '[' + chalk.green('DOWNLOAD LATEST') + '] ';
  txt += 'https://github.com/' + pkgAuthor.name + '/' + pkg.name + '/archive/master.zip';
  console.log(txt);
  txt = '[' + chalk.green('ALL VERSION TAGS') + '] ';
  txt += 'https://github.com/' + pkgAuthor.name + '/' + pkg.name + '/tags';
  console.log(txt);
  txt = '[' + chalk.green('RSS/ATOM FOR VERSION TAGS') + '] ';
  txt += 'https://github.com/' + pkgAuthor.name + '/' + pkg.name + '/tags.atom';
  console.log(txt);
  console.log('\n');
  txt = '[' + chalk.green('DEPENDENCIES') + '] ';
  txt += pkg.homepage + '/dependencies.html';
  console.log(txt);
  txt = '[' + chalk.green('COMMONJS DEPENDENCIES') + '] ';
  txt += pkg.homepage + '/cjs_dependencies.html';
  console.log(txt);
  txt = '[' + chalk.green('AMD DEPENDENCIES') + '] ';
  txt += pkg.homepage + '/amd_dependencies.html';
  console.log(txt);
  txt = '[' + chalk.green('DAVID-DM URL') + '] ';
  txt += 'https://david-dm.org/' + pkgAuthor.name + '/' + pkg.name;
  console.log(txt);
  console.log('\n');
  console.log('[' + chalk.green('TESTS') + '] ' + pkg.homepage + '/tests.html');
  txt = '[' + chalk.green('TRAVIS-CI URL') + '] ';
  txt += 'https://travis-ci.org/' + pkgAuthor.name + '/' + pkg.name;
  console.log(txt);
  txt = '[' + chalk.green('TESTS (AMD)') + '] ';
  txt += pkg.homepage + '/tests_amd.html';
  console.log(txt);
  txt = '[' + chalk.green('TESTS (GLOBAL)') + '] ';
  txt += pkg.homepage + '/tests_global.html';
  console.log(txt);
  txt = '[' + chalk.green('CODE COVERAGE') + '] ';
  txt += pkg.homepage + '/coverage.html';
  console.log(txt);
  txt = '[' + chalk.green('COVERALLS URL') + '] ';
  txt += 'https://coveralls.io/r/' + pkgAuthor.name;
  txt += '/' + pkg.name + '?branch=master';
  console.log(txt);
  console.log('\n');
  console.log('[' + chalk.green('DEMO') + '] ' + pkg.homepage + '/demo.html');
  console.log('[' + chalk.green('JSDOC') + '] ' + pkg.homepage + '/jsdoc.html');
  console.log('[' + chalk.green('BUILD THE DOC') + '] ' + pkg.homepage + '/build_docs.html');
  console.log('[' + chalk.green('CREDITS') + '] ' + pkg.homepage + '/credits.html');
  txt = '[' + chalk.green('LICENSE') + '] ';
  txt += 'https://github.com/' + pkgAuthor.name + '/' + pkg.name + '/blob/master/LICENSE';
  console.log(txt);
  console.log('[' + chalk.green('SITEMAP') + '] ' + pkg.homepage + '/sitemap.html');
  console.log('\n\n');
  qrcode.generate(pkg.homepage);
  console.log('\n\n');
  triggerNotification ('Info', 'Rendered the info...', function () {
    displayCowsay('gulp info - DONE', cb);
  });
});

gulp.task('default', ['info', 'build']);
