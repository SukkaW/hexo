'use strict';
const NodeCache = require('node-cache');

module.exports = ctx => {
  const Cache = new NodeCache({ checkperiod: 0 });

  // reset cache for watch mode
  ctx.on('generateBefore', () => { Cache.flushAll(); });

  return function fragmentCache(id, fn) {
    if (this.cache && Cache.has(id)) return Cache.get(id);

    const result = fn();
    Cache.set(id, fn());

    return result;
  };
};
