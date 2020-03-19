const CleanCSS = require('clean-css');
const Terser = require("terser");
const pluginNavigation = require("@11ty/eleventy-navigation");
const fs = require("fs");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addLayoutAlias("base", "layouts/base.njk");
  eleventyConfig.addLayoutAlias("page", "layouts/page.njk");
  eleventyConfig.addLayoutAlias("portfolio", "layouts/portfolio.njk");

  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, bs) {
        const content_404 = fs.readFileSync('_site/404.html');

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

  eleventyConfig.addFilter('urlmatch', function(find, url) {
    return url.indexOf(find) !== -1;
  });

  eleventyConfig.addFilter("jsmin", function(code) {
      let minified = Terser.minify(code);
      if( minified.error ) {
          console.log("Terser error: ", minified.error);
          return code;
      }
      return minified.code;
  });

  eleventyConfig.addPassthroughCopy("assets/img");
  eleventyConfig.addPassthroughCopy("assets/js");
  eleventyConfig.addPassthroughCopy("assets/css/fonts");

};