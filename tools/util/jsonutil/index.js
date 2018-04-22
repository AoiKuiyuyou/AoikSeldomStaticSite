//
'use strict';


function pretty_json(obj) {
	var cache = [];

	var string = JSON.stringify(obj, function (key, value) {
		if (typeof value === 'object' && value !== null) {
			if (cache.indexOf(value) !== -1) {
				// Circular reference found, discard key
				return undefined;
			}

			cache.push(value);
		}
		return value;
	}, 4);

	return string;
}


module.exports = {
	pretty_json
};
