const configureLayouts = (eleventyConfig) => {
  eleventyConfig.addLayoutAlias("base", "layouts/base.html");
  eleventyConfig.addLayoutAlias("page", "layouts/page.html");
  eleventyConfig.addLayoutAlias("posts", "layouts/posts.html");
  eleventyConfig.addLayoutAlias("post", "layouts/post.html");
  eleventyConfig.addLayoutAlias("portfolio", "layouts/portfolio.html");
};

module.exports = configureLayouts; 