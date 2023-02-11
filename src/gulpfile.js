var gulp = require("gulp"),
fs = require("fs"),
less = require("gulp-less");
let cleanCSS = require('gulp-clean-css');
let uglify = require("gulp-uglify");
gulp.task('make_mzDropDownTree_css', function () {
        return gulp.src('./src/mzdropdowntree.plugin.less')
        .pipe(less())
		    .pipe(cleanCSS({
            compatibility: 'ie8'
         }))
       	.pipe(gulp.dest('./dist/css'))
});
gulp.task('build_tree_script', function() {
  return gulp.src('./src/mzdropdowntree.plugin.js')
    // Minify the file
    .pipe(uglify())
    // Output
    .pipe(gulp.dest('./dist/js'))
});
 