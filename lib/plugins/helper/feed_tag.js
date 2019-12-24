'use strict';

const { url_for } = require('hexo-util');

function feedTagHelper(path, options = {}) {
  const title = options.title || this.config.title;

  return `<link rel="alternate" href="${url_for.call(this, path)}" title="${title}">`;
}

module.exports = feedTagHelper;
