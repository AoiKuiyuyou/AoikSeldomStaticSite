//
'use strict';

var merge = require('merge');


function resolve(optionsOuter) {
	// Substitution protocol resolver that resolves the data dict's item values
	// that start with `ss://` to new values. The URI body after `ss://` should
	// be another protocol URI that resolves to the new value.

	function builder(options) {
		var data_dict = options.data;

		if (!(typeof data_dict === 'object' && data_dict)) {
			var msg = 'Option `data` is not dict: ' + data_dict;

			throw Error(msg);
		}

		var boiler = options.require('./tools/util/boiler/boiler');

		boiler._.deep(data_dict,
			function (depth, item_key, item_value, collection) {
				if (typeof item_value === 'string') {
					// If the item value starts with `ss://`
					if (item_value.lastIndexOf('ss://', 0) === 0) {
						var uri_body = item_value.substring(5);

						var new_options = merge.recursive({}, options, {
							uri: uri_body,
							load: false
						});

						var resolved_value = options.resolve(new_options);

						collection[item_key] = resolved_value;
					}
				}
			});
	}

	return builder;
}


module.exports = resolve;
