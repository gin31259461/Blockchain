/* eslint-disable @typescript-eslint/no-var-requires */
const solc = require('solc');
const fs = require('fs');

const compileContract = (path) => {
  const source = fs.readFileSync(path, 'utf8').toString();

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

  return JSON.parse(solc.compile(JSON.stringify(input)));
};

module.exports = compileContract;
