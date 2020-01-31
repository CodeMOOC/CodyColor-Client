// wrapper function
module.exports = function (grunt) {
    // configuration object
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // copy files in build directory
        copy: {
            build: {
                files: [
                    // copy all files excluded js, css, bower and index
                    {
                        expand: true,
                        cwd: 'src/',
                        src: [
                            '**/*',
                            '!contents/bower.json',
                            '!contents/index.html',
                            '!contents/js/**',
                            '!contents/css/**',
                            '!contents/bower_components/**'
                        ],
                        dest: 'build/',
                    },
                ],
            },
            'build-beta': {
                files: [
                    // copy all files excluded bower and index
                    {
                        expand: true,
                        cwd: 'src/',
                        src: [
                            '**/*',
                            '!contents/bower.json',
                            '!contents/index.html',
                            '!contents/bower_components/**'
                        ],
                        dest: 'build/',
                        rename: function(dest, src) {
                            // crea un ordinamento alfabetico ai file di libreria,
                            // dando precedenza a jquery, angular e translate
                            console.log(dest);
                            console.log(src);
                            if (src === 'contents/js/bower/jquery.js')
                                return dest + 'contents/js/bower/1-jquery.js';
                            else if (src === 'contents/js/bower/angular.js')
                                return dest + 'contents/js/bower/2-angular.js';
                            else if (src === 'contents/js/bower/angular-translate.js')
                                return dest + 'contents/js/bower/3-angular-translate.js';
                            else if (src === 'contents/js/bower/firebase-app.js')
                                return dest + 'contents/js/bower/4-firebase-app.js';

                            else
                                return dest + src;
                        }
                    },
                ],
            },
            'build-beta-local': {
                files: [
                    // copy all files excluded bower and index
                    {
                        expand: true,
                        cwd: 'src/',
                        src: [
                            'settings.js',
                        ],
                        dest: 'build/contents/js/',
                    },
                ],
            },
        },

        // copy necessaries bower file inside js
        bower: {
            all: {
                dest: 'src/contents/js/bower',
                js_dest: 'src/contents/js/bower',
                css_dest: 'src/contents/css/bower',
                options: {
                    keepExpandedHierarchy: false,
                    ignorePackages: ['components-font-awesome', 'firebaseui'],
                    packageSpecific: {
                        'firebase': {
                            files: [ 'firebase-app.js', 'firebase-auth.js'/*, 'firebase-analytics.js'*/ ]
                        },
                    },
                }
            }
        },

        // concatenates all javascript files in one, in a specific order
        concat: {
            options: {
                separator: ';'
            },
            build: {
                src: [
                    'src/contents/js/bower/jquery.js',
                    'src/contents/js/bower/angular.js',
                    'src/contents/js/bower/angular-translate.js',
                    'src/contents/js/bower/qrcode.js',
                    'src/contents/js/bower/qrcode_UTF8.js',
                    'src/contents/js/bower/firebase-app.js',
                    'src/contents/js/bower/*.js',
                    'src/contents/js/vendor/*.js',
                    'src/contents/js/app/main.js',
                    'src/contents/js/app/**/*.js'
                ],
                dest: 'build/contents/js/app/app.js',
            }
        },

        // js minification and compression with ES6 plugin
        uglify: {
            options: {
                // the banner is inserted at the top of the output
                banner: '/*! <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            build: {
                files: {
                    'build/contents/js/app/app.min.js': 'build/contents/js/app/app.js'
                }
            }
        },

        // css concatenation and minification
        cssmin: {
            build: {
                files: {
                    // it is important to concatenate in this order
                    'build/contents/css/app.min.css': [
                        'src/contents/css/normalize.css',
                        'src/contents/css/fontawesome.css',
                        'src/contents/css/firebase-ui-auth.css',
                        'src/contents/css/main.css',
                        'src/contents/css/firebase-ui-custom.css'
                    ]
                }
            }
        },

        includeSource: {
            options: {
                basePath: ['build/contents/'],
                templates: {
                    html: {
                        js: '<script src="{filePath}"></script>',
                        css: '<link rel="stylesheet" type="text/css" href="{filePath}" />',
                    },
                }
            },
            all: {
                files: {
                    'build/contents/index.html': 'src/contents/index.html'
                }
            },
        },

        shell: {
            all: {
                command: 'workbox injectManifest workbox-config.js'
            }
        },

        // delete temporary files
        clean: {
            preclean: ['build/**'],
            build: [
                'build/contents/js/app/app.js',
                'src/contents/js/bower',
                'src/contents/css/bower',
            ],
            'build-beta': [
                'src/contents/js/bower',
                'src/contents/css/bower',
            ]
        }
    });

    // load in the grunt plugins
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-bower');
    grunt.loadNpmTasks('grunt-include-source');
    grunt.loadNpmTasks('grunt-shell');

    // the default task can be run just by typing "grunt" on the command line
    grunt.registerTask('build', [
        'clean:preclean', 'copy:build','bower', 'concat',
        'uglify', 'cssmin', 'clean:build', 'includeSource', 'shell'
    ]);
    grunt.registerTask('build-beta', ['clean:preclean', 'bower', 'copy:build-beta',
        'clean:build-beta','includeSource', 'shell']);

    grunt.registerTask('build-beta-local', ['clean:preclean', 'bower', 'copy:build-beta',
        'clean:build-beta','includeSource', 'copy:build-beta-local']);

};