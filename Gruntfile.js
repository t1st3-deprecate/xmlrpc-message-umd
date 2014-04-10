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
        'src/**/*.js', 'gh-pages/lib/index.js', 'gh-pages/lib/amd_tests.js', 'node_test.js', 'Gruntfile.js'
      ]
    },
    jscs: {
      src: [
        'src/**/*.js', 'gh-pages/lib/index.js', 'gh-pages/lib/amd_tests.js', 'node_test.js', 'Gruntfile.js'
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
      myTarget: {
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
          {src: ['dist/xmlrpc-message-umd.js'], dest: 'gh-pages/lib/xmlrpc-message-umd.js'}
        ]
      },
      init: {
        files: [
          {src: ['bower_components/jquery/dist/jquery.js'], dest: 'gh-pages/lib/jquery.js'},
          {src: ['bower_components/lodash/dist/lodash.js'], dest: 'gh-pages/lib/lodash.js'},
          {src: ['bower_components/requirejs/require.js'], dest: 'gh-pages/require.js'},
          {src: ['bower_components/mocha/mocha.js'], dest: 'gh-pages/lib/mocha.js'},
          {src: ['bower_components/mocha/mocha.css'], dest: 'gh-pages/assets/css/mocha.css'},
          {src: ['bower_components/chai/chai.js'], dest: 'gh-pages/lib/chai.js'},
          {src: ['bower_components/chai-jquery/chai-jquery.js'], dest: 'gh-pages/lib/chai-jquery.js'},
          {src: ['bower_components/modernizr/modernizr.js'], dest: 'gh-pages/lib/modernizr.js'},
          {src: ['bower_components/bootstrap/dist/js/bootstrap.min.js'], dest: 'gh-pages/lib/bootstrap.min.js'},
          {src: ['bower_components/bootstrap/dist/css/bootstrap.min.css'], dest: 'gh-pages/assets/css/bootstrap.min.css'},
          {expand: true, flatten: true, src: ['bower_components/bootstrap/dist/fonts/*'], dest: 'gh-pages/assets/fonts/', filter: 'isFile'},
          {src: ['bower_components/font-awesome/css/font-awesome.min.css'], dest: 'gh-pages/assets/css/font-awesome.min.css'},
          {expand: true, flatten: true, src: ['bower_components/font-awesome/fonts/*'], dest: 'gh-pages/assets/fonts/', filter: 'isFile'},
          {src: ['bower_components/codemirror/lib/codemirror.css'], dest: 'gh-pages/assets/css/codemirror.css'},
          {src: ['bower_components/codemirror/lib/codemirror.js'], dest: 'gh-pages/lib/codemirror.js'},
          {src: ['bower_components/codemirror/mode/javascript/javascript.js'], dest: 'gh-pages/lib/codemirror/javascript.js'},
          
          {expand: true, flatten: false, cwd: 'bower_components/t1st3-assets/dist/assets/img/', src: ['**/*'], dest: 'gh-pages/assets/img/'},
          {src: ['bower_components/t1st3-assets/dist/assets/css/t1st3.css'], dest: 'gh-pages/assets/css/t1st3.css'},
          {src: ['bower_components/t1st3-assets/dist/assets/css/404.css'], dest: 'gh-pages/assets/css/404.css'},
          {src: ['bower_components/t1st3-assets/dist/sitemap.xml'], dest: 'gh-pages/sitemap.xml'},
          {expand: true, flatten: false, cwd: 'bower_components/t1st3-assets/dist/_layouts/', src: ['**/*'], dest: 'gh-pages/_layouts/'},
          {src: ['bower_components/t1st3-assets/dist/_includes/bottom-menu.html'], dest: 'gh-pages/_includes/bottom-menu.html'},
          {src: ['bower_components/t1st3-assets/dist/_includes/head.html'], dest: 'gh-pages/_includes/head.html'},
          {src: ['bower_components/t1st3-assets/dist/_includes/header.html'], dest: 'gh-pages/_includes/header.html'},
          {src: ['bower_components/t1st3-assets/dist/_includes/footer.html'], dest: 'gh-pages/_includes/footer.html'}
        ]
      },
      readme: {
        options: {
          process: function (content) {
            return content.replace(/\{\{ site.name \}\}/g, grunt.file.readJSON('package.json').name);
          }
        },
        files: [
          {src: ['gh-pages/readme.md'], dest: 'README.md'}
        ]
      }
    },
    template: {
      init: {
        options: {
          data: {
            ProjectName: '<%= pkg.name %>',
            ProjectVersion: '<%= pkg.version %>'
          }
        },
        files: {
          'gh-pages/index.html': ['bower_components/t1st3-assets/dist/project_index.html'],
          'gh-pages/404.html': ['bower_components/t1st3-assets/dist/project_404.html'],
          'gh-pages/amd_tests.html': ['bower_components/t1st3-assets/dist/project_tests.html'],
          'gh-pages/jsdoc.html': ['bower_components/t1st3-assets/dist/project_jsdoc.html'],
          'gh-pages/readme.md': ['bower_components/t1st3-assets/dist/readme.md'],
          'gh-pages/license.md': ['bower_components/t1st3-assets/dist/license.md'],
          'gh-pages/_config.yml': ['bower_components/t1st3-assets/dist/_config.yml']
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
    matter: {
      options: {
        strip: true
      },
      files: {
        src: 'README.md', dest: 'README.md'
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
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          timeout: 30000
        },
        src: ['node_test.js']
      }
    }
  });
  
  grunt.registerTask('init', [
    'bower:init',
    'copy:init',
    'template:init'
  ]);

  grunt.registerTask('build', [
    'version:js',
    'version:json',
    'jshint',
    'jscs',
    'copy:build'
  ]);

  grunt.registerTask('serve', [
    'connect:livereload',
    'open',
    'watch:amd'
  ]);

  grunt.registerTask('doc', [
    'copy:docs',
    'jsdoc:dist',
    'jekyll:docsamd',
    'copy:readme',
    'matter'
  ]);
  
  grunt.registerTask('test', [
    'mochaTest:test'
  ]);
};
