const pluginRss             = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const readingTime           = require('eleventy-plugin-reading-time');
const linkPreview           = require('./helpers/linkPreview.js');
const createCollection      = require('./eleventyConfig/createCollection.js');
const addFilters            = require('./eleventyConfig/filters.js');
const addTagCollection      = require('./eleventyConfig/tagCollection.js');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = function(eleventyConfig) {

  eleventyConfig.setDataDeepMerge(true);
  
  // Plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(readingTime);

  // Transforms
  const htmlMinTransform = require('./src/transforms/html-min-transform.js');

  if (isProduction) {
    eleventyConfig.addTransform('htmlmin', htmlMinTransform);
  }

  // Tell 11ty to use the .eleventyignore and ignore our .gitignore file
  eleventyConfig.setUseGitIgnore(false);

  // Add filters
  addFilters(eleventyConfig);

  // Add async filters
  eleventyConfig.addNunjucksAsyncFilter("linkPreview", linkPreview);

  // Collections
  createCollection(eleventyConfig, 'portfolio', './src/pages/work/portfolio/*.html');
  createCollection(eleventyConfig, 'featuredPortfolio', './src/pages/work/portfolio/*.html', {
    filter: x => x.data.featured
  });
  createCollection(eleventyConfig, 'blog', './src/posts/**/*.md');
  createCollection(eleventyConfig, 'blogLatest', './src/posts/**/*.md', { limit: 2 });
  createCollection(eleventyConfig, 'articles', './src/posts/articles/*.md');
  createCollection(eleventyConfig, 'resources', './src/posts/resources/*.md');
  createCollection(eleventyConfig, 'tutorials', './src/posts/tutorials/*.md');

  // Add tag collection
  addTagCollection(eleventyConfig);

  // Configure layouts
  const configureLayouts = require('./eleventyConfig/layouts.js');
  configureLayouts(eleventyConfig);

  // Configure markdown
  const configureMarkdown = require('./eleventyConfig/markdown.js');
  configureMarkdown(eleventyConfig);

  // Configure assets
  const configureAssets = require('./eleventyConfig/assets.js');
  configureAssets(eleventyConfig);

  // Configure browser-sync
  const configureBrowserSync = require('./eleventyConfig/browserSync.js');
  configureBrowserSync(eleventyConfig);
  
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