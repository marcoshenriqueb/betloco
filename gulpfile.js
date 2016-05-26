var gulp = require('gulp');
var stylus = require('gulp-stylus');

gulp.task('stylus', function () {
  gulp.src('./resources/stylus/app.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./front/static/front/css'));
});
gulp.task('watch', ['stylus'], function() {
  gulp.watch('./resources/stylus/**/*.styl', ['stylus']);
});
