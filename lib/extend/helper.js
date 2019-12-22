'use strict';

class Helper {
  constructor() {
    this.store = {};
    this._store = {};
  }

  list() {
    return this.store;
  }

  _list() {
    return this._store;
  }

  get(name) {
    return this.store[name];
  }

  register(name, fn, requireBind = true) {
    if (!name) throw new TypeError('name is required');
    if (typeof fn !== 'function') throw new TypeError('fn must be a function');

    this.store[name] = fn;
    this._store[name] = { fn, requireBind };
  }
}

module.exports = Helper;
