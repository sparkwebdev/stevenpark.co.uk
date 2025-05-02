import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import markdownItAttrs from "markdown-it-attrs";

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

export default configureMarkdown; 