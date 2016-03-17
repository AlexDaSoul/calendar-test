'use strict';

module.exports = function (path) {
	return {
		options: {
			port: 8080,
			hostname: 'localhost',
			livereload: true,
			base: ['./']
		},
		src: {
			options: {
				open: true
			}
		}
	};
};