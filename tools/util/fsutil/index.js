//
'use strict';

var fs = require('fs');


function file_exists(path) {
	try {
		fs.accessSync(path, fs.F_OK);

		return true;
	}
	catch (e) {
		return false;
	}
}


module.exports = {
	file_exists
};
