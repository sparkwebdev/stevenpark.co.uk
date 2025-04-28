const { dest, src } = require('gulp');

// Use dynamic import() to load gulp-imagemin
const images = async () => {
  const imagemin = await import('gulp-imagemin'); // Dynamic import

  return src('./src/assets/images/**/*')
    .pipe(
      imagemin.default( // Access the default export
        [
          imagemin.mozjpeg({ quality: 60, progressive: true }),
          imagemin.optipng({ optimizationLevel: 5, interlaced: null })
        ],
        {
          silent: true
        }
      )
    )
    .pipe(dest('./dist/assets/images'));
};

module.exports = images;
