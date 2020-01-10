const { DateTime } = require('luxon');
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginSass = require("eleventy-plugin-sass");
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addLayoutAlias('post', 'layouts/post.njk');

  eleventyConfig.addLayoutAlias('page', 'layouts/page.njk');

  eleventyConfig.addCollection('tagList', require('./_11ty/getTagList'));

  eleventyConfig.addPassthroughCopy('src/assets');

//   eleventyConfig.addPassthroughCopy('src/css');

  // Filters
  eleventyConfig.addFilter('readableDate', dateObj => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(
      'dd LLL yyyy'
    );
  });

  eleventyConfig.addFilter('ymd', dateObj => { // yearmonthdate
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(
      'yyyy/MM/dd'
    );
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', dateObj => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
  });

  eleventyConfig.addFilter('year', function(dateObj) {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy');
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter('head', (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  eleventyConfig.addFilter('console', function(value) {
    const output = JSON.stringify(value);
    return output;
  });

  // Plugins
  eleventyConfig.addPlugin(pluginRss);
  
  eleventyConfig.addPlugin(syntaxHighlight, {

    // only install the markdown highlighter
    templateFormats: ["md"],

    init: function({ Prism }) {
        // Add your own custom language to Prism!
    }
  });

  eleventyConfig.addPlugin(pluginSass, {
    watch: ['**/*.{scss,sass}', '!node_modules/**']
  });

  // You can return your Config object (optional).
  return {
    templateFormats: ['md', 'njk', 'html', 'liquid'],
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    dir: {
      input: 'src',
      output: 'dist'
    }
  };
};