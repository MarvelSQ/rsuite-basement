const fs = require('fs');
const path = require('path');
const { ESLint } = require('eslint');
/**
 * @type {typeof import('../src/index')}
 */
const { build } = require('../lib');
const base = require('./base.json');

const pages = build(base);

const eslint = new ESLint({ fix: true });

pages.forEach((page) => {
  const filePath  = path.resolve(__dirname, '../src/pages', `${page.page.name}.tsx`)
  fs.writeFile(
    filePath,
    page.toString(),
    {
      encoding: 'utf-8',
    },
    (err) => {
      if (err) {
        console.error(err);
      } else {
        eslint.lintFiles([filePath]).then((results) => {
          ESLint.outputFixes(results);
        });
      }
    }
  );
});
