//
'use strict';

var assert = require('assert');
var fs = require('fs');
var path_mod = require('path');


var gulp;

try {
	gulp = require('gulp');
}
catch (ex) {
	var error_msg =
		'Error: Packages are not installed. Please run `npm install`.';

	console.log(error_msg);

	/* eslint-disable no-process-exit */
	process.exit(1);
	/* eslint-enable*/
}


var CONFIG = require('./config.js');

assert(CONFIG.PROJECT_DIR, 'Error: Missing config `PROJECT_DIR`');
assert(path_mod.isAbsolute(CONFIG.PROJECT_DIR));


assert(CONFIG.LOGGER_URI, 'Error: Missing config `LOGGER_URI`');

var log = CONFIG.load(CONFIG.LOGGER_URI);

log('\n# ----- Load config -----');
log(CONFIG);
log('# ===== Load config =====');

// Log
log('\n# ----- Load logger -----');
log('URI: ' + CONFIG.LOGGER_URI);
log('# ===== Load logger =====');


function to_json(obj) {
	return JSON.stringify(obj, null, '\t') + '\n';
}


/**
 * Compile `package.src.json` to `package.json`.
 */
gulp.task('compile_package_src_json', function () {
	var json5 = require('json5');
	var gulp_changed = require('gulp-changed');
	var gulp_rename = require('gulp-rename');
	var gulp_util = require('gulp-util');
	var del = require('del');

	var file_exists = require('./tools/util/fsutil').file_exists;

	assert(file_exists);

	var make_stream = require('./tools/util/streamutil').make_stream;

	assert(make_stream);

	var changed_dir = './changed_cache/compile_package_src_json';

	var stream = gulp.src('package.src.json')
		.pipe(
			file_exists('./package.json') ?
			gulp_changed(changed_dir) :
			make_stream()
		)
		.pipe(gulp.dest(changed_dir))
		.pipe(make_stream(function (file) {
			log('Compile: ' + file.path);
		}))
		.pipe(make_stream(function (file) {
			try {
				var obj = json5.parse(file.contents);
				var json_text = to_json(obj);

				file.contents = new Buffer(json_text);
			}
			catch (err) {
				del.sync(changed_dir + '/package.src.json');

				throw new gulp_util.PluginError(
					'[compile_package_src_json]', err
				);
			}
		}))
		.pipe(gulp_rename('package.json'))
		.pipe(gulp.dest('.'));

	return stream;
});


/**
 * Install dependency packages.
 */
gulp.task('npm_install', gulp.series('compile_package_src_json', function () {
	var gulp_changed = require('gulp-changed');
	var gulp_shell = require('gulp-shell');
	var gulp_util = require('gulp-util');
	var del = require('del');

	var make_stream = require('./tools/util/streamutil').make_stream;

	assert(make_stream);

	var changed_dir = './changed_cache/npm_install';

	var cmd = [CONFIG.NPM_PATH, 'install'].join(' ');

	var stream = gulp.src('package.json')
		.pipe(gulp_changed(changed_dir))
		.pipe(make_stream(function () {
			log('`package.json` has changes.');
		}))
		.pipe(gulp_shell(cmd, {
			verbose: true
		})).on('error', function (err) {
			del.sync('./changed_cache/package.json');

			throw new gulp_util.PluginError(
				'[npm_install]', err
			);
		})
		.pipe(gulp.dest(changed_dir));

	return stream;
}));


/**
 * Copy inner libs to build directory.
 */
gulp.task('copy_libs_inner', gulp.series('npm_install', function () {
	assert(CONFIG.LIBS_INNER_SRC_GLOB,
		'Error: Missing config `LIBS_INNER_SRC_GLOB`');

	assert(CONFIG.LIBS_INNER_DEST_DIR,
		'Error: Missing config `LIBS_INNER_DEST_DIR`');

	var stream = gulp.src(CONFIG.LIBS_INNER_SRC_GLOB)
		.pipe(gulp.dest(CONFIG.LIBS_INNER_DEST_DIR));

	return stream;
}));


/**
 * Copy outer libs to build directory.
 */
gulp.task('copy_libs_outer', gulp.series('npm_install', function () {
	assert(CONFIG.LIBS_OUTER_SRC_GLOB,
		'Error: Missing config `LIBS_OUTER_SRC_GLOB`');

	assert(CONFIG.LIBS_OUTER_DEST_DIR,
		'Error: Missing config `LIBS_OUTER_DEST_DIR`');

	var stream = gulp.src(CONFIG.LIBS_OUTER_SRC_GLOB)
		.pipe(gulp.dest(CONFIG.LIBS_OUTER_DEST_DIR));

	return stream;
}));


/**
 * Build from metadata files.
 */
gulp.task('build_from_metadata', gulp.series('npm_install', function (done) {
	var path_util = require('./tools/util/pathutil');
	var path_abs = path_util.path_abs;

	assert(path_abs);

	log('\n# ----- Load metadata URIs collector -----');

	assert(CONFIG.METADATA_COLLECTOR_URI,
		'Error: Missing config `METADATA_COLLECTOR_URI`');

	var metadata_collector = CONFIG.load(CONFIG.METADATA_COLLECTOR_URI);

	log('\n# ===== Load metadata URIs collector =====');

	assert(
		typeof metadata_collector === 'function',
		typeof metadata_collector
	);

	// See topic 76PGZ for the data structure.
	var map_build_stage_to_metadata_uris = metadata_collector({
		config: CONFIG,
		log
	});

	log('\n# ----- Load metadata builder -----');

	assert(CONFIG.METADATA_BUILDER_URI,
		'Error: Missing config `METADATA_BUILDER_URI`');

	log('URI: ' + CONFIG.METADATA_BUILDER_URI);

	var metadata_builder = CONFIG.load(CONFIG.METADATA_BUILDER_URI);

	log('# ===== Load metadata builder =====');

	assert(
		typeof metadata_builder === 'function',
		typeof metadata_builder
	);

	var build_stages = Object.keys(map_build_stage_to_metadata_uris);

	build_stages.sort();

	build_stages.forEach(function (build_stage) {
		log(`\n# ----- Build stage ${build_stage} -----`);

		var metadata_uris = map_build_stage_to_metadata_uris[build_stage];

		metadata_uris.forEach(function (metadata_uri) {
			log('\n# ----- Read metadata file -----');

			metadata_uri = path_abs(metadata_uri);

			log('File: ' + metadata_uri);

			var metadata_content = fs.readFileSync(metadata_uri, {
				encoding: 'utf8'
			});

			log('# ===== Read metadata file =====');

			log('\n# ----- Build metadata -----');

			log('File: ' + metadata_uri);

			metadata_builder({
				uri: metadata_uri,
				data: metadata_content,
				config: CONFIG,
				log,
				require
			});

			log('# ===== Parse metadata =====');
		});

		log(`# ===== Build stage ${build_stage} =====`);
	});

	done();
}));


/**
 * Clean build directory.
 */
gulp.task('clean', function (done) {
	log('\n# ----- Clean build directory -----');

	var del = require('del');

	del.sync([
		CONFIG.RELEASE_DIR + '/**/*'
	]);

	log('# ===== Clean build directory =====');

	done();
});


/**
 * Tidy JS files.
 */
gulp.task('tidy_js', function () {
	var gulp_jsbeautifier = require('gulp-jsbeautifier');
	var make_stream = require('./tools/util/streamutil').make_stream;

	var stream = gulp.src(
			[
				'./gulpfile.js',
				'./src/**/*.js',
				'./tools/**/*.js',
				'!./tools/util/boiler/boiler.js'
			], {
				base: './'
			}
		).pipe(make_stream(function (file) {
			log('File: ' + file.path);
		}))
		.pipe(gulp_jsbeautifier({
			config: './tools/jsbeautifier/config.json'
		}))
		.pipe(gulp.dest('./'));

	return stream;
});


/**
 * Lint JS files.
 */
gulp.task('lint_js', gulp.series('npm_install', function () {
	var gulp_eslint = require('gulp-eslint');

	var base_dir = './';

	var stream = gulp.src(
			[
				'./gulpfile.js',
				'./src/**/*.js',
				'./tools/**/*.js',
				'!./tools/util/boiler/boiler.js'
			], {
				base: base_dir
			}
		)
		.pipe(gulp_eslint({
			configFile: './tools/eslint/config.js',
			fix: false
		}))
		.pipe(gulp.dest(base_dir))
		.pipe(gulp_eslint.format())
		.pipe(gulp_eslint.failAfterError());

	return stream;
}));


/**
 * Tidy JSON files.
 */
gulp.task('tidy_json', gulp.series('npm_install', function () {
	var gulp_changed = require('gulp-changed');
	var make_stream = require('./tools/util/streamutil').make_stream;

	function tidy(file) {
		var obj = JSON.parse(file.contents);

		var json_text = to_json(obj);

		file.contents = new Buffer(json_text);
	}

	var base_dir = './';

	var changed_dir = './changed_cache/tidy_json';

	var stream = gulp.src(
			[
				'./src/**/*.json',
				'./tools/**/*.json'
			], {
				base: base_dir
			}
		)
		.pipe(gulp_changed(changed_dir, {
			hasChanged: gulp_changed.compareContents
		}))
		.pipe(make_stream(function (file) {
			log('File: ' + file.path);
		}))
		.pipe(make_stream(tidy))
		.pipe(gulp.dest(base_dir))
		.pipe(gulp.dest(changed_dir));

	return stream;
}));


/**
 * Add vendor prefixes to CSS properties.
 */
gulp.task('prefix_css', gulp.series('npm_install', function () {
	var gulp_autoprefixer = require('gulp-autoprefixer');
	var gulp_changed = require('gulp-changed');
	var make_stream = require('./tools/util/streamutil').make_stream;

	var cssautoprefixer_config = require(
		'./tools/cssautoprefixer/config.json');

	var base_dir = './';

	var changed_dir = './changed_cache/prefix_css';

	var stream = gulp.src(
			[
				'./src/**/*.css',
				'./tools/**/*.css'
			], {
				base: base_dir
			}
		)
		.pipe(gulp_changed(changed_dir, {
			hasChanged: gulp_changed.compareContents
		}))
		.pipe(make_stream(function (file) {
			log('File: ' + file.path);
		}))
		.pipe(gulp_autoprefixer(cssautoprefixer_config))
		.pipe(gulp.dest(base_dir))
		.pipe(gulp.dest(changed_dir));

	return stream;
}));


/**
 * Tidy CSS files.
 */
gulp.task('tidy_css', gulp.series('npm_install', 'prefix_css', function () {
	var gulp_changed = require('gulp-changed');
	var make_stream = require('./tools/util/streamutil').make_stream;
	var gulp_csscomb = require('gulp-csscomb');
	var path_abs = require('./tools/util/pathutil').path_abs;

	var base_dir = './';

	var changed_dir = './changed_cache/tidy_css';

	var stream = gulp.src(
			[
				'./src/**/*.css',
				'./tools/**/*.css'
			], {
				base: base_dir
			}
		)
		.pipe(gulp_changed(changed_dir, {
			hasChanged: gulp_changed.compareContents
		}))
		.pipe(make_stream(function (file) {
			log('File: ' + file.path);
		}))
		.pipe(gulp_csscomb({
			configPath: path_abs('./tools/csscomb/config.json')
		}))
		.pipe(gulp.dest(base_dir))
		.pipe(gulp.dest(changed_dir));

	return stream;
}));


/**
 * Build static site files.
 */
gulp.task('build', gulp.series(
	'clean',
	'npm_install',
	'build_from_metadata',
	'copy_libs_inner',
	'copy_libs_outer'
));


/**
 * Default to build.
 */
gulp.task('default', gulp.series('build'));
