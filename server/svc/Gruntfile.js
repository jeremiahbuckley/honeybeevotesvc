//require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

module.exports = function(grunt) {
  // Do grunt-related things in here

	// Project configuration.
	grunt.initConfig({
		concurrent: {
			dev: {
				tasks: ['nodemon', 'watch'], //'node-inspector', 'watch'], <-- node-inspector, a debugger, don't need yet
				options: {
					logConcurrentOutput: true
				}
			}
		},		
		eslint: {
			target: [
				'Gruntfile.js',
				'biz/*.js',
				'confit/*.js',
				'model/*.js',
				'routes/*.js',
				'tests/**/*.js'
			]
		},
		nodemon: {
			dev: {
				script: './bin/www',//'index.js',
				options: {
					ignore: ['node_modules/**']//,
				}
			}
		},
		pkg: grunt.file.readJSON('package.json'),
		babel: {
			options: {
				sourceMap: true,
				presets: ['es2015']
			},
			files: {
				expand: true,
				src: ['**/*.es6'],
				ext: '-compiled.js'
			},
			dist: {
				files: {
					'dist/app.js': 'src/app.js'
				}
			}
		}
//	  uglify: {
//	    options: {
//	      banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
//	    },
//	    build: {
//	      src: 'src/<%= pkg.name %>.js',
//	      dest: 'build/<%= pkg.name %>.min.js'
//	    }
//	  }
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-eslint');

	// Default task(s).
	grunt.registerTask('lint', ['eslint']);
	grunt.registerTask('default', ['babel', 'nodemon']);
	grunt.registerTask('basic', ['nodemon']);

};