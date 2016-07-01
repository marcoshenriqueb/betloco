var gulp = require('gulp');
var stylus = require('gulp-stylus');
var browserify = require('browserify');
var watchify = require('watchify');
var livereactload = require('livereactload');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var babelify = require('babelify');

gulp.task('stylus', function () {
  gulp.src('./resources/stylus/app.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./front/static/front/css'));
});

gulp.task('script', function() {
  var b = browserify('./resources/js/app.js', {
      cache: {},
      packageCache: {},
      // plugin: [livereactload],
      transform: [[babelify, {presets: ["es2015", "react"]}]]
    })
  var w = watchify(b);
  rebundle();
  return w.on("update", rebundle);

  function rebundle(){
    w.bundle()
    .pipe(source('app.bundled.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./front/static/front/js'));
  }
});

gulp.task('watch', ['stylus', 'script'], function() {
  gulp.watch('./resources/stylus/**/*.styl', ['stylus']);
  // gulp.watch('./resources/js/**/*', ['script']);
});
