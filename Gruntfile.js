// require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

module.exports = function (grunt) {
  // Do grunt-related things in here

  // Project configuration.
  grunt.initConfig({
    concurrent: {
      dev: {
        tasks: ['nodemon', 'watch'], // 'node-inspector', 'watch'], <-- node-inspector, a debugger, don't need yet
        options: {
          logConcurrentOutput: true
        }
      }
    },
    eslint: {
      all: {
        files: {
          src: [
            '*.js',
            'Gruntfile.js',
            'biz/*.js',
            'confit/*.js',
            '/model/*.js',
            'routes/*.js',
            'utils/*.js',
            'tests/**/*.js'
          ]
        },
        options: {
          config: './.eslintrc.json'
        }
      }
    },
    mochaTest: {
      test: {
        src: ['test/unittests/*.js']
      }
    },
    shell: {
      target: {
        command: 'node ./test/config/setup_tests.js; ./node_modules/jasmine-node/bin/jasmine-node ./test/frisbytests'
      }
    },
    'jasmine-node': {
      options: {
        forceExit: true,
        match: '.',
        matchall: false,
        extensions: 'js',
        specNameMatcher: 'spec'
      },
      all: ['test/frisbytests/*']
    },
    'node-inspector': {
      custom: {
        options: {
          // 'web-port' : 1667
        }
      }
    },
    nodemon: {
      dev: {
        script: './app.js', // './bin/www', './index.js',
        options: {
          ignore: ['node_modules/**']
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
          'dist/app.js': 'app.js'
        }
      }
    }
//    uglify: {
//      options: {
//        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
//      },
//      build: {
//        src: 'src/<%= pkg.name %>.js',
//        dest: 'build/<%= pkg.name %>.min.js'
//      }
//    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-node-inspector');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-jasmine-node');

  // Default task(s).
  grunt.registerTask('lint', ['eslint']);
  grunt.registerTask('default', ['babel', 'nodemon']);
  grunt.registerTask('test', ['mochaTest', 'shell']); // , 'jasmine_node']);
  grunt.registerTask('basic', ['nodemon']);
};
