//
'use strict';


/* eslint-disable quote-props */
var CONFIG = {
	env: {
		browser: true,
		es6: true,
		node: true
	},
	globals: {
		'undefined': false,
		'null': false,
		'$': true,
		'jQuery': true,
		'hljs': true,
		'Vue': true,
		'toastr': true
	},
	rules: {
		// ----- Comment -----

		// Disallow inline comments after code
		'no-inline-comments': 2,

		// Disallow usage of configurable warning terms in comments
		'no-warning-comments': 2,

		// ===== Comment =====

		// ----- Line length -----

		// Specify the maximum line length
		'max-len': [2, 79, 4,
			{
				ignoreComments: false,
				ignoreUrls: false
			}
		],

		// ===== Line length =====

		// ----- Indentation -----

		// Require uniform indentation style
		'indent': [0, 'tab',
			{
				'SwitchCase': 1,
				'VariableDeclarator': 1,
				'MemberExpression': 1
			}
		],

		// Disallow mixing of spaces and tabs for indentation
		'no-mixed-spaces-and-tabs': 2,

		// ===== Indentation =====

		// ----- Spacing -----

		// Disallow use of multiple spaces
		'no-multi-spaces': 2,

		// Disallow trailing whitespace at the end of lines
		'no-trailing-spaces': 2,

		// Disallow irregular whitespace outside of strings and comments
		'no-irregular-whitespace': 2,

		// Disallow spacing after function identifier
		'no-spaced-func': 0,

		// Require spacing before function opening parenthesis
		'space-before-function-paren': [2,
			{
				'anonymous': 'always',
				'named': 'never'
			}
		],

		// Require spacing inside parentheses
		'space-in-parens': [2, 'never'],

		// Require spacing before block opening curly brace
		'space-before-blocks': [2, 'always'],

		// Require spacing inside single line block's curly brace
		'block-spacing': [2, 'always'],

		// Require spacing around keywords
		'keyword-spacing': [2,
			{
				'before': true,
				'after': true
			}
		],

		// Require spacing inside array brackets
		'array-bracket-spacing': [2, 'never'],

		// Require spacing between keys and values in object properties
		'key-spacing': [2,
			{
				'beforeColon': false,
				'afterColon': true
			}
		],

		// Require spacing inside square brackets for computed property
		'computed-property-spacing': [2, 'never'],

		// Require spacing around infix operators
		'space-infix-ops': 2,

		// Require spacing around unary operators
		'space-unary-ops': 2,

		// Require spacing around the `*` in generator functions
		'generator-star-spacing': 2,

		// Require spacing before and after comma
		'comma-spacing': [2,
			{
				'before': false,
				'after': true
			}
		],

		// Require spacing around semicolons
		'semi-spacing': [2,
			{
				'before': false,
				'after': true
			}
		],

		// Require a space immediately following the `//` or `/*` in a comment
		'spaced-comment': 2,

		// Require line spacing inside object literal curly braces
		'object-curly-spacing': [2, 'never'],

		// Require line spacing inside blocks
		'padded-blocks': [2, 'never'],

		// Require an empty newline after `var` statement
		'newline-after-var': [2, 'always'],

		// Require consistent newlines before or after dots
		'dot-location': [2, 'property'],

		// Require consistent newlines before or after operators
		'operator-linebreak': [2, 'after'],

		// Require empty lines around comments
		'lines-around-comment': [2,
			{
				'beforeBlockComment': false,
				'beforeLineComment': false,
				'allowArrayStart': true,
				'allowObjectStart': true,
				'allowBlockStart': true
			}
		],

		// Disallow multiple empty lines
		'no-multiple-empty-lines': [2,
			{
				'max': 2,
				'maxEOF': 1
			}
		],

		// Require a single newline at the end of file
		'eol-last': 2,

		// Require uniform line-break style
		'linebreak-style': [2, 'unix'],

		// ===== Spacing =====

		// ----- Parentheses -----

		// Disallow unnecessary parentheses.
		//
		// This is allowed for readability.
		'no-extra-parens': 0,

		// Disallow the omission of parentheses when invoking a constructor
		'new-parens': 2,

		// ===== Parentheses =====

		// ----- Curly braces -----

		// Require curly braces for control statements
		'curly': [2, 'all'],

		// Require uniform curly braces style
		'brace-style': [2, 'stroustrup',
			{
				'allowSingleLine': false
			}
		],

		// Disallow unnecessary nested blocks
		'no-lone-blocks': 2,

		// Specify the maximum depth that blocks can be nested
		'max-depth': 0,

		// ===== Curly braces =====

		// ----- Comma -----

		// Require uniform comma style
		'comma-style': [2, 'last'],

		// Disallow trailing commas in object literals
		'comma-dangle': 2,

		// Disallow use of comma operator
		'no-sequences': 2,

		// ===== Comma =====

		// ----- Semicolon -----

		// Require use of semicolons instead of auto semicolon insertion
		'semi': [2, 'always'],

		// Disallow unnecessary semicolons
		'no-extra-semi': 2,

		// ===== Semicolon =====

		// ----- Quotes -----

		// Require quotes around object literal property names.
		//
		// `as-needed` means minimal.
		'quote-props': [2, 'as-needed'],

		// Require uniform single/double quotes style
		'quotes': [2, 'single'],

		// Require uniform single/double quotes style for JSX attributes
		'jsx-quotes': 0,

		// ===== Quotes =====

		// ----- Native entity -----

		// Disallow reassigning native identifiers
		'no-native-reassign': 2,

		// Disallow extending native types
		'no-extend-native': 2,

		// Disallow use of Math and JSON as functions
		'no-obj-calls': 2,

		// ===== Native entity =====

		// ----- Number -----

		// Disallow use of leading or trailing decimal points
		'no-floating-decimal': 2,

		// Disallow use of magic numbers
		'no-magic-numbers': 0,

		// Disallow use of octal literals
		'no-octal': 2,

		// Require use of the second argument for parseInt()
		'radix': 0,

		// ===== Number =====

		// ----- String -----

		// Disallow use of multi-line strings
		'no-multi-str': 2,

		// Suggest using template literals instead of strings concatenation
		'prefer-template': 0,

		// Disallow use of octal escape sequences in string literals
		'no-octal-escape': 2,

		// Disallow unnecessary concatenation of literals or template literals
		'no-useless-concat': 2,

		// Disallow use of `javascript:` urls.
		'no-script-url': 2,

		// Disallow string concatenation with `__dirname` and `__filename`
		'no-path-concat': 0,

		// ===== String =====

		// ----- Regular expression -----

		// Require regular expression literals to be wrapped in parentheses
		'wrap-regex': 0,

		// Disallow invalid regular expressions
		'no-invalid-regexp': 2,

		// Disallow control characters in regular expressions
		'no-control-regex': 2,

		// Disallow division operator at beginning of regular expression
		'no-div-regex': 2,

		// Disallow multiple spaces in a regular expression literal
		'no-regex-spaces': 2,

		// Disallow use of empty character classes in regular expressions
		'no-empty-character-class': 2,

		// ===== Regular expression =====

		// ----- Array -----

		// Suggest using spread operator instead of `.apply()`
		'prefer-spread': 0,

		// Disallow sparse arrays
		'no-sparse-arrays': 2,

		// Disallow use of Array constructor
		'no-array-constructor': 2,

		// ===== Array =====

		// ----- Object -----

		// Disallow duplicate keys in object literals
		'no-dupe-keys': 2,

		// Require use of dot notation whenever possible
		'dot-notation': 2,

		// Disallow use of `new Object()`
		'no-new-object': 2,

		// Require ES6 method and property shorthand syntax for object literals
		'object-shorthand': 0,

		// Disallow use of empty destructuring patterns
		'no-empty-pattern': 2,

		// Require getter/setter pairs in object literals
		'accessor-pairs': 0,

		// ===== Object =====

		// ----- Function -----

		// Specify the maximum number of parameters allowed for a function
		'max-params': 0,

		// Specify the maximum number of statements allowed for a function
		'max-statements': 0,

		// Require that all functions are run in strict mode
		'strict': 2,

		// Disallow duplicate arguments in functions
		'no-dupe-args': 2,

		// Disallow use of `arguments.caller` or `arguments.callee`
		'no-caller': 2,

		// Require function expressions to have a name
		'func-names': 0,

		// Require use of function declarations or expressions
		'func-style': [2, 'declaration'],

		// Require consistent return values
		'consistent-return': 2,

		// Disallow use of assignment in return statement
		'no-return-assign': 2,

		// Disallow creation of functions within loops
		'no-loop-func': 2,

		// Disallow unnecessary function binding
		'no-extra-bind': 2,

		// Disallow unnecessary `.call()` and `.apply()`
		'no-useless-call': 2,

		// Disallow redeclaring functions
		'no-func-assign': 2,

		// Disallow function or variable declarations in nested blocks
		'no-inner-declarations': [2, 'functions'],

		// Require immediate function invocation to be wrapped in parentheses
		'wrap-iife': 0,

		// Specify the maximum depth of nested callbacks
		'max-nested-callbacks': 0,

		// Require return after a callback
		'callback-return': 0,

		// Require error handling in callbacks (node environment)
		'handle-callback-err': 0,

		// ---- `this` ----

		// Require consistent `this`
		'consistent-this': 2,

		// Disallow `this` keywords outside of classes or class-like objects
		'no-invalid-this': 2,

		// ==== `this` ====

		// ===== Function =====

		// ----- Arrow function -----

		// Require parentheses in arrow function arguments
		'arrow-parens': [2, 'always'],

		// Require spacing around arrow function's arrow
		'arrow-spacing': 2,

		// Require braces arrow function body
		'arrow-body-style': 2,

		// Disallow arrow functions where a condition is expected
		'no-confusing-arrow': 2,

		// Suggest using arrow functions as callbacks
		'prefer-arrow-callback': 0,

		// ===== Arrow function =====

		// ----- `eval` function -----

		// Disallow use of eval
		'no-eval': 2,

		// Disallow use of eval-like methods
		'no-implied-eval': 2,

		// ===== `eval` function =====

		// ----- `require` function -----

		// Disallow `require` outside of the top-level module scope
		'global-require': 0,

		// Disallow use of new operator with the `require` function
		'no-new-require': 2,

		// Disallow mixing regular variable and require declarations
		'no-mixed-requires': 2,

		// Require sorted import declarations
		'sort-imports': 2,

		// ===== `require` function =====

		// ----- Class -----

		// Disallow redeclaring classes
		'no-class-assign': 2,

		// Require `super` calls in constructors
		'constructor-super': 2,

		// Disallow use of this/super before super calls in constructors
		'no-this-before-super': 2,

		// Disallow duplicate name in class members
		'no-dupe-class-members': 2,

		// ===== Class =====

		// ----- Generator -----
		//
		// Disallow generator functions that do not have yield
		'require-yield': 0,

		// ===== Generator =====

		// ----- Reflect -----

		// Suggest using `Reflect` methods
		'prefer-reflect': 0,

		// ===== Reflect =====

		// ----- Expression -----

		// Disallow negation of the left operand of an in expression
		'no-negated-in-lhs': 2,

		// Disallow extra boolean cast
		'no-extra-boolean-cast': 2,

		// Disallow usage of expressions in statement position
		'no-unused-expressions': 2,

		// Avoid code that looks like two expressions but is actually one
		'no-unexpected-multiline': 2,

		// ===== Expression =====

		// ----- Increment operator -----

		// Disallow use of unary operators `++` and `--`
		'no-plusplus': 0,

		// ===== Increment operator =====

		// ----- Bitwise operator -----

		// Disallow use of bitwise operators
		'no-bitwise': 2,

		// ===== Bitwise operator =====

		// ----- Ternary operator -----

		// Disallow use of ternary operators
		'no-ternary': 0,

		// Disallow use of Boolean literals in conditional expressions
		'no-unneeded-ternary': 2,

		// Disallow nested ternary expressions
		'no-nested-ternary': 0,

		// ===== Ternary operator =====

		// ----- Comparison operator -----

		// Require use of `===` and `!==`
		'eqeqeq': 2,

		// Disallow comparing with NaN
		'use-isnan': 2,

		// Disallow comparing with null
		'no-eq-null': 2,

		// Require comparing `typeof` result against a string
		'valid-typeof': 2,

		// Disallow comparing identical values
		'no-self-compare': 2,

		// ===== Comparison operator =====

		// ----- Assignment operator -----

		// Disallow assignment in conditional expressions
		'no-cond-assign': 2,

		// Require augmented assignment operator
		'operator-assignment': [2, 'always'],

		// ===== Assignment operator =====

		// ----- `new` operator -----

		// Disallow use of new operator for Function object
		'no-new-func': 2,

		// Disallow creating new instances of String, Number, and Boolean
		'no-new-wrappers': 2,

		// Disallow use of new operator when not for assignment or comparison
		'no-new': 2,

		// ===== `new` operator =====

		// ----- `void` operator -----

		// Disallow use of void operator
		'no-void': 2,

		// ===== `void` operator =====

		// ----- Type coercion -----

		// Disallow implicit type coercion
		'no-implicit-coercion': 2,

		// ===== Type coercion =====

		// ----- Condition -----

		// Require Yoda conditions
		'yoda': 0,

		// Disallow use of `continue` statement
		'no-continue': 0,

		// Require for-in loops to check `hasOwnProperty`
		'guard-for-in': 2,

		// Disallow `if` as the only statement in an else block
		'no-lonely-if': 0,

		// Disallow else after a return in an if
		'no-else-return': 0,

		// Disallow unreachable statements
		'no-unreachable': 2,

		// Disallow negated conditions.
		//
		// This is allowed because when a negated condition's body block is
		// way shorter than the non-negated condition's body block, sometimes
		// it is preferable to put the negated condition first.
		'no-negated-condition': 0,

		// Disallow use of constant expressions in conditions
		'no-constant-condition': 0,

		// ---- switch ----

		// Require default switch case
		'default-case': 2,

		// Disallow fall-through of switch cases
		'no-fallthrough': 2,

		// Disallow duplicate switch cases
		'no-duplicate-case': 2,

		// Require switch case blocks
		'no-case-declarations': 2,

		// ==== switch ====

		// ===== Condition =====

		// ----- Statement -----

		// Disallow empty statements
		'no-empty': 2,

		// ===== Statement =====

		// ----- `label` statement -----

		// Disallow use of labeled statements
		'no-labels': 2,

		// Disallow labels that share a name with a variable
		'no-label-var': 2,

		// ===== `label` statement =====

		// ----- `with` statement -----

		// Disallow use of `with` statement
		'no-with': 2,

		// ===== `with` statement =====

		// ----- Variable ------

		// Require `let` or `const` instead of `var`
		'no-var': 0,

		// Suggest using `const` instead of `var`
		'prefer-const': 0,

		// Disallow reassigning `const` variables
		'no-const-assign': 2,

		// Disallow reassigning function parameters
		'no-param-reassign': 0,

		// Disallow reassigning exception variable
		'no-ex-assign': 2,

		// Disallow redeclaring variable
		'no-redeclare': 2,

		// Disallow use of `undefined`
		'no-undefined': 0,

		// Disallow use of `undefined` when initializing variables
		'no-undef-init': 2,

		// Disallow use of undeclared variables
		'no-undef': 2,

		// Disallow declared but unused variables
		'no-unused-vars': [2, {
			'args': 'none'
		}],

		// Disallow use of variables declared after the point of use
		'no-use-before-define': 2,

		// Require variable initializations at declaration
		'init-declarations': 0,

		// Require there is only one var statement per function
		'one-var': 0,

		// Require to declare all variables on top of their containing scope
		'vars-on-top': 0,

		// Require variable statements as if they were block scoped
		'block-scoped-var': 2,

		// Sort variable declarations within the same block
		'sort-vars': 0,

		// Disallow deletion of variables
		'no-delete-var': 2,

		// ===== Variable =====

		// ----- Naming convention -----

		// Require camelCase names
		'camelcase': 0,

		// Require minimum and maximum identifier lengths
		'id-length': 0,

		// Require identifiers to match the specified regular expression
		'id-match': 0,

		// Require a capital letter for constructors
		'new-cap': 2,

		// Disallow starting or ending underscores in identifiers
		'no-underscore-dangle': 0,

		// ===== Naming convention =====

		// ----- Name shadowing -----

		// Disallow inter scope variables shadowing outer scope variables
		'no-shadow': 2,

		// Disallow exception variables shadowing outer scope variables
		'no-catch-shadow': 2,

		// Disallow variables shadowing restricted names like Infinity
		'no-shadow-restricted-names': 2,

		// ===== Name shadowing =====

		// ----- Error -----

		// restrict what can be thrown as an exception
		'no-throw-literal': 2,

		// ===== Error =====

		// ----- Restriction -----

		// Disallow use of `alert`
		'no-alert': 2,

		// Disallow use of `console`
		'no-console': 0,

		// Disallow use of debugger
		'no-debugger': 2,

		// Disallow use of `process.exit`
		'no-process-exit': 2,

		// Disallow use of `process.env`
		'no-process-env': 0,

		// Disallow use of synchronous methods
		'no-sync': 0,

		// Disallow use of specified node modules
		'no-restricted-modules': 0,

		// Disallow use of `__proto__` property
		'no-proto': 2,

		// Disallow use of `__iterator__` property
		'no-iterator': 2,

		// Disallow use of certain syntax in code
		'no-restricted-syntax': 0,

		// ===== Restriction =====

		// ----- Complexity -----

		// The maximum complexity allowed in a program
		'complexity': 0,

		// ===== Complexity =====

		// ----- Documentation -----

		// Require JSDoc comment
		'require-jsdoc': 0,

		// Require JSDoc comments are valid
		'valid-jsdoc': 0,

		// ===== Documentation =====

		// This entry aims for other entries to always end with comma.
		// This entry will be deleted below.
		'': null
	}
};
/* eslint-enable*/

delete CONFIG.rules[''];

module.exports = CONFIG;
