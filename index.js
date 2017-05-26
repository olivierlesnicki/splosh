#!/usr/bin/env node

const fs = require('fs-extra');
const assert = require('assert');
const path = require('path');
const args = require('yargs').argv._;
const glob = require("glob");

assert(fs.pathExistsSync('splosh'), 'Folder splosh doesn\'t exist inside your project');
assert(args[0], 'Missing template argument: splosh <template>');
assert(fs.pathExistsSync(`splosh/${args[0]}`), `Folder splosh/${args[0]} doesn\'t exist inside your project`);

const replace$ = (str) => {

  let newStr = str;

  let regex = /\$(\d+)/g
  let matches = [];
  let match = regex.exec(str);

  while (match != null) {
    matches.push(match);
    match = regex.exec(str);
  }

  matches.forEach(match => {
    let value = args[Number(match[1])];
    assert(value, `Missing argument for ${match[0]}`);

    newStr = newStr.replace(match[0], value);
  });

  return newStr;

};

glob(`**/*`, {
  cwd: `splosh/${args[0]}`,
  nodir: true
}, (err, files) => {
  files.forEach(file => {

    newFile = replace$(file);

    if (!fs.pathExistsSync(`${newFile}`)) {
      let content = fs.readFileSync(`splosh/${args[0]}/${file}`, 'utf-8');
      let newContent = replace$(content);

      fs.ensureFileSync(newFile);
      fs.writeFileSync(newFile, content, 'utf-8');
      console.log(`INFO ${newFile} was created`);
    } else {
      console.log(`INFO ${newFile} alread exists`);
    }

  });
});
