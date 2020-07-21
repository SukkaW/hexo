'use strict';

let NEED_INJECT = true;
let META_GENERATOR_TAG;
const rMetaGenertor = /<meta\s+(?:[^<>]+\s)?name=['|"]?generator['|"]?/i;

function hexoMetaGeneratorInject(data) {
  if (!NEED_INJECT) return;

  if (!this.config.meta_generator
    || rMetaGenertor.test(data)) {
    NEED_INJECT = false;
    return;
  }

  META_GENERATOR_TAG = META_GENERATOR_TAG || `<meta name="generator" content="Hexo ${this.version}">`;

  return data.replace(/<head>(?!<\/head>).+?<\/head>/s, str => str.replace('</head>', `${META_GENERATOR_TAG}</head>`));
}

module.exports = hexoMetaGeneratorInject;
