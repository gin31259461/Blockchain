/* eslint-disable @typescript-eslint/no-var-requires */
const solc = require('solc');
const fs = require('fs');

const compileContract = (path) => {
  const source = fs.readFileSync(path, 'utf8');
  const compiledContract = solc.compile(source);

  return compiledContract;
};

module.exports = compileContract;
