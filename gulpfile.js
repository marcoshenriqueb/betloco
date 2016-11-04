var gulp = require('gulp');
var stylus = require('gulp-stylus');
var browserify = require('browserify');
var watchify = require('watchify');
var errorify = require('errorify');
var livereactload = require('livereactload');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var babelify = require('babelify');
var sourcemaps = require('gulp-sourcemaps');
var gulpif = require('gulp-if');
var imagemin = require('gulp-imagemin');
var imageResize = require('gulp-image-resize');

var production = true;

gulp.task('stylus', function () {
  gulp.src('./resources/stylus/app.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./front/static/front/css'));
  gulp.src('./resources/stylus/home/home.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./front/static/front/css'));
  gulp.src('./resources/stylus/home/auth.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./front/static/front/css'));
});

gulp.task('script', function() {
  var b = browserify('./resources/js/app.js', {
      cache: {},
      packageCache: {},
      plugin: [errorify],
      transform: [[babelify, {presets: ["es2015", "react"]}]]
    })
  var w = watchify(b);

  rebundle();
  return w.on("update", rebundle);

  function rebundle(){
    w.bundle()
    .pipe(source('app.bundled.js'))
    .pipe(buffer())
    .pipe(gulpif(production === true, uglify()))
    .pipe(gulp.dest('./front/static/front/js'));
  }
});
gulp.task('scripthome', function() {
  var b = browserify('./resources/js/home.js', {
      plugin: [errorify],
      transform: [[babelify, {presets: ["es2015"]}]]
    })
  var w = watchify(b);

  rebundle();
  return w.on("update", rebundle);

  function rebundle(){
    w.bundle()
    .pipe(source('home.bundled.js'))
    .pipe(buffer())
    .pipe(gulpif(production === true, uglify()))
    .pipe(gulp.dest('./front/static/front/js'));
  }
});

gulp.task('watch', ['apply-prod-env', 'stylus', 'script'], function() {
  gulp.watch('./resources/stylus/**/*.styl', ['stylus']);
  // gulp.watch('./resources/js/**/*', ['script']);
});

gulp.task('watchhome', ['apply-prod-env', 'stylus', 'scripthome'], function() {
  gulp.watch('./resources/stylus/**/*.styl', ['stylus']);
  // gulp.watch('./resources/js/**/*', ['script']);
});

gulp.task('apply-prod-env', function() {
  if (production === true) {
    process.env.NODE_ENV = 'production';
  }
});

gulp.task('image', function() {
  gulp.src('resources/img/*')
        .pipe(imageResize({
          width : 1301,
          upscale : false
          }))
        .pipe(imagemin())
        .pipe(gulp.dest('front/static/front/img'))
});
gulp.task('image-thumb', function() {
  gulp.src('resources/img/thumb/*')
        .pipe(imageResize({
          height : 200,
          upscale : false
          }))
        .pipe(imagemin())
        .pipe(gulp.dest('front/static/front/img'))
});
