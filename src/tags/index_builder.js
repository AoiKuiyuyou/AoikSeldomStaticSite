//
'use strict';

var assert = require('assert');
var path = require('path');
var moment = require('moment');
var merge = require('merge');


function builder(options) {
	assert(options.resolve);

	var map_tag_to_post_meta_array = options.resolve({
		uri: 'load://./tags_info.json'
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

	if (tags.length > 0 && tags[0] === '') {
		// Remove empty tag from the beginning
		var empty_tag = tags.shift();

		// Add empty tag to the end
		tags.push(empty_tag);
	}

	var meta = options.meta;

	assert(meta);

	merge.recursive(meta, {
		tags,
		map_tag_to_post_meta_array
	});
}


module.exports = builder;
