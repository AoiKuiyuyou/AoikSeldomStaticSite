//
'use strict';

var assert = require('assert');
var fs = require('fs');
var mkdirp = require('mkdirp');


function resolve(optionsOuter) {
	var msg;

	function output_func(options) {
		if (!('data' in options)) {
			msg = 'Option `data` not given.';

			throw Error(msg);
		}

		if (!('meta' in options)) {
			msg = 'Option `meta` not given.';

			throw Error(msg);
		}

		if (!('config' in options)) {
			msg = 'Option `config` not given.';

			throw Error(msg);
		}

		if (!('require' in options)) {
			msg = 'Option `require` not given.';

			throw Error(msg);
		}

		if (!('resolve' in options)) {
			msg = 'Option `resolve` not given.';

			throw Error(msg);
		}

		var config = options.config;

		assert(config);

		assert(options.require);

		var log = options.log;

		var path_util = options.require('./tools/util/pathutil');

		assert(options.meta);

		var meta = options.meta;

		var output_uri = meta.$output;

		log('\n# ----- Output -----');

		if (output_uri) {
			var output_file_path = options.resolve({
				uri: output_uri
			});

			log('File: ' + output_file_path);

			var output_dir_path = path_util.dir_abs(output_file_path);

			mkdirp.sync(output_dir_path);

			fs.writeFileSync(output_file_path, options.data);
		}

		log('# ===== Output =====');
	}

	return output_func;
}


module.exports = resolve;
