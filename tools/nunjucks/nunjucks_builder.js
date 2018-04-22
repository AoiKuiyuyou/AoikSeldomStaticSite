//
'use strict';

var assert = require('assert');
var path = require('path');
var merge = require('merge');
var nunjucks = require('nunjucks');
var fs = require('fs');
var base_context_factory = require('../basecontext').base_context_factory;


var CustomLoader = nunjucks.Loader.extend({
	init: function (options) {
		if (!(typeof options.resolve === 'function')) {
			var msg = 'Option `resolve` is not function: ' + options.resolve;

			throw Error(msg);
		}

		this._options = options;
	},

	getSource: function (uri) {
		if (!(typeof this._options.resolve === 'function')) {
			var msg = 'Option `resolve` is not function: ' +
				this._options.resolve;

			throw Error(msg);
		}

		var resolve = this._options.resolve;

		assert(resolve);

		var file_path = resolve({
			uri: uri
		});

		assert(typeof file_path === 'string');
		assert(path.isAbsolute(file_path));

		var file_data = fs.readFileSync(file_path, {
			encoding: 'utf8'
		});

		return {
			src: file_data,
			path: file_path
		};
	}
});


function nunjucks_builder(options) {
	var msg;

	if (!('data' in options)) {
		msg = 'Option `data` not given.';

		throw Error(msg);
	}

	if (!('meta' in options)) {
		msg = 'Option `meta` not given.';

		throw Error(msg);
	}

	if (!(typeof options.resolve === 'function')) {
		msg = 'Option `resolve` is not function: ' + options.resolve;

		throw Error(msg);
	}

	var nunjucks_env = new nunjucks.Environment(
		new CustomLoader(options), {
			throwOnUndefined: true,
			autoescape: false,
			trimBlocks: true,
			lstripBlocks: true
		}
	);

	var correct_line_number =
		options.require('./tools/protocol/_util').correct_line_number;

	var template_data = correct_line_number(options);

	var compiled_template = nunjucks.compile(
		template_data, nunjucks_env, options.uri
	);

	var base_context = base_context_factory();

	var merged_context = merge.recursive(base_context, options.meta);

	var rendered_data = compiled_template.render(merged_context);

	if (rendered_data === null) {
		msg = 'Rendering failed. May be caused by using an undefined value' +
			' in base templates. Nunjucks does not report errors in this' +
			' case.';

		throw Error(msg);
	}

	return rendered_data;
}


module.exports = nunjucks_builder;
