'use strict';

var LIVERELOAD_PORT = 35729;
var SERVER_PORT = 9000;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
	
	require('time-grunt')(grunt);
	
	require('load-grunt-tasks')(grunt, {
		scope: 'devDependencies',
		config: 'package.json',
		pattern: ['grunt-*']
	});
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: [
				'src/**/*.js',
				'Gruntfile.js',
				'demo/amd/app.js',
				'demo/browser-global/app.js',
				'demo/node/app.js'
			]
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
			main: {
				files: [
					{src: ['src/xmlrpc-message-umd.js'], dest: 'dist/xmlrpc-message-umd.js'},
					{src: ['src/xmlrpc-message-umd.js'], dest: 'demo/amd/xmlrpc-message-umd.js'},
					{src: ['src/xmlrpc-message-umd.js'], dest: 'test/amd/xmlrpc-message-umd.js'}
				]
			},
			demo: {
				files: [
					{src: ['bower_components/jquery/dist/jquery.js'], dest: 'demo/amd/jquery.js'},
					{src: ['bower_components/requirejs/require.js'], dest: 'demo/amd/require.js'},
					{src: ['bower_components/t1st3-assets/css/stylesheet.css'], dest: 'demo/amd/css/t1st3.css'},
					{src: ['bower_components/t1st3-assets/img/page-back.png'], dest: 'demo/amd/img/page-back.png'}
				]
			},
			test: {
				files: [
					{src: ['bower_components/jquery/dist/jquery.js'], dest: 'test/amd/jquery.js'},
					{src: ['bower_components/requirejs/require.js'], dest: 'test/amd/require.js'},
					{src: ['bower_components/mocha/mocha.js'], dest: 'test/amd/mocha.js'},
					{src: ['bower_components/mocha/mocha.css'], dest: 'test/amd/mocha.css'},
					{src: ['bower_components/chai/chai.js'], dest: 'test/amd/chai.js'}
				]
			}
		},
		jsdoc : {
			dist : {
				src: ['src/**/*.js'],
				options: {
					destination: 'doc/jsdoc'
				}
			}
		},
		jscs: {
			src: [
				'src/**/*.js',
				'Gruntfile.js',
				'demo/amd/app.js',
				'demo/browser-global/app.js',
				'demo/node/app.js'
			],
			options: {
				config: '.jscs.json'
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
			js: {
				files: [
					'src/**/*.js',
					'demo/browser-global/app.js',
					'demo/browser-global/index.html',
					'demo/browser-global/main.css'
				],
				tasks: ['jshint', 'jscs', 'uglify', 'copy:main'],
				options: {
					livereload: {
						port: LIVERELOAD_PORT
					}
				},
			},
		},
		connect: {
			options: {
				port: SERVER_PORT,
				hostname: 'localhost'
			},
			livereload: {
				options: {
					base: 'demo/amd',
					middleware: function (connect) {
						return [
							lrSnippet,
							mountFolder(connect, 'demo/amd')
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
			all: {
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
				src: ['test/node/*_test.js']
			}
		}
	});
	
	grunt.registerTask('init', [
		'bower:all',
		'copy:demo',
		'copy:test'
	]);

	grunt.registerTask('build', [
		'version:js',
		'version:json',
		'jshint',
		'jscs',
		'uglify',
		'copy:main'
	]);
	
	grunt.registerTask('serve', [
		'connect:livereload',
		'open',
		'watch:js'
	]);
	
	grunt.registerTask('doc', [
		'jsdoc:dist'
	]);
	
	grunt.registerTask('test', [
		'mochaTest:test'
	]);
};
