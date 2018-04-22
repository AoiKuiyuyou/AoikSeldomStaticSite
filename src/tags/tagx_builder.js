//
'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var moment = require('moment');
var project_dir = require('../../config').PROJECT_DIR;
var nunjucksBuilder = require(
	project_dir + '/tools/nunjucks/nunjucks_builder.js');
var file_exists = require(
	project_dir + '/tools/util/fsutil').file_exists;
var merge = require('merge');


function builder(options) {
	var meta = options.meta;

	assert(meta);

	assert(options.resolve);

	var map_tag_to_post_meta_array = options.resolve({
		uri: 'load://../tags/tags_info.json'
	});

	Object.keys(map_tag_to_post_meta_array).forEach(function (tag) {
		var post_meta_array = map_tag_to_post_meta_array[tag];

		post_meta_array.forEach(function (post_meta) {
			post_meta.dir_name = path.basename(post_meta.$$file_dir);

			post_meta.create_moment = moment(
				post_meta.create_time, 'YYYY-MM-DD HH:mm:ss');
		});
	});

	var tags = Object.keys(map_tag_to_post_meta_array);

	tags.sort();

	tags.forEach(function (tag) {
		var post_meta_array = map_tag_to_post_meta_array[tag];

		post_meta_array.sort(function (a, b) {
			return a.create_moment < b.create_moment;
		});
	});

	assert(meta.$tagx_builder.template);

	var template_file_path = options.resolve({
		uri: meta.$tagx_builder.template
	});

	assert(file_exists(template_file_path), template_file_path);

	var template_string = fs.readFileSync(template_file_path, {
		encoding: 'utf8'
	});

	var output_dir = meta.$tagx_builder.output_dir;

	assert(output_dir);

	output_dir = options.resolve({
		uri: output_dir
	});

	mkdirp.sync(output_dir);

	tags.forEach(function (tag) {
		var post_meta_array = map_tag_to_post_meta_array[tag];

		if (tag === '') {
			tag = 'other';
		}

		var template_context = merge.recursive({},
			meta, {
				tag,
				post_meta_array
			}
		);

		var output_file_data = nunjucksBuilder({
			data: template_string,
			meta: template_context,
			config: options.config,
			require: options.require,
			resolve: options.resolve
		});

		var output_file_dir = path.join(output_dir, tag);

		mkdirp.sync(output_file_dir);

		var output_file_path = path.join(output_file_dir, 'index.html');

		fs.writeFileSync(output_file_path, output_file_data);
	});
}


module.exports = builder;
