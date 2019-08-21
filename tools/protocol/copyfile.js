//
'use strict';

var assert = require('assert');
var fs = require('fs');
var mkdirp = require('mkdirp');
var fsextra = require('fs-extra');


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

		if (!('require' in options)) {
			msg = 'Option `require` not given.';

			throw Error(msg);
		}

		if (!('resolve' in options)) {
			msg = 'Option `resolve` not given.';

			throw Error(msg);
		}

		assert(options.require);

		var log = options.log;

		var path_util = options.require('./tools/util/pathutil');

		assert(options.meta);

		var meta = options.meta;

		var copy_info = meta.$copyfile;

		log('\n# ----- Copyfile -----');

		var src_path = options.resolve({
			uri: copy_info.src
		});

		var dst_path = options.resolve({
			uri: copy_info.dst
		});

		log('From: ' + src_path);

		log('To: ' + dst_path);

		var output_dir_path = path_util.dir_abs(dst_path);

		mkdirp.sync(output_dir_path);

		fsextra.copySync(src_path, dst_path);

		log('# ===== Copyfile =====');
	}

	return output_func;
}


module.exports = resolve;
