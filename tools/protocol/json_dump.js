//
'use strict';


function resolve(optionsOuter) {
	function dump_json(options) {
		if (!('data' in options)) {
			var msg = 'Option `data` not given.';

			throw Error(msg);
		}

		return JSON.stringify(options.data, null, '\t') + '\n';
	}

	return dump_json;
}


module.exports = resolve;
