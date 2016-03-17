'use strict';

module.exports = function (path) {
	return {
		js: {
			files: [
				'gruntfile.js',
				'tasks/*.js',
				'assets/js/**/*.js'
			],
			tasks: ['jshint'],
			options: {
				livereload: true,
				nospawn: true
			}
		},
		sass: {
			files: [
				'assets/styles/sass/**/*.scss'
			],
			tasks: ['sass', 'autoprefixer'],
			options: {
				livereload: true,
				nospawn: true
			}
		},
		livereload: {
			options: {
				livereload: true,
				nospawn: true
			},
			files: [
				'**/*.html',
				'assets/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
			]
		}
	};
};