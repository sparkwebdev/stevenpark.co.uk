const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItAttrs = require("markdown-it-attrs");

const configureMarkdown = (eleventyConfig) => {
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
};

module.exports = configureMarkdown; 