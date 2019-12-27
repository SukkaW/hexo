'use strict';

const archy = require('archy');

function listRoute() {
  const routes = this.route.list().sort();
  const tree = buildTree(routes);
  const nodes = buildNodes(tree);

  const s = archy({
    label: `Total: ${routes.length}`,
    nodes
  });

  console.log(s);
}

function buildTree(routes) {
  const routesLen = routes.length;
  const obj = {};
  let cursor;

  for (let i = 0; i < routesLen; i++) {
    const item = routes[i].split('/');
    const itemLen = item.length;
    cursor = obj;

    for (let j = 0; j < itemLen; j++) {
      const seg = item[j];
      cursor[seg] = cursor[seg] || {};
      cursor = cursor[seg];
    }
  }

  return obj;
}

function buildNodes(tree) {
  const keys = Object.keys(tree);
  const keysLen = keys.length;
  const nodes = [];

  for (let i = 0; i < keysLen; i++) {
    const key = keys[i];
    const item = tree[key];

    if (Object.keys(item).length) {
      nodes.push({
        label: key,
        nodes: buildNodes(item)
      });
    } else {
      nodes.push(key);
    }
  }

  return nodes;
}

module.exports = listRoute;
