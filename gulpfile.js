const gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify')

gulp.task('minify', () => {
  return gulp.src('index.js')
    .pipe(concat('index.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
})
