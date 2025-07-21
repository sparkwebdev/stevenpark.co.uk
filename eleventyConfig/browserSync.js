import { readFileSync } from "fs";

const configureBrowserSync = (eleventyConfig) => {
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, bs) {
        const content_404 = readFileSync('dist/404.html');
        bs.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      }
    }
  });
};

export default configureBrowserSync; 