import pluginRss from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import readingTime from 'eleventy-plugin-reading-time';
import linkPreview from './helpers/linkPreview.js';
import createCollection from './eleventyConfig/createCollection.js';
import addFilters from './eleventyConfig/filters.js';
import addTagCollection from './eleventyConfig/tagCollection.js';
import htmlMinTransform from './src/transforms/html-min-transform.js';
import configureLayouts from './eleventyConfig/layouts.js';
import configureMarkdown from './eleventyConfig/markdown.js';
import configureAssets from './eleventyConfig/assets.js';
import configureBrowserSync from './eleventyConfig/browserSync.js';

const isProduction = process.env.NODE_ENV === 'production';

export default function(eleventyConfig) {

  eleventyConfig.setDataDeepMerge(true);
  
  // Plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(readingTime);

  // Transforms
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
  configureLayouts(eleventyConfig);

  // Configure markdown
  configureMarkdown(eleventyConfig);

  // Configure assets
  configureAssets(eleventyConfig);

  // Configure browser-sync
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

}