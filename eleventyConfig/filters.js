import CleanCSS from 'clean-css';
import { minify } from "terser";
import { DateTime } from "luxon";

const addFilters = (eleventyConfig) => {
  // CSS Minification
  eleventyConfig.addFilter('cssmin', function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // JS Minification
  eleventyConfig.addFilter("jsmin", function(code) {
    let minified = minify(code);
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

  // Extract year from ISO date string (YYYY-MM-DD)
  eleventyConfig.addFilter("year", function(dateString) {
    if (!dateString) return '';
    return dateString.substring(0, 4);
  });

  // Filter an array of objects to items where key === value
  eleventyConfig.addFilter("whereEquals", function(array, key, value) {
    if (!Array.isArray(array)) return [];
    return array.filter(item => item[key] === value);
  });

  // Resolve a dotted path (e.g. "review.reviewRating") against an object
  const getPath = (obj, path) => path.split('.').reduce((acc, part) => (acc == null ? acc : acc[part]), obj);

  // Filter an array of objects to items missing/falsy a given key (supports dotted paths)
  eleventyConfig.addFilter("whereMissing", function(array, key) {
    if (!Array.isArray(array)) return [];
    return array.filter(item => !getPath(item, key));
  });

  // Look up a value from a schema.org additionalProperty (PropertyValue) array by name
  eleventyConfig.addFilter("propValue", function(properties, name) {
    if (!Array.isArray(properties)) return null;
    const match = properties.find(p => p.name === name);
    return match ? match.value : null;
  });

  // Filter an array of objects to items whose additionalProperty array lacks a given PropertyValue name
  eleventyConfig.addFilter("whereMissingProp", function(array, propsKey, name) {
    if (!Array.isArray(array)) return [];
    return array.filter(item => {
      const props = getPath(item, propsKey);
      return !Array.isArray(props) || !props.some(p => p.name === name);
    });
  });
};

export default addFilters; 