'use strict';

const Promise = require('bluebird');

const typeAlias = {
  pre: 'before_post_render',
  post: 'after_post_render',
  'after_render:html': '_after_html_render'
};

class Filter {
  constructor() {
    this.store = {};
  }

  list(type) {
    if (!type) return this.store;
    return this.store[type] || [];
  }

  /**
   * Register a filter plugin
   * @param {String} type - The type of the filter
   * @param {Function|Promise} fn - The filter function
   * @param {Number} priority
   */
  register(type, fn, priority = 10) {
    if (!priority) {
      if (typeof type === 'function') {
        priority = fn;
        fn = type;
        type = 'after_post_render';
      }
    }

    if (typeof fn !== 'function') throw new TypeError('fn must be a function');

    type = typeAlias[type] || type;

    const store = this.store[type] || [];
    this.store[type] = store;

    fn.priority = priority;
    store.push(fn);

    store.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Unregister a filter function
   * @param {String} type - The type of filter
   * @param {Function|Promise} fn - The function of the filter
   */
  unregister(type, fn) {
    if (!type) throw new TypeError('type is required');
    if (typeof fn !== 'function') throw new TypeError('fn must be a function');

    type = typeAlias[type] || type;

    const list = this.list(type);
    if (!list || !list.length) return;

    const index = list.indexOf(fn);

    if (index !== -1) list.splice(index, 1);
  }

  /**
   * Execute filter asynchronously
   * @param {String} type - The type of filters to be excuted
   * @param {*} data - The data to be filtered
   * @param {Object} options - The filter options
   * @returns {Promise}
   */
  exec(type, data, options = {}) {
    const filters = this.list(type);
    if (filters.length === 0) return Promise.resolve(data);

    const ctx = options.context;
    const args = options.args || [];

    args.unshift(data);

    return Promise.each(filters, filter => Reflect.apply(Promise.method(filter), ctx, args).then(result => {
      args[0] = result == null ? args[0] : result;
      return args[0];
    })).then(() => args[0]);
  }

  /**
   * Execute filters synchronously
   * @param {String} type - The type of filters to be executed
   * @param {*} data - The data to be modified
   * @param {Object} options - The filter options
   * @returns {*}
   */
  execSync(type, data, options = {}) {
    const filters = this.list(type);
    const filtersLen = filters.length;
    if (filtersLen === 0) return data;

    const ctx = options.context;
    const args = options.args || [];

    args.unshift(data);

    for (let i = 0, len = filtersLen; i < len; i++) {
      const result = Reflect.apply(filters[i], ctx, args);
      args[0] = result == null ? args[0] : result;
    }

    return args[0];
  }
}

module.exports = Filter;
