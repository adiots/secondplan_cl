module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		buildPath: "../build/",
		coffee: {
			build: {
				option: {
					join: true
				},
				files: {
					'js/coffee.js':'js/coffee/*.coffee'
				}
			}
		},
		concat: {
			options: {
				// 連結される各ファイル内の間に配置出力する文字列を定義
				separator: ';'
			},
			dist: {
				// 連結するファイル
				src: ['js/*.js', 'js/plugin/jquery*.js'],
				// 結果として生成されるJSファイル
				dest: '<%= pkg.subname %>.js'
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd hh:MM:ss") %> */\n'
			},
			dist: {
				files: {
					'<%= buildPath %>js/<%= pkg.subname %>.js': [
						'<%= concat.dist.dest %>'
					],
// 					'<%= buildPath %>js/utility.min.js': [
// 						'js/plugin/utility.js',
// 					]
				}
			}
		},
		jshint: {
			// 対象となるファイルを定義します
			files: ['js/*.js'],
			// JSHintを構成します。(参照:http://www.jshint.com/docs/)
			options: {
				// JSHintの初期値を上書きしたい場合、ここにオプションを更に追加します
				globals: {
					jQuery: true,
				},
				eqnull: true,
				unused: true,
			}
		},
		compass: {
			dist: {
				options: {
					httpPath: 'http://localhost/secondplan_cl/build',
					sassDir: 'src/sass',
					cssDir: 'src/css',
					imagesDir: 'src/images',
					environment: 'production'
				}
			},
		},
		cssmin: {
			minify:{
				options: {
					banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd hh:MM:ss") %> */\n'
				},
				files: {
					'<%= buildPath %>css/<%= pkg.subname %>.css': [
						'css/*.css'
					]
				}
			}
		},
		compress: {
			css: {
				options: {
					mode: 'gzip',
				},
				files: [{
					expand: true,
					src: "<%= buildPath %>css/*.min.css",
					ext: ".min.css.gz",
				}]
			},
			js: {
				options: {
					mode: 'gzip',
				},
				files: [{
					expand: true,
					src: "<%= buildPath %>js/*.min.js",
					ext: ".min.js.gz",
				}]
			},
		},
		copy: {
			dist: {
				files: [
				{
					expand: true,
					cwd: './',
					src: 'img/*.png',
					dest: '<%= buildPath %>img/',
					flatten: true,
					filter: 'isFile',
				},
				{
					expand: true,
					cwd: './js/plugin/',
					src: '*.js',
					dest: '<%= buildPath %>js/plugin/',
					flatten: true,
					filter: 'isFile',
				},
				{
					expand: true,
					cwd: './tmp/',
					src: '*.tmp',
					dest: '<%= buildPath %>/tmp/',
					flatten: true,
					filter: 'isFile',
				},
				{
					expand: true,
					cwd: './tmp/config/',
					src: 'extend_head.tmp',
					dest: '<%= buildPath %>/tmp/',
					flatten: true,
					filter: 'isFile',
				},
				{
					expand: true,
					cwd: './',
					src: '*.php',
					dest: '<%= buildPath %>',
					flatten: true,
					filter: 'isFile',
				},
				]
			},
			test: {
				files: [
				{
					expand: true,
					cwd: './',
					src: 'img/*.png',
					dest: '<%= buildPath %>img/',
					flatten: true,
					filter: 'isFile',
				},
				{
					expand: true,
					cwd: './js/plugin/',
					src: '*.js',
					dest: '<%= buildPath %>js/plugin/',
					flatten: true,
					filter: 'isFile',
				},
				{
					expand: true,
					cwd: './tmp/',
					src: '*.tmp',
					dest: '<%= buildPath %>/tmp/',
					flatten: true,
					filter: 'isFile',
				},
				{
					expand: true,
					cwd: './tmp/config/',
					src: 'extend_head_tst.tmp',
					dest: '<%= buildPath %>/tmp/config/',
					rename: function(dest, src) {
						return dest + 'extend_head.tmp';
					},
					flatten: true,
					filter: 'isFile',
				},
				{
					expand: true,
					cwd: './',
					src: '*.php',
					dest: '<%= buildPath %>',
					flatten: true,
					filter: 'isFile',
				},
				]
			}
		},
		watch: {
			doc: {
				files: ['<%= jshint.files %>'],
				tasks: ['build'],
			}
		},
		clean: {
			testImage: ["img/*.png", "!img/**"],
			endImage: ["<%= buildPath %>img/**", "!<%= buildPath %>img/*.png"],
			end: ["<%= concat.dist.dest %>"],
		},
	});
	
	// js plugin.
	grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	
	// css plugin.
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	
	// compress
	grunt.loadNpmTasks('grunt-contrib-compress');
	
	// utility
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	
	
	// Define TASK
	grunt.registerTask('default', ['watch']);
	grunt.registerTask('js-test', ['jshint']);
	grunt.registerTask('compass-test', ['compass']);
	grunt.registerTask('build-test', ['clean:testImage', 'coffee', 'jshint', 'concat', 'uglify', 'compass', 'copy:test', 'cssmin', 'compress', 'clean:end']);
	grunt.registerTask('build', ['clean:testImage', 'coffee', 'jshint', 'concat', 'uglify', 'compass', 'copy', 'cssmin', 'compress', 'clean:end']);
	
	
};
