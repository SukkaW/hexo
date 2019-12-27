'use strict';

const { createSha1Hash, Permalink, slugize } = require('hexo-util');
const { basename } = require('path');
let permalink;

function postPermalinkFilter(data) {
  const { config } = this;
  const { id, _id, slug, title, date } = data;
  const hash = slug && date
    ? createSha1Hash().update(slug + date.unix().toString()).digest('hex').slice(0, 12)
    : null;
  const meta = {
    id: id || _id,
    title: slug,
    name: typeof slug === 'string' ? basename(slug) : '',
    post_title: slugize(title, {transform: 1}),
    year: date.format('YYYY'),
    month: date.format('MM'),
    day: date.format('DD'),
    hour: date.format('HH'),
    minute: date.format('mm'),
    i_month: date.format('M'),
    i_day: date.format('D'),
    hash
  };

  if (!permalink || permalink.rule !== config.permalink) {
    permalink = new Permalink(config.permalink);
  }

  const { categories } = data;

  if (categories.length) {
    meta.category = categories.last().slug;
  } else {
    meta.category = config.default_category;
  }

  const keys = Object.keys(data);
  const keysLen = keys.length;

  for (let i = 0; i < keysLen; i++) {
    const key = keys[i];

    if (Object.prototype.hasOwnProperty.call(meta, key)) continue;

    // Use Object.getOwnPropertyDescriptor to copy getters to avoid "Maximum call
    // stack size exceeded" error
    Object.defineProperty(meta, key, Object.getOwnPropertyDescriptor(data, key));
  }

  if (config.permalink_defaults) {
    const keys2 = Object.keys(config.permalink_defaults);
    const keys2Len = keys2.length;

    for (let i = 0; i < keys2Len; i++) {
      const key = keys2[i];

      if (Object.prototype.hasOwnProperty.call(meta, key)) continue;

      meta[key] = config.permalink_defaults[key];
    }
  }


  return permalink.stringify(meta);
}

module.exports = postPermalinkFilter;
