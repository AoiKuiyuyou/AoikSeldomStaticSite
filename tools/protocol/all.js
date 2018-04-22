//
'use strict';

var assert = require('assert');
var file_exists = require('../util/fsutil').file_exists;
var merge = require('merge');
var load_resolver = require('./load');
var ContinueResolve = require('./_util').ContinueResolve;


function resolve(options) {
	var uri = options.uri;

	assert(typeof uri === 'string', uri);

	if (!('resolve' in options)) {
		options.resolve = resolve;
	}

	var current_uri = uri;

	var resolved_value;

	var map_met_uri_to_true = {};

	while (true) {
		assert(typeof current_uri === 'string', current_uri);

		map_met_uri_to_true[current_uri] = true;

		// Match `(protocol_type)://(uri_body)`
		var protocol_matcher = /^(.+?):\/\/(.*)$/.exec(current_uri);

		// Get matched protocol, or use default protocol `path`
		var protocol = protocol_matcher ? protocol_matcher[1] : 'path';

		var uri_body = protocol_matcher ? protocol_matcher[2] : current_uri;

		assert(typeof uri_body === 'string', uri_body);

		var msg;

		var protocol_resolver_path_orig;

		var protocol_resolver_path = protocol_resolver_path_orig =
			(__dirname + '/' + protocol + '.js').replace(/\\/g, '/');

		// If not have resolver file.
		// It means the protocol module may be a directory instead.
		if (!file_exists(protocol_resolver_path)) {
			// Get the `protocol` directory's `index.js` file path
			protocol_resolver_path = (__dirname + '/' + protocol +
				' /index.js').replace(/\\/g, '/');
		}

		// If not have resolver file.
		// It means the protocol is not supported.
		if (!file_exists(protocol_resolver_path)) {
			msg = 'Unsupported URI: ' + uri;

			if (current_uri !== uri) {
				msg += '\nResolved to: ' + current_uri;
			}

			msg += '\nMissing resolver module: ' + protocol_resolver_path_orig;

			throw new Error(msg);
		}
		else {
			var resolver = require(protocol_resolver_path);

			assert(typeof resolver === 'function');

			var new_options = merge({}, options, {
				uri,
				uri_protocol: protocol,
				uri_body
			});

			resolved_value = resolver(new_options);

			if (!(resolved_value instanceof ContinueResolve)) {
				break;
			}
			else {
				current_uri = resolved_value.result;

				assert(typeof current_uri === 'string', current_uri);

				if (map_met_uri_to_true.hasOwnProperty(current_uri)) {
					msg = 'Circular resolution for URI: ' + uri;

					if (current_uri !== uri) {
						msg += '\nResolved to: ' + current_uri;
					}

					msg += '\nResolver: ' + protocol_resolver_path;

					throw Error(msg);
				}

				continue;
			}
		}
	}

	if (options.load) {
		if (typeof resolved_value === 'string') {
			return load_resolver({
				uri: resolved_value,
				config: options.config,
				log: options.log,
				require: options.require,
				resolve: options.resolve,
				uri_body: resolved_value,
				path_base: '!'
			});
		}
	}

	return resolved_value;
}


module.exports = resolve;
