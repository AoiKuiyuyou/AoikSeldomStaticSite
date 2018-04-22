//
'use strict';

var yaml = require('js-yaml');


function resolve(options) {
	function dump_yaml(options2) {
		if (!('data' in options2)) {
			var msg = 'Option `data` not given.';

			throw Error(msg);
		}

		return yaml.safeDump(options2.data, {
			lineWidth: 10000
		});
	}

	return dump_yaml;
}


module.exports = resolve;
