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

/*
 * BUILD TASKS
 */

gulp.task('build_clean', function (cb) {
  del(['dist'], cb);
});

gulp.task('lint', function () {
  gulp.src(['src/**/*.js', 'test/unittests.js', 'test/functests.js', 'gulpfile.js'])
    .pipe(jshint('./.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('jscs', ['lint'], function () {
  gulp.src(['src/**/*.js', 'test/unittests.js', 'test/functests.js', 'gulpfile.js'])
    .pipe(jscs('./.jscs.json'));
});

gulp.task('version', function () {
  gulp.src(['src/**/*.js'])
    .pipe(replace(/(version [0-9]+.[0-9]+.[0-9]+)/g, 'version ' + pkg.version))
    .pipe(gulp.dest('./src'));
  
  gulp.src(['./bower.json'])
    .pipe(replace(/(.version.: .[0-9]+.[0-9]+.[0-9]+.)/g, '"version": "' + pkg.version + '"'))
    .pipe(gulp.dest('./'));
});

gulp.task('build_copy', ['build_clean', 'lint', 'jscs', 'version'], function () {
  gulp.src('./src/' + pkg.name + '.js')
    .pipe(gulp.dest('dist'));
});

gulp.task('uglify', ['build_clean', 'lint', 'jscs'], function () {
  gulp.src('./src/' + pkg.name + '.js')
    .pipe(rename(pkg.name + '.min.js'))
    .pipe(uglify({
      mangle: false,
      preserveComments: 'some'
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['build_copy', 'uglify'], function () {
  gulp.src('./')
    .pipe(notify({
      title: 'Task Builder',
      message: 'Successfully built application'
    }));
});

/*
 * SERVE TASKS
 */

gulp.task('serve_lib', function () {
  gulp.src([
    'src/' + pkg.name + '.js'
  ])
    .pipe(gulp.dest('docs/assets/js/lib'));
});

gulp.task('watch', function() {
  gulp.watch(['./src/**/*.js', 'test/**/*.js'], ['serve_lib']);
});

gulp.task('browser-sync', function() {  
  browserSync.init(['docs/assets/js/lib/*.js'], {
    server: {
      baseDir: './docs'
    }
  });
});

gulp.task('serve', ['watch', 'browser-sync'], function () {
  gulp.src('./')
    .pipe(notify({
      title: 'Serve',
      message: 'Successfully served application'
    }));
});

/*
 * TEST TASKS
 */

gulp.task('test', function (cb) {
  exec('./node_modules/mocha/bin/_mocha test/*tests.js --reporter spec', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

/*
 * DOC TASKS
 */

gulp.task('bower', function () {
  return bower()
    .pipe(gulp.dest('./bower_components'));
});

gulp.task('doc_clean', function (cb) {
  del(['gh-pages/_layouts', 'gh-pages/assets/', 'gh-pages/_config.yml', 'gh-pages/*.md', 'gh-pages/lib', 'gh-pages/_includes/umd_*', '!gh-pages/.git', 'docs'], cb);
});

gulp.task('doc_copy', ['bower', 'doc_clean'], function () {
  
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
    'src/' + pkg.name + '.js',
    'bower_components/btoa-umd/dist/btoa-umd.js'
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
  gulp.src([
    'bower_components/t1st3-assets/dist/assets/img/**/*.png'
  ])
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
    '_config.yml'
  ]).forEach(function (num) {
      gulp.src('bower_components/t1st3-assets/dist/umd_' + num)
      .pipe(template({
        ProjectName: pkg.name,
        ProjectVersion: pkg.version,
        ProjectDependencies: 'btoa-umd'
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

gulp.task('jsdoc', function () {
  gulp.src('./src/**/*.js')
    .pipe(jsdoc('./gh-pages/jsdoc'));
});

gulp.task('coverage', function (cb) {
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

gulp.task('jekyll', ['doc_clean', 'doc_copy', 'doc_template', 'banner', 'jsdoc', 'coverage', 'gzip'], function (cb) {
  exec('jekyll build --config ./gh-pages/_config.yml --source ./gh-pages --destination ./docs', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('doc', ['doc_clean', 'doc_copy', 'doc_template', 'banner', 'jsdoc', 'coverage', 'gzip', 'jekyll'], function () {
  gulp.src('./')
    .pipe(notify({
      title: 'Doc Builder',
      message: 'Doc successfully created'
    }));
});

gulp.task('default', ['build', 'doc']);
