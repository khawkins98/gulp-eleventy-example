const _            = require('lodash');
const Path         = require('path');

module.exports = function(config) {

  config.addLayoutAlias('default', 'layouts/base.njk');

  // BroswerSync options
  config.setBrowserSyncConfig({ open: true });

  return {
    dir: {
      input: "src/site",
      output: "build",
      data: "_data"
    },
    templateFormats : [
      "njk", "md", // note that .md files will also be parsed with njk processor
      "css", "js" // passthrough file copying for static assets
    ],
    htmlTemplateEngine : ["njk", "md"],
    markdownTemplateEngine : "njk",
    passthroughFileCopy: true,
    pathPrefix: "/gulp-eleventy-example/" // if your site is deployed to a sub-url, otherwise comment out
  };

};
