//
'use strict';


function resolve(options) {
	var template_builder = options.require(
		'./tools/template/template_builder.js');

	return template_builder;
}


module.exports = resolve;
