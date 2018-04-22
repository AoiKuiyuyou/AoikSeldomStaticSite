//
'use strict';

function resolve(options) {
	var markdown_builder = options.require(
		'./tools/markdown/markdown_builder.js'
	);

	function markdown_builder2(options2) {
		var msg;

		if (!('data' in options2)) {
			msg = 'Option `data` not given.';

			throw Error(msg);
		}

		return markdown_builder(options2.data);
	}

	return markdown_builder2;
}


module.exports = resolve;
