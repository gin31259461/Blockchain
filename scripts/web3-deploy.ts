import Web3, { ContractOptions, type Contract } from 'web3';
import compileContract from './compile.cjs';
import { type ABI, type SolcCompiledOutput } from './solc-compile-output-types';

type Web3Provider = ConstructorParameters<typeof Web3>;

type InteractFunction = (contract: Contract<ABI[]>) => Promise<void>;

type DeployArgs = {
  contractFileName: string;
  provider: Web3Provider[0];
  targetContractName?: string;
  from?: string;
  gas?: number;
  interact?: InteractFunction;
};

const contractPath = './contracts';

export const deploy = async (args: DeployArgs): Promise<ContractOptions> => {
  /*
   * connect to ethereum node
   */

  const web3 = new Web3(args.provider);
  console.log(`Deploying ${args.contractFileName}.sol ...\n`);

  /*
   * Compile Contract and Fetch ABI
   */

  const compiledContract: SolcCompiledOutput = compileContract(`${contractPath}/${args.contractFileName}.sol`);

  const targetContractName = args.targetContractName || Object.keys(compiledContract.contracts.default)[0];

  if (!(targetContractName in compiledContract.contracts.default)) throw new Error('Invalid contract name');

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
      from: args.from || accounts[0],
      gas: args.gas?.toString() || gasEstimate.toString(),
      // gasPrice: web3.utils.toWei('0.00003', 'ether'),
    });

  console.log('Finish deploying the contract at the address: ' + result.options.address + '\n');

  const deployedContract = new web3.eth.Contract(abi, result.options.address);

  args.interact && (await args.interact(deployedContract));

  return result.options;
};
