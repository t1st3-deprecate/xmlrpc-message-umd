'use strict';

var pkg = require('./package.json'),

fs = require('fs'),
path = require('path'),
exec = require('child_process').exec,

_ = require('lodash'),
ip = require('ip'),
chalk = require('chalk'),
del = require('del'),
somebody = require('somebody'),
pkgAuthor = somebody.parse(pkg.author),

figletShown = 0,
figlet = require('figlet'),
cowsay = require('cowsay'),
qr = require('qr-image'),
qrcode = require('qrcode-terminal'),

gulp = require('gulp'),
header = require('gulp-header'),
rename = require('gulp-rename'),
replace = require('gulp-replace'),
template = require('gulp-template'),
gzip = require('gulp-gzip'),
imagemin = require('gulp-imagemin'),
uglify = require('gulp-uglify'),
sourcemaps = require('gulp-sourcemaps'),
jshint = require('gulp-jshint'),
jscs = require('gulp-jscs'),
jsdoc = require('gulp-jsdoc'),

bower = require('gulp-bower'),
mainBowerFiles = require('main-bower-files'),
notify = require('gulp-notify'),

browserSync = require('browser-sync'),
dependo = require('dependo');

fs.mkdirParent = function (dirPath, mode, callback) {
  fs.mkdir(dirPath, mode, function (error) {
    if (error && error.errno === 34) {
      fs.mkdirParent(path.dirname(dirPath), mode, callback);
      fs.mkdirParent(dirPath, mode, callback);
    }
    //callback && callback(error);
  });
};

function getDateTime() {
  var date = new Date(),
  hour = date.getHours(),
  min  = date.getMinutes(),
  sec  = date.getSeconds();
  hour = (hour < 10 ? '0' : '') + hour;
  min = (min < 10 ? '0' : '') + min;
  sec = (sec < 10 ? '0' : '') + sec;
  return hour + ':' + min + ':' + sec;
}

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
    './gh-pages/_layouts/changelog.html', './gh-pages/_layouts/demo.html',
    './gh-pages/_layouts/notfound.html', './gh-pages/_layouts/readme.html',
    './gh-pages/_layouts/t1st3.html', './gh-pages/_layouts/tests_amd.html',
    './gh-pages/_config.yml', './gh-pages/_includes/umd_*',
    './gh-pages/jsdoc/', './gh-pages/dependo/', './gh-pages/coverage/',
    './gh-pages/tests.js',
    './gh-pages/assets/', './gh-pages/*.md',
    './gh-pages/404.html',
    './gh-pages/build_docs.html',
    './gh-pages/coverage.html',
    './gh-pages/credits.html',
    './gh-pages/gulp_tasks.html',
    './gh-pages/jsdoc.html',
    './gh-pages/license.md',
    './gh-pages/dependencies.html',
    './gh-pages/cjs_dependencies.html',
    './gh-pages/amd_dependencies.html',
    './gh-pages/sitemap.html',
    './gh-pages/tests.html',
    './gh-pages/tests_amd.html',
    './gh-pages/tests_global.html',
    '!gh-pages/.git',
    './docs',
    './tmp',
    './test/assets/lib'
  ], cb);
});

gulp.task('qr', ['init_clean'], function (cb) {
  var qrPng = qr.image(pkg.homepage, { type: 'png' }),
  stream = './bower_components/t1st3-assets/dist/common/assets/img/qr.png';
  qrPng.pipe(fs.createWriteStream(stream));
  cb();
});

gulp.task('init', ['qr'], function (cb) {
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
    .pipe(gulp.dest('./test/assets/lib'))
    .pipe(gulp.dest('./gh-pages/assets/lib'));

  gulp.src([
    './bower_components/t1st3-assets/dist/common/assets/css/t1st3.min.css',
    './bower_components/t1st3-assets/dist/common/assets/css/404.min.css',
    './bower_components/t1st3-assets/dist/common/assets/css/ie-noscript.min.css'
  ])
    .pipe(gulp.dest('./gh-pages/assets/css'));

  gulp.src([
    './bower_components/t1st3-assets/dist/common/assets/img/**/*.png',
    './bower_components/t1st3-assets/dist/common/assets/img/**/*.gif',
    './bower_components/t1st3-assets/dist/common/assets/img/**/*.jpg',
    './bower_components/t1st3-assets/dist/common/assets/img/**/*.jpeg'
  ])
    .pipe(imagemin())
    .pipe(gulp.dest('./gh-pages/assets/img'));

  gulp.src([
    './bower_components/t1st3-assets/dist/common/assets/img/**/*.ico',
    './bower_components/t1st3-assets/dist/common/assets/img/**/*.svg'
  ])
    .pipe(gulp.dest('./gh-pages/assets/img'));

  gulp.src([
    './bower_components/t1st3-assets/dist/common/assets/img/favicon/apple*.png'
  ])
    .pipe(imagemin())
    .pipe(gulp.dest('./gh-pages'));

  gulp.src([
    './bower_components/t1st3-assets/dist/common/assets/img/favicon/*.ico'
  ])
    .pipe(gulp.dest('./gh-pages/'));

  gulp.src([
    './bower_components/t1st3-assets/dist/common/sitemap.xml',
    './bower_components/t1st3-assets/dist/common/opensearch.xml'
  ])
    .pipe(gulp.dest('./gh-pages'));

  gulp.src([
    './bower_components/t1st3-assets/dist/umd_docs/_includes/bottom-menu.html',
    './bower_components/t1st3-assets/dist/umd_docs/_includes/head.html',
    './bower_components/t1st3-assets/dist/umd_docs/_includes/header.html',
    './bower_components/t1st3-assets/dist/common/_includes/footer.html'
  ])
    .pipe(gulp.dest('./gh-pages/_includes'));

  gulp.src([
    './bower_components/t1st3-assets/dist/common/_layouts/*',
    './bower_components/t1st3-assets/dist/umd_docs/_layouts/demo.html'
  ])
    .pipe(gulp.dest('./gh-pages/_layouts'));

  triggerNotification ('Init', 'Successfully initiated the project.', function () {
    displayCowsay('gulp init - DONE', cb);
  });
});

/*
 * TEST TASKS
 */

gulp.task('test_copy', ['figlet'], function (cb) {
  del([
    './test/assets/lib/' + pkg.name + '/dist/' + pkg.name + '.js'
  ], function() {
    gulp.src('./src/*.js')
      .pipe(gulp.dest('./test/assets/lib/' + pkg.name + '/dist'));
    cb();
  });
});

gulp.task('test_node', ['figlet'], function (cb) {
  var cmd = './node_modules/mocha/bin/_mocha test/tests.js --reporter spec';
  exec(cmd, function (err, stdout, stderr) {
    console.log('\n\n');
    console.log(chalk.green('CORE | Node.js tests'));
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
    console.log(chalk.green('CORE | Browser tests, using AMD modules'));
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
    console.log(chalk.green('CORE | Browser tests, using global variables'));
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
  del(['./dist'], cb);
});

gulp.task('lint', ['build_clean'], function (cb) {
  gulp.src(['src/**/*.js', 'test/tests.js', 'gulpfile.js'])
    .pipe(jshint('./.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
  cb();
});

gulp.task('jscs', ['lint'], function (cb) {
  gulp.src(['src/**/*.js', 'test/tests.js', 'gulpfile.js'])
    .pipe(jscs('./.jscs.json'));
  cb();
});

gulp.task('version', ['jscs'], function (cb) {
  gulp.src(['src/**/*.js'])
    .pipe(replace(/(version [0-9]+.[0-9]+.[0-9]+)/g, 'version ' + pkg.version))
    .pipe(gulp.dest('./src'));
  gulp.src(['./bower.json'])
    .pipe(replace(/(.version.: .[0-9]+.[0-9]+.[0-9]+.)/g, '"version": "' + pkg.version + '"'))
    .pipe(gulp.dest('./'));
  cb();
});

gulp.task('build_copy', ['version'], function (cb) {
  gulp.src('./src/**/*')
    .pipe(gulp.dest('./dist'));
  cb();
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

gulp.task('serve_lib', ['figlet'], function () {
  gulp.src([
    './src/' + pkg.name + '.js'
  ])
    .pipe(gulp.dest('./test/assets/lib/' + pkg.name + '/dist'));
});

gulp.task('watch', [], function() {
  gulp.watch(['./src/**/*.js', 'test/**/*.js'], ['serve_lib']);
});

gulp.task('browser-sync', [], function() {
  browserSync({
    server: {
      baseDir: './test',
      index: 'tests_amd.html'
    },
    port: 3000
  });
});

gulp.task('serve', ['watch', 'browser-sync'], function (cb) {
  triggerNotification ('App server', 'Successfully served application', function () {
    console.log('\n\n');
    console.log(ip.address() + ':3000');
    console.log('\n');
    qrcode.generate(ip.address() + ':3000');
    displayCowsay('Server started on ' + ip.address() + ':3000 - DONE', cb);
  });
});

/*
 * DOC TASKS
 */

gulp.task('doc_copy', ['figlet', 'build'], function (cb) {
  gulp.src([
    './src/*.js'
  ])
    .pipe(gulp.dest('./gh-pages/assets/lib/' + pkg.name + '/dist'));

  gulp.src([
    './test/tests.js'
  ])
    .pipe(gulp.dest('./gh-pages'));
  cb();
});

gulp.task('doc_template', ['doc_copy'], function (cb) {
  _([
    '404.html',
    'tests_amd.html',
    'coverage.html',
    'build_docs.html',
    'jsdoc.html',
    'license.md',
    'dependencies.html',
    'cjs_dependencies.html',
    'amd_dependencies.html',
    'sitemap.html'
  ]).forEach(function (num) {
    gulp.src('./bower_components/t1st3-assets/dist/common/' + num)
    .pipe(template({
      ProjectName: pkg.name,
      ProjectVersion: pkg.version
    }))
    .pipe(gulp.dest('./gh-pages'));
  });
  cb();
});

gulp.task('doc_template_umd', ['doc_template'], function (cb) {
  _([
    'tests.html',
    'tests_global.html',
    'credits.html',
    'gulp_tasks.html',
    '_config.yml'
  ]).forEach(function (num) {
    gulp.src('./bower_components/t1st3-assets/dist/umd_docs/' + num)
    .pipe(template({
      ProjectName: pkg.name,
      ProjectVersion: pkg.version
    }))
    .pipe(gulp.dest('./gh-pages'));
  });
  cb();
});

gulp.task('banner', ['doc_template_umd'], function (cb) {
  var h = '---\nlayout: readme\ntitle: ' + pkg.name;
  h += '\nsitemap:\n  priority: 1\n  changefreq: monthly\n---\n\n';
  gulp.src('./README.md')
    .pipe(header(h))
    .pipe(rename('index.md'))
    .pipe(gulp.dest('./gh-pages'));
  cb();
});

gulp.task('jsdoc', ['doc_copy'], function (cb) {
  gulp.src('./src/' + pkg.name + '.js')
    .pipe(jsdoc('./gh-pages/jsdoc'));
  cb();
});

gulp.task('dependo_cjs', ['doc_copy'], function (cb) {
  var dep = null,
  msg = '',
  html = '';

  fs.mkdirParent('./gh-pages/dependo/');

  dep = new dependo('./src/', {
    format: 'cjs',
    exclude: '^bower_components',
    transform: function (d) {
      return d;
    }
  });
  html = dep.generateHtml();
  fs.writeFile('./gh-pages/dependo/cjs_deps.html', html, function(err) {
    if (err) {
      console.log(err);
    } else {
      msg = '[' + getDateTime() + '] ';
      msg += 'Dependo: ./gh-pages/dependo/cjs_deps.html was saved!';
      console.log(msg);
      cb();
    }
  });
});

gulp.task('dependo_amd', ['dependo_cjs'], function (cb) {
  var dep = null,
  msg = '',
  html = '';

  dep = new dependo('./src/', {
    format: 'amd',
    exclude: '^node_modules',
    transform: function (d) {
      return d;
    }
  });
  html = dep.generateHtml();
  fs.writeFile('./gh-pages/dependo/amd_deps.html', html, function (err) {
    if (err) {
      console.log(err);
      return;
    } else {
      msg = '[' + getDateTime() + '] ';
      msg += 'Dependo: ./gh-pages/dependo/amd_deps.html was saved!';
      console.log(msg);
      cb();
    }
  });
});

gulp.task('coverage_instrument', ['build'], function (cb) {
  var cmd = 'istanbul instrument ./src/' + pkg.name + '.js';
  cmd += ' > ./test/assets/lib/' + pkg.name + '/dist/' + pkg.name + '.js';
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
    './test/assets/lib/' + pkg.name + '/dist/' + pkg.name + '.js'
  ], function() {
    gulp.src('./src/*.js')
      .pipe(gulp.dest('./test/assets/lib/' + pkg.name + '/dist'));
    cb();
  });
});

gulp.task('gzip', ['doc_template_umd'], function () {
  gulp.src('./gh-pages/sitemap.xml')
    .pipe(gzip())
    .pipe(gulp.dest('./gh-pages'));
});

gulp.task('changelog', ['doc_template_umd'], function (cb) {
  console.log(pkg.repository.url);
  var cmd = 'node ./node_modules/github-changes/bin/index.js';
  cmd += ' -o ' + pkgAuthor.name + ' -r ' + pkg.name + ' -b master -f ./CHANGELOG.md -a';
  cmd += ' --order-semver --use-commit-body';
  exec(cmd, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    var h = '---\nlayout: readme\ntitle: ' + pkg.name;
    h += '\nsitemap:\n  priority: 0.7\n  changefreq: weekly\n---\n\n';
    h += '<h1>' + pkg.name + ' | Changelog</h1>\n\n';
    h += '<a href="index.html" title="Home page"><i class="fa fa-home"></i> Back to home</a>\n\n';
    gulp.src('./CHANGELOG.md')
      .pipe(header(h))
      .pipe(rename('changelog.md'))
      .pipe(gulp.dest('./gh-pages'));
    cb(err);
  });
});

gulp.task('jekyll', [
  'doc_copy', 'doc_template', 'doc_template_umd',
  'banner', 'jsdoc', 'uninstrument', 'gzip',
  'dependo_cjs', 'dependo_amd', 'changelog'
], function (cb) {
  var cmd = 'jekyll build --config ./gh-pages/_config.yml';
  cmd += ' --source ./gh-pages --destination ./docs';
  exec(cmd, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('doc', [
  'doc_copy', 'doc_template', 'doc_template_umd',
  'banner', 'jsdoc', 'uninstrument', 'gzip',
  'dependo_cjs', 'dependo_amd', 'changelog', 'jekyll'
], function (cb) {
  triggerNotification ('Doc Builder', 'Doc successfully created', function () {
    displayCowsay('gulp doc - DONE', cb);
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
        'tmp'
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
