//
'use strict';

var assert = require('assert');


function resolve(options) {
	var uri = options.uri;

	assert(uri);

	var root_base = options.root_base;

	if (typeof root_base !== 'string') {
		var msg = 'Option `root_base` not given for URI: ' + uri;

		throw new Error(msg);
	}

	var resolved_path = root_base + '/' + options.uri_body;

	return resolved_path;
}


module.exports = resolve;
