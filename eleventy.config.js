const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");
const fs = require("fs-extra");

module.exports = async function(eleventyConfig) {

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats:["avif","webp","jpeg"],
    width: ["auto"]
  });

  // Copier les assets (CSS, JS, images)
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/icons");
  eleventyConfig.addPassthroughCopy("src/assets/scripts");
  eleventyConfig.addPassthroughCopy("src/assets/photographs");

  eleventyConfig.on("eleventy.after", async () => {
    await fs.copy("_tmp/img/", "_site/img/", { overwrite: true });
    console.log("📁 Copied optimized images to _site/img/");
  });

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};



