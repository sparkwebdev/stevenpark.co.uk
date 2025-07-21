import { minify as htmlmin } from 'html-minifier-terser';

export default (value, outputPath) => {
  if (outputPath.indexOf('.html') > -1) {
    return htmlmin(value, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true,
      minifyCSS: true
    });
  }

  return value;
};
