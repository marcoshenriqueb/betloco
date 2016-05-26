var gulp = require('gulp');
var stylus = require('gulp-stylus');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');

gulp.task('stylus', function () {
  gulp.src('./resources/stylus/app.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./front/static/front/css'));
});

gulp.task('script', function() {
  browserify('./resources/js/app.js')
  .bundle()
  .pipe(source('app.bundled.js'))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest('./front/static/front/js'));
});

gulp.task('watch', ['stylus', 'script'], function() {
  gulp.watch('./resources/stylus/**/*.styl', ['stylus']);
  gulp.watch('./resources/js/**/*', ['script']);
});
