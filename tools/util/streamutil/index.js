//
'use strict';

var gulp_ignore = require('gulp-ignore');


function make_stream(func, options) {
	var once = options && options.once;

	var has_run = false;

	function include_func() {
		if (once) {
			if (has_run) {
				return true;
			}
			else {
				has_run = true;
			}
		}

		if (!func) {
			return true;
		}

		var func_result = func.apply(null, arguments);

		return func_result !== false;
	}

	var stream = gulp_ignore.include(include_func);

	return stream;
}


module.exports = {
	make_stream
};
