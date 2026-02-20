module.exports = function(eleventyConfig) {
  // Copier les assets (CSS, JS, images)
  eleventyConfig.addPassthroughCopy("src/assets/css");
    eleventyConfig.addPassthroughCopy("src/assets/icons");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/photographs");

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
