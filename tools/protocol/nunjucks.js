//
'use strict';


function resolve(options) {
	var nunjucks_builder = options.require(
		'./tools/nunjucks/nunjucks_builder.js');

	return nunjucks_builder;
}


module.exports = resolve;
