'use strict';

const { Pattern } = require('hexo-util');
const { isHiddenFile, isTmpFile } = require('../../plugins/processor/common');

exports.process = function(file) {
  const Asset = this.model('Asset');
  const id = file.source.substring(this.base_dir.length).replace(/\\/g, '/');
  const { path } = file.params;
  const doc = Asset.findById(id);

  if (file.type === 'delete') {
    if (doc) {
      return doc.remove();
    }

    return;
  }

  return Asset.save({
    _id: id,
    path,
    modified: file.type !== 'skip'
  });
};

exports.pattern = new Pattern(path => {
  let i = 0;
  if (path.charCodeAt(i++) !== 115 /* s */
    || path.charCodeAt(i++) !== 111/* o */
    || path.charCodeAt(i++) !== 117/* u */
    || path.charCodeAt(i++) !== 114/* r */
    || path.charCodeAt(i++) !== 99 /* c */
    || path.charCodeAt(i++) !== 101/* e */
    || path.charCodeAt(i++) !== 47 /* / */
  ) return false;

  path = path.substring(7);
  if (isHiddenFile(path) || isTmpFile(path) || path.includes('node_modules')) return false;

  return { path };
});
