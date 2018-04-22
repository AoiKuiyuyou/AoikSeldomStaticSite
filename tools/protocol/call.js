//
'use strict';

var assert = require('assert');
var load_resolver = require('./load.js');


function resolve(options) {
	var func = load_resolver(options);

	assert(typeof func === 'function');

	var call_result = func();

	return call_result;
}


module.exports = resolve;
