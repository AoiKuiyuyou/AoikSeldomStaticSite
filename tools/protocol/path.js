//
'use strict';

var path = require('path');


function resolve(options) {
	var msg;

	var uri_body = options.uri_body;

	if (typeof uri_body !== 'string') {
		msg = 'Option `uri_body` is invalid: ' + uri_body;

		throw new Error(msg);
	}

	var path_base = options.path_base;

	if (typeof path_base !== 'string') {
		msg = '`path_base` option is not specified for given URI: ' +
			options.uri;

		throw new Error(msg);
	}

	var resolved_path;

	if (path.isAbsolute(uri_body)) {
		resolved_path = uri_body;
	}
	// If given path is relative path starting with `./` or `../`
	else if (/^\.\.?\//.test(uri_body)) {
		var new_path = path.join(path_base, uri_body)
			.replace(/\\/g, '/');

		if (!path.isAbsolute(new_path) && options.path_lead) {
			new_path = options.path_lead + new_path;
		}

		resolved_path = new_path;
	}
	else {
		resolved_path = uri_body;
	}

	return resolved_path;
}


module.exports = resolve;
