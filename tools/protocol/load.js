//
'use strict';

var assert = require('assert');
var merge = require('merge');


function resolve(options) {
	var uri = options.uri_body || options.uri;

	assert(uri);

	var new_options = merge.recursive({}, options, {
		uri,
		load: false
	});

	var file_path = options.resolve(new_options);

	var file_path_parts = file_path.split('::');

	// Use the first part as file path
	file_path = file_path_parts[0];

	var obj = require(file_path);

	// Use the second part as property chain
	var property_chain = file_path_parts[1];

	if (property_chain) {
		var property_keys = property_chain.split('.');

		property_keys.forEach(function (property_key) {
			obj = obj[property_key];
		});
	}

	if (options.call) {
		obj = obj();
	}

	return obj;
}


module.exports = resolve;
