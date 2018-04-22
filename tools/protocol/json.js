//
'use strict';

var json5 = require('json5');
var correct_line_number = require('./_util').correct_line_number;


function resolve(optionsOuter) {
	function load_json(options) {
		if (!('data' in options)) {
			var msg = 'Option `data` not given.';

			throw Error(msg);
		}

		var jsonData = correct_line_number(options);

		return json5.parse(jsonData);
	}

	return load_json;
}


module.exports = resolve;
