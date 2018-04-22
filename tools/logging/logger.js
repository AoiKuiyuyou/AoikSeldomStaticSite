//
'use strict';


function logger() {
	console.log.apply(console, arguments);
}

logger.debug = logger;

logger.info = logger;

logger.error = logger;


module.exports = logger;
