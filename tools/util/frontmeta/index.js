//
'use strict';

// '^', // Input start.
// '\\ufeff?', // BOM, optional.
// '(', // Group 1.
// '(', // Group 2.
// '-{3,}', // Front block start delimiter, three-or-more `-`.
// 	// The start delimiter must appear at input start,
// 	// except for an optional BOM before it.
// ')', // Group 2 end.
// '[ \t]*', // Space or tab, zero-or-more.
// '(', // Group 3.
// '.*?', // Head type. Optional. Can have spaces.
// ')', // Group 3 end.
// '[ \t]*', // Space or tab, zero-or-more.
// '\\r?\\n', // Newline after the start delimiter.
// '(', // Group 4.
// '[\\s\\S]*?', // Match content inside the front block.
// 	// Any characters, zero-or-more, non-greedy.
// ')', // Group 4 end.
// '\\r?\\n', // Newline before the end delimiter.
// '\\2', // Front block end delimiter, same value as the start
// 	// delimiter.
// '[ \t]*', // Space or tab, zero-or-more.
// '(', // Group 5.
// '.*?', // Body type. Optional. Can have spaces.
// ')', // Group 5 end.
// '[ \t]*', // Space or tab, zero-or-more.
// ')', // Group 1 end.
// '(?:', // Group -1
// '$', // Input end.
// '|', // Group -1 OR.
// '\\r?\\n', // Newline after the end delimiter.
// ')', // Group -1 end.
// '(', // Group 6.
// '[\\s\\S]*', // Any characters.
// ')', // Group 6 end.
// '$', // Input end.
var FRONTMETA_REGEXP = new RegExp(
	[
		'^',
		'\\ufeff?',
		'(',
		'(',
		'-{3,}',
		')',
		'[ \t]*',
		'(',
		'.*?',
		')',
		'[ \t]*',
		'\\r?\\n',
		'(',
		'[\\s\\S]*?',
		')',
		'\\r?\\n',
		'\\2',
		'[ \t]*',
		'(',
		'.*?',
		')',
		'[ \t]*',
		')',
		'(?:',
		'$',
		'|',
		'\\r?\\n',
		')',
		'(',
		'[\\s\\S]*',
		')',
		'$',
		''
	].join('')
);


function parse_frontmeta(input_string) {
	var frontmeta_matcher = FRONTMETA_REGEXP.exec(input_string);

	var parsed_result = frontmeta_matcher ? {
		front_data: frontmeta_matcher[1],
		delimiter: frontmeta_matcher[2],
		head_type: frontmeta_matcher[3],
		head_data: frontmeta_matcher[4],
		body_type: frontmeta_matcher[5],
		// Normalize null to empty string
		body_data: frontmeta_matcher[6] || ''
	} : {
		front_data: null,
		delimiter: null,
		head_type: null,
		head_data: null,
		body_type: null,
		body_data: input_string
	};

	return parsed_result;
}


module.exports = {
	parse_frontmeta
};
