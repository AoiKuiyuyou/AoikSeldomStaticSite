//
'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var glob = require('glob');
var moment = require('moment');


function builder(options) {
	var meta = options.meta;

	assert(meta);

	var post_glob = meta.post_glob;

	assert(post_glob);

	post_glob = options.resolve({
		uri: post_glob
	});

	var post_metadata_file_paths = glob.sync(post_glob);

	var metadata_builder = options.config.load(
		options.config.METADATA_BUILDER_URI
	);

	var post_metas = post_metadata_file_paths.map(function (
		post_metadata_file_path) {
		var post_metadata_file_data = fs.readFileSync(
			post_metadata_file_path, {
				encoding: 'utf8'
			}
		);

		var post_meta = metadata_builder({
			uri: post_metadata_file_path,
			data: post_metadata_file_data,
			config: options.config,
			log: options.log,
			require: options.require,
			ignore_body: true
		});

		post_meta.dir_name = path.basename(path.dirname(
			post_metadata_file_path));

		post_meta.create_moment = moment(
			post_meta.create_time, 'YYYY-MM-DD HH:mm:ss');

		return post_meta;
	});

	post_metas.sort(function (a, b) {
		return a.create_moment < b.create_moment;
	});

	meta.post_metas = post_metas;
}


module.exports = builder;
