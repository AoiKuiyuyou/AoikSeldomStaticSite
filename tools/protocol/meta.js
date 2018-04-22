//
'use strict';

var assert = require('assert');
var fs = require('fs');
var merge = require('merge');
var file_exists = require('../util/fsutil').file_exists;


function resolve(options) {
	var metadata_file_path = options.resolve(merge({}, options, {
		uri: options.uri_body,
		load: false
	}));

	assert(file_exists(metadata_file_path), metadata_file_path);

	var metadata_file_data = fs.readFileSync(metadata_file_path, {
		encoding: 'utf8'
	});

	var config = options.config;

	assert(config);

	var metadata_builder = config.load(options.config.METADATA_BUILDER_URI);

	var meta = metadata_builder({
		uri: metadata_file_path,
		data: metadata_file_data,
		config: config,
		log: options.log,
		require: options.require,
		resolve: options.resolve
	});

	return meta;
}


module.exports = resolve;
