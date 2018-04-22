//
'use strict';

var assert = require('assert');
var fs = require('fs');
var glob = require('glob');


function builder(options) {
	var msg;

	if (!(typeof options.config === 'object' && options.config)) {
		msg = 'Option `config` is not dict: ' + options.config;

		throw Error(msg);
	}

	if (!(typeof options.log === 'function')) {
		msg = 'Option `log` is not function: ' + options.log;

		throw Error(msg);
	}

	if (!(typeof options.require === 'function')) {
		msg = 'Option `require` is not function: ' + options.require;

		throw Error(msg);
	}

	if (!(typeof options.resolve === 'function')) {
		msg = 'Option `resolve` is not function: ' + options.resolve;

		throw Error(msg);
	}

	var config = options.config;

	var metadata_builder = config.load(config.METADATA_BUILDER_URI);

	assert(metadata_builder);

	var meta = options.meta;

	assert(meta);

	var post_glob = meta.post_glob;

	assert(post_glob);

	post_glob = options.resolve({
		uri: post_glob
	});

	var post_meta_file_paths = glob.sync(post_glob);

	var map_tag_to_post_meta_array = {};

	var project_dir = options.config.PROJECT_DIR;

	assert(project_dir);

	post_meta_file_paths.forEach(function (file_path) {
		var file_data = fs.readFileSync(file_path, {
			encoding: 'utf8'
		});

		var post_meta = metadata_builder({
			uri: file_path,
			data: file_data,
			config: options.config,
			log: options.log,
			require: options.require,
			ignore_body: true
		});

		var tags = post_meta.tags || [];

		if (tags.length > 0) {
			tags.forEach(function (tag) {
				var post_meta_array = map_tag_to_post_meta_array[tag] =
					map_tag_to_post_meta_array[tag] || [];

				post_meta_array.push(post_meta);
			});
		}
		else {
			var tag = '';

			var post_meta_array = map_tag_to_post_meta_array[tag] =
				map_tag_to_post_meta_array[tag] || [];

			post_meta_array.push(post_meta);
		}
	});

	var tags = Object.keys(map_tag_to_post_meta_array);

	tags.sort();

	tags.forEach(function (tag) {
		var post_meta_array = map_tag_to_post_meta_array[tag];

		post_meta_array.sort(function (a, b) {
			return a.create_time < b.create_time;
		});
	});

	var json_text = JSON.stringify(map_tag_to_post_meta_array, null, 4);

	return json_text;
}


module.exports = builder;
