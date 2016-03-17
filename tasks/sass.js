'use strict';

module.exports = function (path) {
	return {
		build: {
			files: [{
				'assets/styles/template.css': ['assets/styles/sass/template.scss']
			}]
		}
	};
};