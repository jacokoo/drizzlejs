module.exports = (grunt) ->

    require('load-grunt-tasks') grunt

    coffeeBanner = '''
        # DrizzleJS v<%= pkg.version %>
        # -------------------------------------
        # Copyright (c) <%= grunt.template.today("yyyy") %> Jaco Koo <jaco.koo@guyong.in>
        # Distributed under MIT license\n\n
    '''

    banner = coffeeBanner.replace /#/g, '//'

    grunt.initConfig
        pkg: grunt.file.readJSON 'package.json'

        clean: dist: 'dist'

        coffeelint:
            app: 'src/{**/*, *}.coffee'
            options:
                configFile: '.coffeelint'

        preprocess: drizzle:
            src: 'src/drizzle.coffee'
            dest: 'dist/drizzle.coffee'

        template:
            options: data: version: '<%= pkg.version %>'
            drizzle:
                src: 'dist/drizzle.coffee'
                dest: 'dist/drizzle.coffee'

        concat:
            coffee:
                options: banner: coffeeBanner
                src: 'dist/drizzle.coffee'
                dest: 'dist/drizzle.coffee'
            js:
                options: banner: banner
                src: 'dist/drizzle.js'
                dest: 'dist/drizzle.js'

        coffee: compile:
            options: sourceMap: true, bare: true
            src: 'dist/drizzle.coffee'
            dest: 'dist/drizzle.js'

        uglify:
            options:
                sourceMap: true
                sourceMapIn: 'dist/drizzle.js.map'
                banner: banner
            drizzle:
                files: 'dist/drizzle.min.js': ['dist/drizzle.js']

    grunt.registerTask 'default', ['clean', 'coffeelint', 'preprocess', 'template', 'coffee', 'concat', 'uglify']
