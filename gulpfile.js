
const gulp    = require("gulp");
const sass    = require("gulp-sass");

/*
  Generate CSS
*/
gulp.task('css', function() {
  return gulp.src('./assets/scss/style.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    })
    .on('error', sass.logError))
    .pipe(gulp.dest('./assets/css'));
});

/*
  Watch for changess
*/
gulp.task("watch", function() {
  gulp.watch('./assets/scss/**/*.scss', gulp.parallel('css'));
});

/*
  Build output
*/
gulp.task('build', gulp.parallel(
  'css',
));
