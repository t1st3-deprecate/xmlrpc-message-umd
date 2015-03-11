'use strict';

var pkg = require('./package.json'),

fs = require('fs'),
path = require('path'),
exec = require('child_process').exec,

_ = require('lodash'),
chalk = require('chalk'),
del = require('del'),
somebody = require('somebody'),
pkgAuthor = somebody.parse(pkg.author),

figletShown = 0,
figlet = require('figlet'),
cowsay = require('cowsay'),
qr = require('qr-image'),

gulp = require('gulp'),
bump = require('gulp-bump'),
header = require('gulp-header'),
rename = require('gulp-rename'),
replace = require('gulp-replace'),
template = require('gulp-template'),
gzip = require('gulp-gzip'),
imagemin = require('gulp-imagemin'),
jsdoc = require('gulp-jsdoc'),
jeditor = require('gulp-json-editor'),

bower = require('gulp-bower'),
mainBowerFiles = require('main-bower-files'),
notify = require('gulp-notify'),

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
 * BUMP TASKS
 */

gulp.task('patch', ['figlet'], function (cb) {
  gulp.src(['./package.json', './bower.json'])
    .pipe(bump({
      type: 'patch',
      key: 'version'
    }))
    .pipe(gulp.dest('./'));
  triggerNotification ('Builder', 'Successfully bumped application', function () {
    displayCowsay('gulp build - DONE', cb);
  });
});

gulp.task('minor', ['figlet'], function (cb) {
  gulp.src(['./package.json', './bower.json'])
    .pipe(bump({
      type: 'minor',
      key: 'version'
    }))
    .pipe(gulp.dest('./'));
  triggerNotification ('Builder', 'Successfully bumped application', function () {
    displayCowsay('gulp build - DONE', cb);
  });
});

gulp.task('major', ['figlet'], function (cb) {
  gulp.src(['./package.json', './bower.json'])
    .pipe(bump({
      type: 'major',
      key: 'version'
    }))
    .pipe(gulp.dest('./'));
  triggerNotification ('Builder', 'Successfully bumped application', function () {
    displayCowsay('gulp build - DONE', cb);
  });
});

gulp.task('bumpdate_src', ['figlet'], function (cb) {
  gulp.src('./.yo-rc.json')
  .pipe(jeditor(function (json) {
    json['generator-t1st3-umd'].ProjectVersion = require('./package.json').version;
    return json;
  }))
  .pipe(gulp.dest('.'));
  gulp.src(['./src/**/*.js'])
    .pipe(replace(/(version [0-9]+.[0-9]+.[0-9]+)/g, 'version ' + require('./package.json').version))
    .pipe(gulp.dest('./src'));
  gulp.src(['./dist/**/*.js'])
    .pipe(replace(/(version [0-9]+.[0-9]+.[0-9]+)/g, 'version ' + require('./package.json').version))
    .pipe(gulp.dest('./dist'));
  gulp.src(['./test/tests.js'])
    .pipe(replace(/(version [0-9]+.[0-9]+.[0-9]+)/g, 'version ' + require('./package.json').version))
    .pipe(gulp.dest('./test'));
  del([
    './test/app/lib/' + pkg.name + '/dist/' + pkg.name + '.js'
  ], function() {
    gulp.src('./src/*.js')
      .pipe(gulp.dest('./test/app/lib/' + pkg.name + '/dist'));
    cb();
  });
});

gulp.task('bumpdate', ['bumpdate_src'], function (cb) {
  triggerNotification ('Builder', 'Successfully bumped application', function () {
    displayCowsay('gulp build - DONE', cb);
  });
});

/*
 * DOC TASKS
 */

gulp.task('doc_clean', ['bower'], function (cb) {
  del([
    './gh-pages/_layouts/*',
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
    './tmp', './tmp2'
  ], cb);
});

gulp.task('qr', ['doc_clean'], function (cb) {
  var qrPng = qr.image(pkg.homepage, { type: 'png' }),
  stream = './bower_components/t1st3-assets/dist/img/qr.png';
  qrPng.pipe(fs.createWriteStream(stream));
  cb();
});

gulp.task('doc_copy', ['qr'], function (cb) {
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
    .pipe(gulp.dest('./gh-pages/app/lib'));

  gulp.src([
    './src/*.js'
  ])
    .pipe(gulp.dest('./gh-pages/app/lib/' + pkg.name + '/dist'));

  gulp.src([
    './test/tests.js'
  ])
    .pipe(gulp.dest('./gh-pages'));

  gulp.src([
    './bower_components/t1st3-docs-umd/src/sitemap.xml',
    './bower_components/t1st3-docs-umd/src/opensearch.xml'
  ])
    .pipe(gulp.dest('./gh-pages'));

  gulp.src([
    './bower_components/t1st3-docs-umd/src/_includes/bottom-menu.html',
    './bower_components/t1st3-docs-umd/src/_includes/head.html',
    './bower_components/t1st3-docs-umd/src/_includes/header.html',
    './bower_components/t1st3-docs-umd/src/_includes/footer.html'
  ])
    .pipe(gulp.dest('./gh-pages/_includes'));

  gulp.src([
    './bower_components/t1st3-docs-umd/src/_layouts/*',
    './bower_components/t1st3-docs-umd/src/_layouts/demo.html'
  ])
    .pipe(gulp.dest('./gh-pages/_layouts'));

  gulp.src([
    './bower_components/t1st3-assets/dist/css/t1st3.min.css',
    './bower_components/t1st3-assets/dist/css/404.min.css',
    './bower_components/t1st3-assets/dist/css/ie-noscript.min.css'
  ])
    .pipe(gulp.dest('./gh-pages/assets/css'));

  gulp.src([
    './bower_components/t1st3-assets/dist/img/**/*.png',
    './bower_components/t1st3-assets/dist/img/**/*.gif',
    './bower_components/t1st3-assets/dist/img/**/*.jpg',
    './bower_components/t1st3-assets/dist/img/**/*.jpeg'
  ])
    .pipe(imagemin())
    .pipe(gulp.dest('./gh-pages/assets/img'));

  gulp.src([
    './bower_components/vendor-icons/dist/16x16/**/*.png'
  ])
    .pipe(imagemin())
    .pipe(gulp.dest('./gh-pages/assets/img/vendor'));

  gulp.src([
    './bower_components/t1st3-assets/dist/img/**/*.ico',
    './bower_components/t1st3-assets/dist/img/**/*.svg'
  ])
    .pipe(gulp.dest('./gh-pages/assets/img'));

  gulp.src([
    './bower_components/t1st3-assets/dist/img/favicon/apple*.png'
  ])
    .pipe(imagemin())
    .pipe(gulp.dest('./gh-pages'));

  gulp.src([
    './bower_components/t1st3-assets/dist/img/favicon/*.ico'
  ])
    .pipe(gulp.dest('./gh-pages/'));

  cb();
});

gulp.task('doc_template', ['doc_copy'], function (cb) {
  _.each([
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
  ], function (num) {
    gulp.src('./bower_components/t1st3-docs-umd/src/' + num)
    .pipe(template({
      ProjectName: pkg.name,
      ProjectVersion: pkg.version
    }))
    .pipe(gulp.dest('./gh-pages'));
  });
  cb();
});

gulp.task('doc_template_umd', ['doc_template'], function (cb) {
  _.each([
    'tests.html',
    'tests_global.html',
    'credits.html',
    'gulp_tasks.html',
    '_config.yml'
  ], function (num) {
    gulp.src('./bower_components/t1st3-docs-umd/src/' + num)
    .pipe(template({
      ProjectName: pkg.name,
      ProjectVersion: pkg.version
    }))
    .pipe(gulp.dest('./gh-pages'));
  });
  gulp.src('./bower_components/t1st3-docs-umd/src/_layouts/tests_global.html')
    .pipe(template({
      ProjectName: pkg.name,
      ProjectVersion: pkg.version,
      ProjectGlobalDeps: require('./.yo-rc.json')['generator-t1st3-umd'].ProjectGlobalDeps
    }))
    .pipe(gulp.dest('./gh-pages/_layouts'));
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

gulp.task('coverage_instrument', ['doc_copy'], function (cb) {
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
