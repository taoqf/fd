var gulp = require('gulp');
var packageJson = require('./package.json');
// var tsconfig = require('./tsconfig.json');

var tslint = require('gulp-tslint');
var tsc = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var sequence = require('gulp-sequence');

var projectConfig = tsc.createProject('./tsconfig.json');

const src = projectConfig.config.files || [];
const dest = './dist/';

gulp.task('clean', function () {
	return del(dest);
});

gulp.task('ts-lint', function () {
	return gulp.src(src)
		.pipe(tslint({
			configuration:{"indent": 'tabs'}
			// configuration:{"indent": [ true, "tabs" ]}
		}))
		.pipe(tslint.report('json'));
});

gulp.task('compile-ts', function (cb) {
	var tsResult = gulp.src(["./src/node_modules.d.ts", "./typings/index.d.ts", './src/**/*.ts'])
	// var tsResult = gulp.src(src.concat('./src/**/*.ts'))	// ai/index.js missing
		.pipe(sourcemaps.init())
		.pipe(tsc(projectConfig));
	tsResult.dts.pipe(gulp.dest(dest));
	return tsResult.js
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(dest));
});

gulp.task('dts-generator', function(cb) {
	require('dts-generator').default({
		name: packageJson.name,
		// project: './',
		baseDir: './',
		rootDir: './src/',
		exclude: ['./node_modules/**/*.d.ts', './typings/**/*.d.ts'],
		out: dest + 'typings/' + packageJson.name + '-' + packageJson.version + '.d.ts',
		moduleResolution: 1,
		target: 1
	});
});

gulp.task('watch', function(cb) {
	gulp.start('default');
	gulp.watch(["./src/node_modules.d.ts", "./typings/index.d.ts", './src/**/*.ts'], function name(file) {
		var tsResult = gulp.src(["./src/node_modules.d.ts", "./typings/index.d.ts", file.path])
		// var tsResult = gulp.src(src.concat('./src/**/*.ts'))	// ai/index.js missing
			.pipe(sourcemaps.init())
			.pipe(tsc(projectConfig));
		tsResult.dts.pipe(gulp.dest(dest));
		return tsResult.js
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest(dest));
	});
});

var gulpCopy = require('gulp-copy');

gulp.task('copy-files', function () {
	return gulp.src(['./package.json'])
		.pipe(gulpCopy(dest));
});

// var path = require('path');
// var wp = require('webpack');
// var webpack = require('gulp-webpack');
// // var named = require('vinyl-named');
// var uglify = new wp.optimize.UglifyJsPlugin({
// 	sourceMap: false
// }); 
// var through = require('through');
// gulp.task('webpack', function() {
// 	return gulp.src('./dist-daoke/p00001/p.js')
// 		.pipe((function(opts) {
// 			return through(function(file) {
// 				// file.named = path.basename(file.path, path.extname(file.path))
// 				file.named = path.basename(file.base)
// 				this.queue(file);
// 			});
// 		})())
// 		.pipe(webpack({
// 			// plugins: [uglify],
// 			externals: [
// 				"feidao-widgets/100006",
// 				"nools"
// 			],
// 			// modulesDirectories: ['./', 'bower_components', "web_loaders", "web_modules", "node_loaders", "node_modules"],
// 			// packageMains: ["webpackLoader", "webLoader", "loader", "main", "nools.min"],
// 			/**
// 			 *  modulesDirectories: ["web_loaders", "web_modules", "node_loaders", "node_modules"],
//     extensions: ["", ".webpack-loader.js", ".web-loader.js", ".loader.js", ".js"],
//     packageMains: ["webpackLoader", "webLoader", "loader", "main"]
// 			 */
// 			resolve: {
// 				extensions: ["", ".webpack.js", '.web.js', ".webpack-loader.js", ".web-loader.js", ".loader.js", ".js"],
// 				// extensions: ["", ".webpack-loader.js", ".web-loader.js", ".loader.js", ".js"],
// 				root: [
// 					path.resolve('./'),
// 					path.resolve('./bower_components'),
// 					path.resolve('./node_modules')
// 				],
// 				alias:{
// 					'daoke': 'dist-daoke',
// 					'dot': 'doT',
// 					'feidao-web': 'dist',
// 					'state-machine': 'javascript-state-machine'
// 				// dojo: 'dojo-release-1.10.4-src/dojo',
// 				// dijit: 'dojo-release-1.10.4-src/dijit',
// 				// dojox: 'dojo-release-1.10.4-src/dojox',
// 				// doh: 'dojo-release-1.10.4-src/util/doh'
// 				}
// 			},
// 			module: {
// 				loaders: [
// 					// { test: /license$/i, loader: 'raw' },
// 					// { test: /\.ts$/, loader: 'ts-loader' },
// 					{ test: /\.(tpl|json|nools|md)$/, loader: 'raw' }
// 					// { test: /\.css$/, loader: "style!css" }
// 				]
// 			}
// 		}))
// 		.pipe(gulp.dest('./dist11/'));
// });

gulp.task('default', function(cb) {
	sequence('clean', 'copy-files', 'ts-lint', 'compile-ts', 'dts-generator', cb);
});