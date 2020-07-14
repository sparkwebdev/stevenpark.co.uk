const CleanCSS              = require('clean-css');
const Terser                = require("terser");
const pluginRss             = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginNavigation      = require("@11ty/eleventy-navigation");
const fs                    = require("fs");
const { DateTime }          = require("luxon");
const markdownIt            = require("markdown-it");
const markdownItAnchor      = require("markdown-it-anchor");
const markdownItAttrs       = require("markdown-it-attrs");

module.exports = function(eleventyConfig) {

  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addLayoutAlias("base", "layouts/base.html");
  eleventyConfig.addLayoutAlias("page", "layouts/page.html");
  eleventyConfig.addLayoutAlias("post", "layouts/post.html");
  eleventyConfig.addLayoutAlias("portfolio", "layouts/portfolio.html");

  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, bs) {
        const content_404 = fs.readFileSync('dist/404.html');

        bs.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      }
    }
  });

  eleventyConfig.addFilter('cssmin', function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  eleventyConfig.addFilter("jsmin", function(code) {
      let minified = Terser.minify(code);
      if( minified.error ) {
          console.log("Terser error: ", minified.error);
          return code;
      }
      return minified.code;
  });

  eleventyConfig.addFilter('urlmatch', function(find, url) {
    return url.indexOf(find) !== -1;
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if (!Array.isArray(array)) return;
    if( n < 0 ) {
      return array.slice(n);
    }
    return array.slice(0, n);
  });

  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd LLL yyyy");
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  eleventyConfig.addFilter('classname', function(string) {
    return string.toLowerCase(); // needs improved
  });

  eleventyConfig.addFilter('logme', function(label, item) {
    console.log(label, item);
  });

  eleventyConfig.addFilter('getPageBySlug', function(pages, fileSlug) {
    return pages.filter(item => item.data.page.fileSlug == fileSlug);
  });

  eleventyConfig.addFilter("menu", function(collection, menu) {
    return collection.filter(item => item.data.menu == menu);
  });

  // Collections
  eleventyConfig.addCollection('work', collection => {
    return collection
      .getFilteredByGlob('./pages/work/*.html');
  });

  eleventyConfig.addCollection('featuredWork', collection => {
    return collection
      .getFilteredByGlob('./pages/work/*.html')
      .filter(x => x.data.featured);
  });

  // Returns a collection of journal posts in reverse date order
  eleventyConfig.addCollection('journal', collection => {
    return [...collection.getFilteredByGlob('./src/posts/*.md')].reverse();
  });

  eleventyConfig.addCollection("tagList", function(collection) {
    let tagSet = new Set();
    collection.getAll().forEach(function(item) {
      if ("tags" in item.data) {
        let tags = item.data.tags;
        tags = tags.filter(function(item) {
          switch(item) {
            // this list should match the `filter` list in tags.html
            case "all":
            case "nav":
            case "post":
            case "posts":
              return false;
          }
          return true;
        });
        for (const tag of tags) {
          tagSet.add(tag);
        }
      }
    });
    // returning an array in addCollection works in Eleventy 0.5.3
    return [...tagSet];
  });

  /* Markdown Overrides */
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }).disable('code')
  .use(markdownItAnchor, {
    permalink: false
  })
  .use(markdownItAttrs, {
    allowedAttributes: ['id', 'class', /^regex.*$/]
  });
  eleventyConfig.setLibrary("md", markdownLibrary);

  eleventyConfig.addPassthroughCopy("assets/img");
  eleventyConfig.addPassthroughCopy("assets/js");
  eleventyConfig.addPassthroughCopy("assets/css");
  eleventyConfig.addPassthroughCopy("assets/css/fonts");
  

  return {
    markdownTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    // templateFormats: [
    //   "md",
    //   "njk",
    //   "html"
    // ],
    dir: {
      input: 'src',
      output: 'dist'
    }
  };


};