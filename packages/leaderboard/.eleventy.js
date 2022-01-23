module.exports = (eleventyConfig) => {
  eleventyConfig.addDataExtension("ndjson", (contents) => {
    return contents
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line));
  });
};
