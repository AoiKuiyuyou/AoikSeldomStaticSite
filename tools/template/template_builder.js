//
'use strict';

var assert = require('assert');
var fs = require('fs');


/**
 *  Load template specified in `options.meta.$template.file`.
 *  Load builder specified in `options.meta.$template.builder`.
 *  Call the loaded builder to compile the loaded template.
 *
 *  The design goal of this builder is to implement the template loading and
 *  then delegate to another builder. This way the delegate builder is kept
 *  simple.
 */
function template_builder(options) {
	var uri = options.uri;

	var msg;

	if (!(typeof uri === 'string' && uri)) {
		msg = 'Option `uri` is not non-empty string: ' + uri;

		throw Error(msg);
	}

	var meta = options.meta;

	if (!(typeof meta === 'object' && meta)) {
		msg = 'Option `meta` is not dict: ' + meta;

		throw Error(msg);
	}

	if (!meta.$template) {
		msg = 'Metadata property `$template` is not given.' +
			'\nMetadata file: ' + uri;

		throw Error(msg);
	}

	if (!meta.$template.builder) {
		msg = 'Metadata property `$template.builder` is not given.' +
			'\nMetadata file: ' + uri;

		throw Error(msg);
	}

	var config = options.config;

	if (!(typeof config === 'object' && config)) {
		msg = 'Option `config` is not dict: ' + config;

		throw Error(msg);
	}

	var log = options.log;

	if (!(typeof log === 'function')) {
		msg = 'Option `log` is not function: ' + log;

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

	var file_exists = options.require('./tools/util/fsutil').file_exists;
	var path_util = options.require('./tools/util/pathutil');

	if (!meta.$template.file) {
		msg = 'Error: Template file is not specified for URI: ' + uri;

		throw new Error(msg);
	}

	var metadata_file_dir = path_util.dir_abs(options.uri);

	var template_file_path = options.resolve({
		uri: meta.$template.file,
		self_base: meta,
		root_base: '.',
		path_base: metadata_file_dir,
		path_lead: './'
	});

	assert(template_file_path);

	template_file_path = path_util.path_abs(template_file_path);

	if (!file_exists(template_file_path)) {
		msg = `Error: Template file not exists: ${template_file_path}`;

		throw new Error(msg);
	}

	log('Template: ' + template_file_path);

	var template_content = fs.readFileSync(template_file_path, {
		encoding: 'utf8'
	});

	log('\n# ----- Load delegate template builder -----');

	log('Builder: ' + meta.$template.builder);

	var delegate_template_builder = options.resolve({
		uri: meta.$template.builder,
		self_base: meta,
		root_base: config.PROJECT_DIR,
		path_base: metadata_file_dir,
		path_lead: './',
		load: true
	});

	log('# ===== Load delegate template builder =====');

	log('\n# ----- Compile template -----');

	var built_data = delegate_template_builder({
		uri: template_file_path,
		data: template_content,
		meta: meta,
		config: options.config,
		require: options.require,
		resolve: options.resolve
	});

	log('# ===== Compile template =====');

	return built_data;
}


module.exports = template_builder;
