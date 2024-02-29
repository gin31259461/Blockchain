import ganache from 'ganache';
import { ContractOptions, Web3 } from 'web3';
import compileContract from './compile.cjs';

const contractPath = './contracts';

export const deploy = async (contractName: string): Promise<ContractOptions> => {
  /*
   * connect to ethereum node
   */

  const web3 = new Web3(ganache.provider());
  console.log(`Deploying ${contractName}.sol ...\n`);

  /*
   * Compile Contract and Fetch ABI
   */

  const compiledContract = compileContract(`${contractPath}/${contractName}.sol`);

  const contractNames = Object.keys(compiledContract.contracts.default);
  const targetContractName = contractNames[0];

  console.log(`Using contract '${targetContractName}' to deploy`);

  const bytecode = compiledContract.contracts.default[targetContractName].evm.bytecode.object;
  const abi = compiledContract.contracts.default[targetContractName].abi;

  /*
   * deploy contract
   */

  const gasEstimate = await web3.eth.estimateGas({ data: '0x' + bytecode });

  const contract = new web3.eth.Contract(abi);

  const accounts = await web3.eth.getAccounts();

  const result = await contract
    .deploy({
      data: '0x' + bytecode,
      arguments: [],
    })
    .send({
      from: accounts[0],
      gas: gasEstimate.toString(),
      // gasPrice: web3.utils.toWei('0.00003', 'ether'),
    });

  console.log('Finish deploying the contract at the address: ' + result.options.address + '\n');

  const deployedContract = new web3.eth.Contract(abi, result.options.address);
  const message = await deployedContract.methods.getMessage().call();

  console.log("This is the smart contract's message:\n\n" + message + '\n');

  return result.options;
};
