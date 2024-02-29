/* eslint-disable @typescript-eslint/no-var-requires */
const solc = require('solc');
const fs = require('fs');

const compileContract = (path) => {
  const source = fs.readFileSync(path, 'utf8');
  const input = {
    language: 'Solidity',
    sources: {
      default: {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  };
  const compiledContract = JSON.parse(solc.compile(JSON.stringify(input)));

  return compiledContract;
};

module.exports = compileContract;
