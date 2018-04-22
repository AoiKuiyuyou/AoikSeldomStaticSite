//
'use strict';

var yaml = require('js-yaml');
var correct_line_number = require('./_util').correct_line_number;


function resolve(options) {
	function load_yaml(options2) {
		var msg;

		if (!('uri' in options2)) {
			msg = 'Option `uri` not given.';

			throw Error(msg);
		}

		if (!('data' in options2)) {
			msg = 'Option `data` not given.';

			throw Error(msg);
		}

		if (!('meta' in options2)) {
			msg = 'Option `meta` not given.';

			throw Error(msg);
		}

		var yaml_data = correct_line_number(options2);

		return yaml.safeLoad(yaml_data, {
			filename: options2.uri
		});
	}

	return load_yaml;
}


module.exports = resolve;
