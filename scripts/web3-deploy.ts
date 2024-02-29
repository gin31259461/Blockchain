import Web3, { ContractOptions } from 'web3';
import compileContract from './compile.cjs';

type Web3Provider = ConstructorParameters<typeof Web3>;

const contractPath = './contracts';

export const deploy = async (
  contractFileName: string,
  provider: Web3Provider[0],
  from?: string,
  gas?: number,
  interact?: () => Promise<void>
): Promise<ContractOptions> => {
  /*
   * connect to ethereum node
   */

  const web3 = new Web3(provider);
  console.log(`Deploying ${contractFileName}.sol ...\n`);

  /*
   * Compile Contract and Fetch ABI
   */

  const compiledContract = compileContract(`${contractPath}/${contractFileName}.sol`);

  const contractNames = Object.keys(compiledContract.contracts.default);
  const defaultContractName = contractNames[0];

  console.log(`Using contract '${defaultContractName}' to deploy`);

  const bytecode = compiledContract.contracts.default[defaultContractName].evm.bytecode.object;
  const abi = compiledContract.contracts.default[defaultContractName].abi;

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
      from: from || accounts[0],
      gas: gas?.toString() || gasEstimate.toString(),
      // gasPrice: web3.utils.toWei('0.00003', 'ether'),
    });

  console.log('Finish deploying the contract at the address: ' + result.options.address + '\n');

  const deployedContract = new web3.eth.Contract(abi, result.options.address);

  if ('getMessage' in deployedContract.methods) {
    const message = await deployedContract.methods.getMessage().call();
    console.log("This is the smart contract's message:\n\n" + message + '\n');
  }

  interact && (await interact());

  return result.options;
};
