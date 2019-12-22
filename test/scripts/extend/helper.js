'use strict';

describe('Helper', () => {
  const Helper = require('../../../lib/extend/helper');

  it('register()', () => {
    const h = new Helper();

    // name, fn
    h.register('test', () => {});
    // name, fn, requireBind
    h.register('test2', () => {}, true);

    h.get('test').should.exist;

    // no fn
    try {
      h.register('test');
    } catch (err) {
      err.should.be
        .instanceOf(TypeError)
        .property('message', 'fn must be a function');
    }

    // no name
    try {
      h.register();
    } catch (err) {
      err.should.be
        .instanceOf(TypeError)
        .property('message', 'name is required');
    }
  });

  it('list()', () => {
    const h = new Helper();

    h.register('test', () => {});

    h.list().should.have.keys(['test']);
  });

  it('_list()', () => {
    const h = new Helper();

    h.register('test1', () => {});
    h.register('test2', () => {}, false);
    h._list().should.have.keys(['test1', 'test2']);
    h._list().test1.fn.should.exist;
    h._list().test1.requireBind.should.eql(true);
    h._list().test2.fn.should.exist;
    h._list().test2.requireBind.should.eql(false);
  });

  it('get()', () => {
    const h = new Helper();

    h.register('test', () => {});

    h.get('test').should.exist;
  });
});
