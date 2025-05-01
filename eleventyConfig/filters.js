const CleanCSS = require('clean-css');
const Terser = require("terser");
const { DateTime } = require("luxon");

const addFilters = (eleventyConfig) => {
  // CSS Minification
  eleventyConfig.addFilter('cssmin', function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // JS Minification
  eleventyConfig.addFilter("jsmin", function(code) {
    let minified = Terser.minify(code);
    if( minified.error ) {
      console.log("Terser error: ", minified.error);
      return code;
    }
    return minified.code;
  });

  // URL Matching
  eleventyConfig.addFilter('urlmatch', function(find, url) {
    return url.indexOf(find) !== -1;
  });

  // Get first n elements
  eleventyConfig.addFilter("head", (array, n) => {
    if (!Array.isArray(array)) return;
    if( n < 0 ) {
      return array.slice(n);
    }
    return array.slice(0, n);
  });

  // Current Year
  eleventyConfig.addFilter("currentYear", () => {
    return DateTime.local().year;
  });

  // Date formatting
  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd LLL yyyy");
  });

  // HTML Date String
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  // Class name conversion
  eleventyConfig.addFilter('classname', function(string) {
    return string.toLowerCase(); // needs improved
  });

  // Debug logging
  eleventyConfig.addFilter('logme', function(label, item) {
    console.log(label, item);
  });

  // Get page by slug
  eleventyConfig.addFilter('getPageBySlug', function(pages, fileSlug) {
    return pages.filter(item => item.data.page.fileSlug == fileSlug);
  });

  // Menu filtering
  eleventyConfig.addFilter("menu", function(collection, menu) {
    return collection.filter(item => item.data.menu == menu);
  });
};

module.exports = addFilters; 