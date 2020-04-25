const fs = require('fs')
const path = require('path')

const rootPath = (...p) => path.resolve(path.join(__dirname, '..', ...p));

const postman = require('../postman.json');
const postmanTests = fs.readFileSync(rootPath('postman-tests.js'), { encoding: 'utf-8' });

postman.event[0].script.exec = postmanTests.split('\n');
fs.writeFileSync(rootPath('postman.json'), JSON.stringify(postman, null, 2));
