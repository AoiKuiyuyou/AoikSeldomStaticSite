//
'use strict';


function ContinueResolve(result) {
	if (!(this instanceof ContinueResolve)) {
		return new ContinueResolve(result);
	}
	else {
		this.result = result;
	}
}


function correct_line_number(options) {
	var msg;

	if (!('data' in options)) {
		msg = 'Option `data` not given.';

		throw Error(msg);
	}

	if (!('meta' in options)) {
		msg = 'Option `meta` not given.';

		throw Error(msg);
	}

	var data = options.data;

	var head_data = options.meta.$$head_data;

	if (options.is_meta_head_builder) {
		if (typeof head_data === 'string') {
			// Add empty lines to correct the line number reported in error
			// message.
			//
			// One newline is for the start delimiter line `---` of the head
			// section.
			//
			data = '\n' + data;
		}
	}
	else if (options.is_meta_body_builder) {
		if (typeof head_data === 'string') {
			var head_section_lines_count = head_data.split('\n').length;

			if (head_section_lines_count > 0) {
				// 1 of `+ 3` is due to using `join`. Another 2 of `+ 3` is
				// for the start delimiter line `---` of the body section.
				var head_section_newlines =
					Array(head_section_lines_count + 3).join('\n');

				// Add empty lines to correct the line number reported in error
				// message
				data = head_section_newlines + data;
			}
		}
	}

	return data;
}


function resolve_resursive(options) {
	var uris = options.uris;

	var resolve = options.resolve;

	var is_end = options.is_end;

	var reverse_uris = [];

	var uris_count = uris.length;

	var uri;

	for (var index = uris_count - 1; index > -1; --index) {
		uri = uris[index];

		if (uri) {
			reverse_uris.push(uri);
		}
	}

	var infos = [];

	while (reverse_uris.length > 0) {
		uri = reverse_uris.pop();

		var resolved_value = resolve(uri);

		if (is_end(resolved_value)) {
			infos.push({
				uri,
				value: resolved_value
			});
		}
		else {
			if (typeof resolved_value === 'string') {
				uris.push(resolved_value);
			}
			else if (Array.isArray(resolved_value)) {
				resolved_value.forEach(function (item) {
					uris.push(item);
				});
			}
			else {
				var msg = 'URI resolved to invalid value.' +
					'\nURI: ' + uri +
					'\nInvalid value: ' + resolved_value;

				throw Error(msg);
			}
		}
	}

	return infos;
}


function resolve_to_functions(options) {
	function is_end(item) {
		return (typeof item === 'function');
	}

	return resolve_resursive({
		uris: options.uris,
		resolve: options.resolve,
		is_end: is_end
	});
}


module.exports = {
	ContinueResolve,
	resolve_to_functions,
	correct_line_number
};
