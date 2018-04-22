//
'use strict';


function resolve(options) {
	if (!options.self_base) {
		var msg = '`self_base` option is not specified for given URI: ' +
			options.uri;

		throw new Error(msg);
	}

	var obj = options.self_base;

	var property_keys = options.uri_body.split('.');

	property_keys.forEach(function (property_key) {
		if (obj === undefined || obj === null) {
			obj = undefined;
		}
		else {
			obj = obj[property_key];
		}
	});

	return obj;
}


module.exports = resolve;
