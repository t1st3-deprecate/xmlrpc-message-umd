'use strict';

var LIVERELOAD_PORT = 35729;
var SERVER_PORT = 9000;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  
  require('load-grunt-tasks')(grunt, {
    scope: 'devDependencies',
    config: 'package.json',
    pattern: ['grunt-*']
  });
  
  require('time-grunt')(grunt);
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'src/**/*.js', 'test/unittests.js', 'test/functests.js', 'Gruntfile.js'
      ]
    },
    jscs: {
      src: [
        'src/**/*.js', 'test/unittests.js', 'test/functests.js', 'Gruntfile.js'
      ],
      options: {
        config: '.jscs.json'
      }
    },
    uglify: {
      options: {
        mangle: false,
        banner: '/** <%= pkg.name %> <%= pkg.version %> \n * <%= grunt.template.today(\'yyyy-mm-dd\') %>\n */\n',
        sourceMap: true,
        sourceMapName: 'dist/xmlrpc-message-umd.min.map'
      },
      dist: {
        files: {
          'dist/xmlrpc-message-umd.min.js': ['src/xmlrpc-message-umd.js']
        }
      }
    },
    copy: {
      build: {
        files: [
          {src: ['src/xmlrpc-message-umd.js'], dest: 'dist/xmlrpc-message-umd.js'}
        ]
      },
      docs: {
        files: [
          {src: ['dist/xmlrpc-message-umd.js'], dest: 'gh-pages/assets/js/lib/xmlrpc-message-umd.js'}
        ]
      },
      init: {
        files: [
          {src: ['bower_components/btoa-umd/dist/btoa-umd.js'], dest: 'gh-pages/assets/js/lib/btoa-umd.js'},
        
          {src: ['bower_components/jquery/dist/jquery.min.js'], dest: 'gh-pages/assets/js/lib/jquery.min.js'},
          {src: ['bower_components/jquery/dist/jquery.min.map'], dest: 'gh-pages/assets/js/lib/jquery.min.map'},
          {src: ['bower_components/requirejs/require.js'], dest: 'gh-pages/require.js'},
          {src: ['bower_components/mocha/mocha.js'], dest: 'gh-pages/assets/js/lib/mocha.js'},
          {src: ['bower_components/mocha/mocha.css'], dest: 'gh-pages/assets/css/mocha.css'},
          {src: ['bower_components/chai/chai.js'], dest: 'gh-pages/assets/js/lib/chai.js'},
          {src: ['bower_components/chai-jquery/chai-jquery.js'], dest: 'gh-pages/assets/js/lib/chai-jquery.js'},
          {src: ['bower_components/modernizr/modernizr.js'], dest: 'gh-pages/assets/js/lib/modernizr.js'},
          {src: ['bower_components/bootstrap/dist/js/bootstrap.min.js'], dest: 'gh-pages/assets/js/lib/bootstrap.min.js'},
          {src: ['bower_components/bootstrap/dist/css/bootstrap.min.css'], dest: 'gh-pages/assets/css/bootstrap.min.css'},
          {expand: true, flatten: true, src: ['bower_components/bootstrap/dist/fonts/*'], dest: 'gh-pages/assets/fonts/', filter: 'isFile'},
          {src: ['bower_components/font-awesome/css/font-awesome.min.css'], dest: 'gh-pages/assets/css/font-awesome.min.css'},
          {expand: true, flatten: true, src: ['bower_components/font-awesome/fonts/*'], dest: 'gh-pages/assets/fonts/', filter: 'isFile'},
          {src: ['bower_components/codemirror/lib/codemirror.css'], dest: 'gh-pages/assets/css/codemirror.css'},
          {src: ['bower_components/codemirror/lib/codemirror.js'], dest: 'gh-pages/assets/js/lib/codemirror.js'},
          {src: ['bower_components/codemirror/mode/javascript/javascript.js'], dest: 'gh-pages/assets/js/lib/codemirror/javascript.js'},
          {src: ['bower_components/jshint/dist/jshint.js'], dest: 'gh-pages/assets/js/lib/jshint.js'},
          {src: ['node_modules/grunt-jscs-checker/node_modules/jscs/jscs-browser.js'], dest: 'gh-pages/assets/js/lib/jscs.js'},
          
          {expand: true, flatten: false, cwd: 'bower_components/t1st3-assets/dist/assets/img/', src: ['**/*'], dest: 'gh-pages/assets/img/'},
          {src: ['bower_components/t1st3-assets/dist/assets/css/t1st3.css'], dest: 'gh-pages/assets/css/t1st3.min.css'},
          {src: ['bower_components/t1st3-assets/dist/assets/css/404.css'], dest: 'gh-pages/assets/css/404.min.css'},
          {src: ['bower_components/t1st3-assets/dist/umd_sitemap.xml'], dest: 'gh-pages/sitemap.xml'},
          {expand: true, flatten: false, cwd: 'bower_components/t1st3-assets/dist/_layouts/', src: ['**/umd_*'], dest: 'gh-pages/_layouts/'},
          {src: ['bower_components/t1st3-assets/dist/_includes/umd_bottom-menu.html'], dest: 'gh-pages/_includes/umd_bottom-menu.html'},
          {src: ['bower_components/t1st3-assets/dist/_includes/umd_head.html'], dest: 'gh-pages/_includes/umd_head.html'},
          {src: ['bower_components/t1st3-assets/dist/_includes/umd_header.html'], dest: 'gh-pages/_includes/umd_header.html'},
          {src: ['bower_components/t1st3-assets/dist/_includes/umd_footer.html'], dest: 'gh-pages/_includes/umd_footer.html'},
          
          {src: ['test/unittests.js'], dest: 'gh-pages/unittests.js'},
          {src: ['test/functests.js'], dest: 'gh-pages/functests.js'},
          
          {src: ['README.md'], dest: 'gh-pages/index.md'}
        ]
      },
    },
    template: {
      init: {
        options: {
          data: {
            ProjectName: '<%= pkg.name %>',
            ProjectVersion: '<%= pkg.version %>',
            ProjectDependencies: 'btoa-umd'
          }
        },
        files: {
          'gh-pages/404.html': ['bower_components/t1st3-assets/dist/umd_404.html'],
          'gh-pages/tests.html': ['bower_components/t1st3-assets/dist/umd_tests.html'],
          'gh-pages/unittests_amd.html': ['bower_components/t1st3-assets/dist/umd_unittests_amd.html'],
          'gh-pages/unittests_global.html': ['bower_components/t1st3-assets/dist/umd_unittests_global.html'],
          'gh-pages/functests_amd.html': ['bower_components/t1st3-assets/dist/umd_functests_amd.html'],
          'gh-pages/functests_global.html': ['bower_components/t1st3-assets/dist/umd_functests_global.html'],
          'gh-pages/coverage.html': ['bower_components/t1st3-assets/dist/umd_coverage.html'],
          'gh-pages/build_docs.html': ['bower_components/t1st3-assets/dist/umd_build_docs.html'],
          'gh-pages/credits.html': ['bower_components/t1st3-assets/dist/umd_credits.html'],
          'gh-pages/jsdoc.html': ['bower_components/t1st3-assets/dist/umd_jsdoc.html'],
          'gh-pages/license.md': ['bower_components/t1st3-assets/dist/umd_license.md'],
          'gh-pages/_config.yml': ['bower_components/t1st3-assets/dist/_umd_config.yml']
        }
      }
    },
    jekyll: {
      docsamd: {
        options: {
          config: 'gh-pages/_config.yml',
          src: 'gh-pages/',
          dest: 'docs/'
        }
      }
    },
    clean: {
      ghpages: [
        'gh-pages/_layouts', 'gh-pages/assets/', 'gh-pages/_config.yml', 'gh-pages/*.md', 'gh-pages/lib', 'gh-pages/_includes/umd_*', '!gh-pages/.git'
      ],
      docs: ['docs']
    },
    usebanner: {
      readme: {
        options: {
          position: 'top',
          banner: '---\nlayout: umd_readme\ntitle: <%= pkg.name %>\nsitemap:\n  priority: 1\n  changefreq: monthly\n---',
          linebreak: true
        },
        files: {
          src: ['gh-pages/index.md' ]
        }
      }
    },
    jsdoc : {
      dist : {
        src: ['src/**/*.js'],
        options: {
          destination: 'gh-pages/jsdoc'
        }
      }
    },
    version: {
      js: {
        options: {
          prefix: '@version\\s*'
        },
        src: ['src/**/*.js']
      },
      json: {
        options: {
          prefix: '"version":\\s"*'
        },
        src: ['bower.json']
      }
    },
    watch: {
      options: {
        nospawn: true,
        livereload: true
      },
      src: {
        files: ['src/**/*.js'],
        tasks: ['copy:docs'],
        options: {
          livereload: {
            port: LIVERELOAD_PORT
          }
        }
      }
    },
    connect: {
      options: {
        port: SERVER_PORT,
        hostname: 'localhost'
      },
      livereload: {
        options: {
          base: 'docs',
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, 'docs')
            ];
          }
        }
      }
    },
    open: {
      server: {
        path: 'http://localhost:' + SERVER_PORT
      }
    },
    bower: {
      init: {
        options: {
          copy: false,
          install: true,
          verbose: true,
          cleanTargetDir: false,
          cleanBowerDir: false,
          bowerOptions: {}
        }
      }
    },
    compress: {
      sitemap: {
        options: {
          mode: 'gzip'
        },
        expand: true,
        cwd: 'docs/',
        src: ['**/*sitemap.xml'],
        dest: 'docs/'
      },
      sitemapgh: {
        options: {
          mode: 'gzip'
        },
        expand: true,
        cwd: 'docs/',
        src: ['**/*sitemap.xml'],
        dest: 'gh-pages/'
      }
    },
    shell: {
      coverage: {
        options: {
          stderr: false
        },
        command: 'istanbul cover ./node_modules/mocha/bin/_mocha test/*tests.js --report lcov --dir=gh-pages/coverage -- -R spec && cat ./gh-pages/coverage/lcov.info'
      }
    }
  });
  
  grunt.registerTask('init', [
  'bower:init',
  'clean:ghpages',
  'copy:init',
  'template:init'
  ]);
  
  grunt.registerTask('build', [
  'version:js',
  'version:json',
  'jshint',
  'jscs',
  'copy:build',
  'uglify:dist'
  ]);
  
  grunt.registerTask('serve', [
  'connect:livereload',
  'open',
  'watch:amd'
  ]);
  
  grunt.registerTask('doc', [
  'init',
  'shell:coverage',
  'build',
  'clean:docs',
  'copy:docs',
  'jsdoc:dist',
  'usebanner:readme',
  'jekyll:docsamd',
  'compress:sitemap',
  'compress:sitemapgh'
  ]);
};
