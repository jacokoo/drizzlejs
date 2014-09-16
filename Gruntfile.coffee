module.exports = (grunt) ->

    require('load-grunt-tasks') grunt

    coffeeBanner = '''
        # DrizzleJS v<%= pkg.version %>
        # -------------------------------------
        # Copyright (c) <%= grunt.template.today("yyyy") %> Jaco Koo <jaco.koo@guyong.in>
        # Distributed under MIT license\n\n
    '''

    banner = coffeeBanner.replace /#/g, '//'

    exts = ("    # @include ext/#{ext}.coffee" for ext in (grunt.option('ext') or '').split ',' when ext).join '\n\n'

    allExts = []
    grunt.file.recurse 'src/ext', (abs, root, folder, file) -> allExts.push "    # @include ext/#{file}"
    allExts = allExts.join '\n\n'

    grunt.initConfig
        pkg: grunt.file.readJSON 'package.json'

        clean:
            dist: files: [dot: true, src: ['dist', '.tmp']]
            tmp: '.tmp'
            demo: ['demo/scripts/drizzlejs', 'demo/scripts/{**/*, *}.js']

        template:
            all:
                options: data:
                    version: '<%= pkg.version %>'
                    extModules: allExts
                src: '.tmp/drizzle.coffee'
                dest: '.tmp/drizzle-all.coffee'

            drizzle:
                options: data:
                    version: '<%= pkg.version %>'
                    extModules: exts
                src: '.tmp/drizzle.coffee'
                dest: '.tmp/drizzle.coffee'

        preprocess:
            drizzle:
                src: '.tmp/drizzle.coffee'
                dest: 'dist/drizzle.coffee'
            all:
                src: '.tmp/drizzle-all.coffee'
                dest: 'dist/drizzle-all.coffee'

        trimtrailingspaces:
            drizzle: src: 'dist/drizzle.coffee'
            all: src: 'dist/drizzle-all.coffee'

        concat:
            drizzle:
                options: banner: coffeeBanner
                src: 'dist/drizzle.coffee'
                dest: 'dist/drizzle.coffee'
            all:
                options: banner: coffeeBanner
                src: 'dist/drizzle-all.coffee'
                dest: 'dist/drizzle-all.coffee'
            js:
                options: banner: banner
                src: 'dist/drizzle.js'
                dest: 'dist/drizzle.js'
            alljs:
                options: banner: banner
                src: 'dist/drizzle-all.js'
                dest: 'dist/drizzle-all.js'

        coffeelint:
            drizle: 'dist/drizzle.coffee'
            all: 'dist/drizzle-all.coffee'
            options:
                configFile: '.coffeelint'

        coffee:
            drizzle:
                options: sourceMap: true, bare: true
                src: 'dist/drizzle.coffee'
                dest: 'dist/drizzle.js'
            all:
                options: sourceMap: true, bare: true
                src: 'dist/drizzle-all.coffee'
                dest: 'dist/drizzle-all.js'
            demo:
                expand: true
                cwd: 'demo/scripts'
                src: ['{**/,}*.coffee']
                dest: 'demo/scripts'
                ext: '.js'

        uglify:
            options:
                sourceMap: true
                sourceMapIn: 'dist/drizzle.js.map'
                banner: banner
            drizzle:
                files: 'dist/drizzle.min.js': ['dist/drizzle.js']
            all:
                files: 'dist/drizzle-all.min.js': ['dist/drizzle-all.js']

        copy:
            drizzle: files: [expand: true, cwd: 'src', src: ['**'], dest: '.tmp']
            demo: files: [expand: true, cwd: 'dist', src: ['**'], dest: 'demo/scripts/drizzlejs']

        shell: bower: command: 'bower install', options: execOptions: cwd: 'demo'

        connect: demo: options: port: 8000, base: 'demo', keepalive: true

    grunt.registerTask 'build', [
        'clean:dist', 'copy:drizzle', 'template', 'preprocess', 'trimtrailingspaces'
        'coffeelint', 'coffee:drizzle', 'coffee:all', 'concat', 'uglify', 'clean:tmp'
    ]

    grunt.registerTask 'default', ['copy:drizzle', 'template']

    grunt.registerTask 'demo', ['build', 'clean:demo', 'coffee:demo', 'copy:demo', 'shell', 'connect']
