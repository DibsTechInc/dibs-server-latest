const fs = require('fs');

const modules = [];
// Dynamically load all modules. Ignore non JS files, the current file or any file starting with '_'
fs.readdirSync(__dirname).forEach((file) => {
  if (!(!file.includes('.js') || (file === 'index.js' || file[0] === '_'))) {
    modules.push(require(`${__dirname}/${file}`)); // eslint-disable-line
  }
});

module.exports = modules;
