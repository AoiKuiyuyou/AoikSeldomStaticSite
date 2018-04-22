//
'use strict';

var assert = require('assert');
var path = require('path');
var merge = require('merge');
var querystring = require('querystring');


/**
 * The chroot protocol changes path prefix, e.g.:
 * `chroot://path=src/some_dir/some_file&from=src&to=build` changes from
 * `src/some_dir/some_file` to `build/some_dir/some_file`.
 *
 * Argument `from`'s value should be an ancestor directory path of argument
 * `path`'s value.
 *
 * The value of arguments `path`, `from`, and `to` are resolved too, which
 * means protocols can be used in the value, e.g.:
 * chroot://path=some_file&from=root://src&to=root://build
 */
function resolve(options) {
	var resolve_all = options.resolve;

	assert(resolve_all);

	var args = querystring.parse(options.uri_body);

	var orig_path = args.path;

	var msg;

	if (!orig_path) {
		msg = 'Error: Argument `path` not given: ' + options.uri;

		throw new Error(msg);
	}

	var new_options = merge.recursive({}, options, {
		uri: orig_path
	});

	orig_path = resolve_all(new_options);

	assert(typeof orig_path === 'string');

	var from_base = args.from;

	if (!from_base) {
		msg = 'Error: Argument `from` not given: ' + options.uri;

		throw new Error(msg);
	}

	new_options = merge.recursive({}, options, {
		uri: from_base
	});

	from_base = resolve_all(new_options);

	assert(typeof from_base === 'string');

	var to_base = args.to;

	if (!to_base) {
		msg = 'Error: Argument `to` not given: ' + options.uri;

		throw new Error(msg);
	}

	new_options = merge.recursive({}, options, {
		uri: to_base
	});

	to_base = resolve_all(new_options);

	assert(typeof to_base === 'string');

	var dst_path = path.resolve(to_base, path.relative(from_base, orig_path))
		.replace(/\\/g, '/');

	return dst_path;
}


module.exports = resolve;
