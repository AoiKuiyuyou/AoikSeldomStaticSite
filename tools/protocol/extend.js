//
'use strict';

var merge = require('merge');


function resolve(options) {
	if (!('uri_body' in options)) {
		var msg = 'Option `uri_body` not given.';

		throw Error(msg);
	}

	var base_dict_resolve_options = merge.recursive({}, options, {
		uri: options.uri_body,
		load: true
	});

	var base_dict = options.resolve(base_dict_resolve_options);

	function extend_data(options2) {
		if (!('data' in options2)) {
			var msg2 = 'Option `data` not given.';

			throw Error(msg2);
		}

		return merge.recursive({}, base_dict, options2.data);
	}

	return extend_data;
}


module.exports = resolve;
