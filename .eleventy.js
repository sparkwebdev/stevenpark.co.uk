const CleanCSS              = require('clean-css');
const Terser                = require("terser");
const pluginRss             = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const fs                    = require("fs");
const crypto                = require("crypto");
const path                  = require('path');
const { DateTime }          = require("luxon");
const markdownIt            = require("markdown-it");
const markdownItAnchor      = require("markdown-it-anchor");
const markdownItAttrs       = require("markdown-it-attrs");
const readingTime           = require('eleventy-plugin-reading-time');
const scrape                = require('html-metadata');

const isProduction = process.env.NODE_ENV === 'production';

// Helper function to escape HTML
const escape = (unsafe) => {
  return (unsafe === null) ? null : 
    unsafe.replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}
const linkPreview = (link, callback) => {
  // Helper function to format links
  const format = (metadata) => {
    // let domain = link.replace(/^http[s]?:\/\/([^\/]+).*$/i, '$1');
    let title = escape((metadata.openGraph ? metadata.openGraph.title : null) || metadata.general.title || "");
    let author = escape(((metadata.jsonLd && metadata.jsonLd.author) ? metadata.jsonLd.author.name : null) || "");
    // let image = escape((metadata.openGraph && metadata.openGraph.image) ? (Array.isArray(metadata.openGraph.image) ? metadata.openGraph.image[0].url : metadata.openGraph.image.url) : null);
    let description = escape(((metadata.openGraph ? metadata.openGraph.description : "") || metadata.general.description || "").trim());
    if (description.length > 140) {
      description = description.replace(/^(.{0,140})\s.*$/s, '$1') + '…';
    }
    return  `
      <a class="card-link" href="${link}">` + 
        `<svg aria-hidden="true" focusable="false" class="card-link__icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 122.88 121.93" xml:space="preserve"><g><path d="M8.33,0.02h29.41v20.6H20.36v80.7h82.1V84.79h20.36v37.14H0V0.02H8.33L8.33,0.02z M122.88,0H53.3l23.74,23.18l-33.51,33.5 l21.22,21.22L98.26,44.4l24.62,24.11V0L122.88,0z"/></g></svg>` + 
        `<strong class="card-link__title">${title}</strong><br>` + 
        (author ? `<em class="card-link__author">— by ${author}</em><br />` : ``) + 
        (description ? `<span class="card-link__description">${description}</span><br />` : ``) + 
        `<span class="card-link__url" aria-hidden="true">${link}</span>
      </a>
    `.replace(/[\n\r]/g, ' ');
  }
  
  // Hash the link URL (using SHA1) and create a file name from it
  let hash = crypto.createHash('sha1').update(link).digest('hex');
  let file = path.join('src/_links', `${hash}.json`);
  if (fs.existsSync(file)) {
    // File with cached metadata exists
    console.log(`[linkPreview] Using persisted data for link ${link}.`);
    fs.readFile(file, (err, data) => {
      if (err) callback("Reading persisted metadata failed", `<div style="color:#ff0000; font-weight:bold">ERROR: Reading persisted metadata failed</div>`);
      // Parse file as JSON, pass it to the format function to format the link
      callback(null, format(JSON.parse(data.toString('utf-8'))));
    });
  } else {
    // No cached metadata exists
    console.log(`[linkPreview] No persisted data for ${link}, scraping.`);
    scrape(link).then((metadata => {
      if (!metadata) callback ("No metadata", `<div style="color:#ff0000; font-weight:bold">ERROR: Did not receive metadata</div>`);
      // First, store the metadata returned by scrape in the file
      fs.writeFile(file, JSON.stringify(metadata, null, 2), (err) => { /* Ignore errors, worst case we parse the link again */ });
      // Then, format the link
      callback(null, format(metadata)); 
    })).catch(error => console.log(error.message));;
  }  
}

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

  // Layout aliases
  eleventyConfig.addLayoutAlias("base", "layouts/base.html");
  eleventyConfig.addLayoutAlias("page", "layouts/page.html");
  eleventyConfig.addLayoutAlias("posts", "layouts/posts.html");
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

  // Tell 11ty to use the .eleventyignore and ignore our .gitignore file
  eleventyConfig.setUseGitIgnore(false);

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

  eleventyConfig.addFilter("currentYear", () => {
    return DateTime.local().year;
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

  eleventyConfig.addNunjucksAsyncFilter("linkPreview", linkPreview);

  // Collections
  eleventyConfig.addCollection('portfolio', collection => {
    return [...collection.getFilteredByGlob('./src/pages/work/portfolio/*.html')].reverse();
  });

  eleventyConfig.addCollection('featuredPortfolio', collection => {
    return [...collection.getFilteredByGlob('./src/pages/work/portfolio/*.html')].filter(x => x.data.featured).reverse();
  });

  // Returns a collection of blog posts in reverse date order
  eleventyConfig.addCollection('blog', collection => {
    return [...collection.getFilteredByGlob('./src/posts/**/*.md')].reverse();
  });

  // Returns a collection of blog posts in reverse date order
  eleventyConfig.addCollection('blogLatest', collection => {
    return [...collection.getFilteredByGlob('./src/posts/**/*.md')].reverse().slice(0,2);
  });

  // Returns a collection of blog posts in reverse date order
  eleventyConfig.addCollection('articles', collection => {
    return [...collection.getFilteredByGlob('./src/posts/articles/*.md')].reverse();
  });

  // Returns a collection of blog posts in reverse date order
  eleventyConfig.addCollection('resources', collection => {
    return [...collection.getFilteredByGlob('./src/posts/resources/*.md')].reverse();
  });

  // Returns a collection of blog posts in reverse date order
  eleventyConfig.addCollection('tutorials', collection => {
    return [...collection.getFilteredByGlob('./src/posts/tutorials/*.md')].reverse();
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

  // Assets
  eleventyConfig.addPassthroughCopy("./src/assets/img");
  eleventyConfig.addPassthroughCopy("./src/assets/js");
  eleventyConfig.addPassthroughCopy("./src/assets/css");
  eleventyConfig.addPassthroughCopy("./src/assets/fonts");

  // Favicon, PWA, robots, etc
  eleventyConfig.addPassthroughCopy('./src/robots.txt');
  eleventyConfig.addPassthroughCopy('./src/browserconfig.xml');
  eleventyConfig.addPassthroughCopy('./src/site.webmanifest');
  eleventyConfig.addPassthroughCopy("./src/*.png");
  eleventyConfig.addPassthroughCopy("./src/*.ico");
  eleventyConfig.addPassthroughCopy("./src/safari-pinned-tab.svg");
  
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