'use strict';

var path = require('path');
var argv = require('yargs').argv;

module.exports = function (grunt) {

	/** Load all grunt related task */
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	grunt.initConfig({

		/** Package */
		'pkg': require('./package.json'),

		/** JShint task */
		'jshint': require('./tasks/jshint')(path),

		/** Sass task */
		'sass': require('./tasks/sass')(path),

		/** Autoprefixer task */
		'autoprefixer': require('./tasks/autoprefixer')(path),

		/** Connect task */
		'connect': require('./tasks/connect')(path),

		/** Watch task */
		'watch': require('./tasks/watch')(path)
	});


	/**
	 * serve task
	 * @usage: grunt serve
	 */

	grunt.registerTask('default', [
		'jshint',
		'sass',
		'autoprefixer',
		'connect:src',
		'watch'
	]);
};