//
'use strict';

var assert = require('assert');
var glob = require('glob');
var path_mod = require('path');

/**
 * Topic: 76PGZ
 * Use glob pattern defined in config `METADATA_GLOB` to collect metadata file
 * paths.
 *
 * Divide these metadata file paths by the build stage number in their file
 * name. The build stage number is extracted from file name (excluding file
 * extension) using regular expression /([0-9])+$/. E.g.:
 * index.build.1.md -> 1
 * index.build.100.md -> 100
 * index.build.md -> 50 (default)
 *
 * Return a map.
 * Each item key is the build stage number.
 * Each item value is an array of metadata file paths for the build stage.
 * E.g.:
 * {
 *     1: ['_METADATA_FILE_PATH_', ...],
 *     ...
 *     9: ['_METADATA_FILE_PATH_', ...],
 * }
 */
function metadata_collector(options) {
	assert(options.config,
		'Error: Missing option `config`');

	var config = options.config;

	assert(options.log,
		'Error: Missing option `log`');

	var log = options.log;

	log('\n# ----- Find metadata file paths -----');

	assert(config.METADATA_GLOB);

	var glob_patterns = config.METADATA_GLOB instanceof Array ?
		config.METADATA_GLOB : [config.METADATA_GLOB];

	log('\n# ---- Glob patterns ----');

	log(glob_patterns);

	log('# ==== Glob patterns ====');

	var metadata_file_paths = Array.prototype.concat.apply([],
		glob_patterns.map(function (glob_pattern) {
			var paths = glob_pattern ? glob.sync(glob_pattern) : [];

			return paths;
		})
	);

	log('\n# ---- Found paths ----');

	log(metadata_file_paths);

	log('# ==== Found paths ====');

	log('# ===== Find metadata file paths =====');

	var map_build_stage_to_metadata_file_paths = {};

	var build_stage_default = config.BUILD_STAGE_DEFAULT;

	assert(typeof build_stage_default === 'number');

	metadata_file_paths.forEach(function (metadata_file_path) {
		var metadata_file_basename = path_mod.basename(
			metadata_file_path,
			path_mod.extname(metadata_file_path)
		);

		var stage_number_matcher = /([0-9])+$/.exec(metadata_file_basename);

		var stage_number = stage_number_matcher ?
			Number(stage_number_matcher[1]) : build_stage_default;

		var stage_metadata_file_paths =
			map_build_stage_to_metadata_file_paths[stage_number];

		if (!stage_metadata_file_paths) {
			stage_metadata_file_paths =
				map_build_stage_to_metadata_file_paths[stage_number] = [];
		}

		stage_metadata_file_paths.push(metadata_file_path);
	});

	return map_build_stage_to_metadata_file_paths;
}


module.exports = metadata_collector;
