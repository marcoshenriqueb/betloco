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
    // .pipe(sourcemaps.init({loadMaps: true}))
    // .pipe(uglify())
    // .pipe(sourcemaps.write('./'))
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
    .pipe(uglify())
    .pipe(gulp.dest('./front/static/front/js'));
  }
});

gulp.task('watch', ['stylus', 'script'], function() {
  gulp.watch('./resources/stylus/**/*.styl', ['stylus']);
  // gulp.watch('./resources/js/**/*', ['script']);
});

gulp.task('watchhome', ['apply-prod-env', 'stylus', 'scripthome'], function() {
  gulp.watch('./resources/stylus/**/*.styl', ['stylus']);
  // gulp.watch('./resources/js/**/*', ['script']);
});

gulp.task('apply-prod-env', function() {
    process.env.NODE_ENV = 'production';
});
