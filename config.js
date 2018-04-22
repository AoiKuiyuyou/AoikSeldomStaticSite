//
'use strict';

var assert = require('assert');
var path_mod = require('path');


// The path must be absolute.
var PROJECT_DIR = path_mod.resolve(__dirname).replace(/\\/g, '/');

var CONFIG = {
	PROJECT_DIR: PROJECT_DIR,

	BUILD_DIR: PROJECT_DIR + '/build',

	// `npm` command path
	NPM_PATH: process.platform === 'win32' ? 'npm' : 'npm',

	LOGGER_URI: './tools/logging/logger',

	LIBS_INNER_SRC_GLOB: './src/libs_inner/**/*',

	LIBS_INNER_DEST_DIR: './build/libs_inner',

	// Outer libs are put outside `src` directory so that they are prevented
	// from showing in the editor.
	LIBS_OUTER_SRC_GLOB: './libs_outer/**/*',

	LIBS_OUTER_DEST_DIR: './build/libs_outer',

	PROTOCOL_RESOLVER_URI: './tools/protocol/all',

	METADATA_COLLECTOR_URI: './tools/metadata/metadata_collector.js',

	METADATA_GLOB: [
		'src/**/*_build?(.*([0-9])).md'
	],

	METADATA_BUILDER_URI: './tools/metadata/metadata_builder.js',

	METADATA_BUILDER_PRINT_META: false,

	BUILD_STAGE_DEFAULT: 50,

	SITE_ROOT: '/blog/',

	// Loaded items dict.
	// Keys are URIs.
	// Values are loaded items.
	loaded: {},

	'': ''
};

delete CONFIG[''];


function load(uri) {
	if (!((typeof uri === 'string') && uri)) {
		var msg = 'Argument `uri` is invalid: ' + uri;

		throw Error(msg);
	}

	if (uri in CONFIG.loaded) {
		return CONFIG.loaded[uri];
	}
	else {
		var loaded_item = require(uri);

		CONFIG.loaded[uri] = loaded_item;

		return loaded_item;
	}
}

CONFIG.load = load


module.exports = CONFIG;
