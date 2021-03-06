/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;*/\n',
    // Task configuration.

    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['public/js/<%= pkg.name %>.js'],
        dest: 'deploy/public/js<%= pkg.name %>.<%= pkg.version %>.js'
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      clientjs: {
        src: '<%= concat.dist.dest %>',
        dest: 'deploy/public/js<%= pkg.name %>.<%= pkg.version %>.min.js'
      }
    },

    jshint: {
      options: grunt.file.readJSON('.jshintrc'),
      gruntfile: {
        src: ['Gruntfile.js']
      },
      client: {
        options: {
          browser: true
        },
        src: ['public/js/{,**/}*.js', '!public/js/vendor/{,**/}*.js', '!public/js/polyfill/{,**/}*.js']
      },
      spec: {
        options: {
          browser: true,
          undef: false
        },
        src: 'spec/{,**/}*.js'
      }
    },

    compass: {
      options: {
        sassDir: 'src/sass',
        cssDir: 'public/css',
        imagesDir: 'public/img',
        javascriptsDir: 'public/js',
        outputStyle: 'expanded',
        noLineComments: false,
        force: false
      },
      dev: {
        options: {
          debugInfo: false
        }
      },
      build: {
        options: {
          noLineComments: true,
          debugInfo: false
        }
      }
    },

    connect: {
      site: {
        options: {
          port: 3001,
          hostname: 'localhost',
          base: ['public', 'spec', 'reports'],
          directory: 'reports',
          debug: true,
          livereload: 3002,
          open: true
        }
      }
    },

    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      continuous: {
        browsers: ['PhantomJS'],
        reporters: ['progress']
      },
      unit: {
        browsers: ['PhantomJS', 'Chrome', 'Firefox', 'Safari']
      // },
      // integration: {
      // },
      // functional: {
      }
    },

    bower: {
      client: {
        dest: 'src/sass/vendor',
        js_dest: 'public/js/vendor',
        css_dest: 'public/css/vendor',
        options: {
          ignorePackages: ['jasmine']
        }
      }
    },

    responsive_images: {
      backgrounds: {
        options: {
          newFilesOnly: true,
          sizes: [
            {name: 'xlarge-2x', width: 3264, quality: 30},
            {name: 'xlarge-1x', width: 1632, quality: 30},
            {name: 'large-2x', width: 2560, quality: 30},
            {name: 'large-1x', width: 1280, quality: 30},
            {name: 'medium-2x', width: 1536, quality: 30},
            {name: 'medium-1x', width: 768, quality: 30},
            {name: 'small-2x', width: 960, quality: 30},
            {name: 'small-1x', width: 480, quality: 30}
          ]
        },
        files: [{
          expand: true,
          cwd: 'src/img/original/',
          src: '{,**/}*',
          dest: 'src/img/resized'
        }]
      }
    },

    imagemin: {
      backgrounds: {
        files: [{
          expand: true,
          cwd: 'src/img/resized/',
          src: '{,**/}*',
          dest: 'public/img'
        }]
      }
    },

    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        options: {
          paths: 'public/js',
          themedir: 'node_modules/yuidoc-bootstrap-theme',
          helpers: ['node_modules/yuidoc-bootstrap-theme/helpers/helpers.js'],
          outdir: 'reports/docs'
        }
      }
    },

    compress: {
      versioned: {
        options: {
          archive: 'build/<%= pkg.name %>-<%= pkg.version %>.zip',
          mode: 'zip'
        },
        files: [{ src: 'public/**' }]
      },
      current: {
        options: {
          archive: 'build/<%= pkg.name %>-current.zip',
          mode: 'zip'
        },
        files: [{ src: 'public/**' }]
      }
    },

    bump: {
      options: {
        files: ['package.json'],
        commit: false,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json', 'public/css/day-calendar.css'],
        createTag: false,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'upstream',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false
      }
    },

    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile'],
        options: {
          reload: true
        }
      },
      clientjs: {
        files: '<%= jshint.client.src %>',
        tasks: ['jshint:client', 'karma:continuous'],
        options: {
          livereload: true
        }
      },
      spec: {
        files: '<%= jshint.spec.src %>',
        tasks: ['jshint:spec', 'karma:continuous']
      },
      livereload: {
        options: {
          livereload: '<%= connect.site.options.livereload %>'
        },
        files: 'public/{,**/}*'
      },
      compass: {
        files: 'src/sass/{,**/}*.{sass,scss}',
        tasks: ['compass:dev']
      },
      image_resize: {
        files: 'src/img/original/{,**/}*',
        tasks: ['newer:responsive_images:backgrounds']
      },
      image_opt: {
        files: 'src/img/resized/{,**/}*',
        tasks: ['newer:imagemin:backgrounds']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-bower');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-filerev');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-usemin');

  // Default task.
  grunt.registerTask('default', ['bower', 'compass:dev', 'jshint', 'karma:continuous',
      'connect:site', 'watch']);

  grunt.registerTask('reloadPackage', function () {
    grunt.config.set('pkg', grunt.file.readJSON('package.json'));
  });

  grunt.registerTask('release', function (target) {
    var acceptableTargets = ['patch', 'minor', 'major', 'prerelease', 'git'];

    if (!target || acceptableTargets.indexOf(target) === -1) {
      target = '';
    } else {
      target = ':' + target;
    }

    grunt.task.run(['compass:build', 'bump' + target, 'reloadPackage', 'compress']);
  });

};
