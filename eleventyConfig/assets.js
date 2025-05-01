const configureAssets = (eleventyConfig) => {
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
};

module.exports = configureAssets; 