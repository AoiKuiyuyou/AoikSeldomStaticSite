//
'use strict';

var marked = require('marked');


marked.setOptions({
	gfm: true,
	langPrefix: '',
	tables: true,
	breaks: false,
	pedantic: false,
	sanitize: false,
	smartLists: true,
	smartypants: false
});

var renderer = new marked.Renderer();

var ANCHOR_SVG =
	'<svg aria-hidden="true" class="octicon octicon-link" height="16"' +
	' version="1.1" viewBox="0 0 16 16" width="16"><path d="M4 9h1v1H4c-1.5' +
	' 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2' +
	' 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2' +
	' 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98' +
	' 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6' +
	' 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>';


renderer.heading = function (text, level) {
	var hash_title = text.toLowerCase().replace(/[^\w]+/g, '-');

	var html;

	if (level === 1) {
		html = `<h${level} id="${hash_title}">${text}</h${level}>`;
	}
	else {
		html =
			'<h' + level + ' id="' + hash_title + '">' +
			'<a class="anchor" href="#' + hash_title + '">' +
			ANCHOR_SVG + ' </a>' + text + '</h' + level + '>';
	}

	return html;
};


function markdown_builder(data) {
	var result_data = marked(data, {
		renderer
	});

	return result_data;
}


module.exports = markdown_builder;
