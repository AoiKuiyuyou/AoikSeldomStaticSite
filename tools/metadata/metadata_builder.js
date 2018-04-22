//
'use strict';

var assert = require('assert');
var merge = require('merge');
var parse_frontmeta = require('../util/frontmeta/index.js').parse_frontmeta;
var path_mod = require('path');


function metadata_builder(options) {
	var msg;

	if (!(typeof options.uri === 'string' &&
			path_mod.isAbsolute(options.uri))) {
		msg = 'Option `uri` is not absolute path: ' + options.uri;

		throw Error(msg);
	}

	if (!(typeof options.data === 'string')) {
		msg = 'Option `data` is not string: ' + options.data;

		throw Error(msg);
	}

	if (!(typeof options.config === 'object' && options.config)) {
		msg = 'Option `config` is not object: ' + options.config;

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

	var path_util = options.require('./tools/util/pathutil');

	var metadata_dir = path_util.dir_abs(options.uri);

	assert(path_mod.isAbsolute(metadata_dir));

	var config = options.config;

	var log = options.log;

	assert(path_mod.isAbsolute(config.PROJECT_DIR));

	assert(options.config.PROTOCOL_RESOLVER_URI,
		'Error: Missing config `PROTOCOL_RESOLVER_URI`');

	var resolve_all = options.require(options.config.PROTOCOL_RESOLVER_URI);

	var meta;

	// Resolve URI in the metadata file
	function resolve_on_meta(options2) {
		assert(options2.uri);

		var base_options = {
			config,
			log: options.log,
			require: options.require,
			resolve: resolve_on_meta,
			// Used by `self` protocol.
			self_base: meta,
			// Used by `root` protocol
			root_base: config.PROJECT_DIR,
			// Used by `path` protocol
			path_base: metadata_dir,
			// Used by `path` protocol
			path_lead: './'
		};

		var merged_options = merge.recursive(base_options, options2);

		return resolve_all(merged_options);
	}

	var head_body_info = parse_frontmeta(options.data);

	var head_type = head_body_info.head_type;

	var resolve_to_functions =
		options.require('./tools/protocol/_util').resolve_to_functions;

	assert(resolve_to_functions);

	// The `$$` prefix aims to avoid clashing with user-defined keys.
	meta = {
		$$file_uri: options.uri,
		$$file_dir: metadata_dir,
		$$head_type: head_body_info.head_type,
		$$head_data: head_body_info.head_data,
		$$body_type: head_body_info.body_type,
		$$body_data: head_body_info.body_data
	};

	var head_builder_input_data = head_body_info.head_data;

	if (head_type) {
		var head_type_parts = head_type.split('|');

		var head_builder_uris = head_type_parts.map(function (head_type_part) {
			head_type_part = head_type_part.trim();

			if (!head_type_part) {
				return null;
			}

			assert(head_type_part);

			var builder_uri;

			// If the part starts with `./`
			if (head_type_part.lastIndexOf('./', 0) === 0) {
				// Use the part as builder URI
				builder_uri = head_type_part;
			}
			// If the part starts with `../`
			else if (head_type_part.lastIndexOf('../', 0) === 0) {
				// Use the part as builder URI
				builder_uri = head_type_part;
			}
			// If the part contains `://`
			else if ((head_type_part.indexOf('://') > -1)) {
				// Use the part as builder URI
				builder_uri = head_type_part;
			}
			// If the part not contains `://`
			else {
				// Use the part as protocol name
				builder_uri = head_type_part + '://';
			}

			return builder_uri;
		});

		// Each info has two keys:
		// - uri: Builder function URI.
		// - value: Builder function.
		var head_builder_infos = resolve_to_functions({
			uris: head_builder_uris,
			resolve: function (uri) {
				return resolve_on_meta({
					uri,
					data: null,
					meta: null,
					// Used by `all` protocol
					load: true,
					is_meta_head_builder: true
				});
			}
		});

		head_builder_infos.forEach(function (head_builder_info) {
			var head_builder_uri = head_builder_info.uri;

			msg = 'Head builder: ' + head_builder_uri;

			log(msg);

			var head_builder = head_builder_info.value;

			var head_builder_output_data = head_builder({
				uri: options.uri,
				data: head_builder_input_data,
				meta,
				config,
				log,
				require: options.require,
				resolve: resolve_on_meta,
				is_meta_head_builder: true
			});

			if (head_builder_output_data !== undefined) {
				// Use as input data for the next round
				head_builder_input_data = head_builder_output_data;
			}

			if (typeof head_builder_output_data === 'object' &&
				head_builder_output_data) {
				// Use as the new meta dict
				meta = head_builder_output_data;

				// Set these keys in the new meta dict.
				//
				// This aims to ensure that each builder sees consistent values
				// of these keys.
				//
				meta.$$file_uri = options.uri;

				meta.$$file_dir = metadata_dir;

				meta.$$head_type = head_body_info.head_type;

				meta.$$head_data = head_body_info.head_data;

				meta.$$body_type = head_body_info.body_type;

				meta.$$body_data = head_body_info.body_data;
			}
		});
	}

	if (!(typeof meta === 'object' && meta)) {
		msg = 'The last metadata head builder did not produce a dict.';

		throw Error(msg);
	}

	assert('$$file_uri' in meta && meta.$$file_uri === options.uri);
	assert('$$file_dir' in meta && meta.$$file_dir === metadata_dir);
	assert('$$head_type' in meta &&
		meta.$$head_type === head_body_info.head_type);
	assert('$$body_type' in meta &&
		meta.$$body_type === head_body_info.body_type);

	if (options.ignore_body) {
		return meta;
	}

	var body_type = head_body_info.body_type;

	if (body_type) {
		var body_type_parts = body_type.split('|');

		var body_builder_uris = body_type_parts.map(function (body_type_part) {
			body_type_part = body_type_part.trim();

			if (!body_type_part) {
				return null;
			}

			assert(body_type_part);

			var builder_uri;

			// If the part starts with `./`
			if (body_type_part.lastIndexOf('./', 0) === 0) {
				// Use the part as builder URI
				builder_uri = body_type_part;
			}
			// If the part starts with `../`
			else if (body_type_part.lastIndexOf('../', 0) === 0) {
				// Use the part as builder URI
				builder_uri = body_type_part;
			}
			// If the part contains `://`
			else if ((body_type_part.indexOf('://') > -1)) {
				// Use the part as builder URI
				builder_uri = body_type_part;
			}
			// If the part not contains `://`
			else {
				// Use the part as protocol name
				builder_uri = body_type_part + '://';
			}

			return builder_uri;
		});

		// Each info has two keys:
		// - uri: Builder function URI.
		// - value: Builder function.
		var body_builder_infos = resolve_to_functions({
			uris: body_builder_uris,
			resolve: function (uri) {
				return resolve_on_meta({
					uri,
					data: null,
					meta,
					config,
					require: options.require,
					resolve: resolve_on_meta,
					load: true,
					is_meta_body_builder: true
				});
			}
		});

		var body_builder_input_data = meta.$$body_data;

		body_builder_infos.forEach(function (body_builder_info) {
			var body_builder_uri = body_builder_info.uri;

			msg = 'Body builder: ' + body_builder_uri;

			log(msg);

			var body_builder = body_builder_info.value;

			var body_builder_output_data = body_builder({
				uri: options.uri,
				data: body_builder_input_data,
				meta,
				config,
				log,
				require: options.require,
				resolve: resolve_on_meta,
				is_meta_body_builder: true
			});

			if (body_builder_output_data !== undefined) {
				// Use the output data as input data for the next round
				body_builder_input_data = body_builder_output_data;

				meta.$$body_data = body_builder_input_data;
			}
		});

		meta.$$body_data = body_builder_input_data;
	}

	if (options.config.METADATA_BUILDER_PRINT_META) {
		var meta_copy = merge.recursive({}, meta);

		delete meta_copy.$$head_data;
		delete meta_copy.$$body_data;

		var pretty_json = options.require('./tools/util/jsonutil')
			.pretty_json;

		assert(pretty_json);

		log(pretty_json(meta_copy));
	}

	return meta;
}


module.exports = metadata_builder;
