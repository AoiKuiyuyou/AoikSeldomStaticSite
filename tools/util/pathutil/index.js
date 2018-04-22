//
'use strict';

var path = require('path');


function path_abs() {
	var abs_path = path.resolve.apply(null, arguments);

	abs_path = abs_path.replace(/\\/g, '/');

	return abs_path;
}


function dir_abs() {
	var abs_dir = path.dirname.apply(null, arguments);

	abs_dir = abs_dir.replace(/\\/g, '/');

	return abs_dir;
}


module.exports = {
	path_abs,
	dir_abs
};
