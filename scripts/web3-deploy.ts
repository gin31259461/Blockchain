import Web3, { ContractOptions } from 'web3';
import compileContract from './compile.cjs';
import { type SolcCompiledOutput } from './solc-compile-output-types';

type Web3Provider = ConstructorParameters<typeof Web3>;

interface DeployArgs<T> {
  contractFileName: string;
  provider: Web3Provider[0];
  targetContractName?: string;
  from?: string;
  gas?: number;
  actions?: { name: string; args: Iterable<T> }[];
}

const contractPath = './contracts';

export const deploy = async <T>(args: DeployArgs<T>): Promise<ContractOptions> => {
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

  // 這個 contract 沒有指定 address，所以是準備要被 deploy 的意思 (0 address)。
  const contract = new web3.eth.Contract(abi);

  const accounts = await web3.eth.getAccounts();

  const result = await contract
    .deploy({
      data: '0x' + bytecode,
      arguments: [],
    })
    .send({
      from: args.from || accounts[0],
      gas: args.gas?.toString() || (Number(gasEstimate) + 1000).toString(),
      gasPrice: web3.utils.toWei('0.00003', 'ether'),
    });

  console.log('Finish deploying the contract at the address: ' + result.options.address + '\n');

  console.log('Methods:', contract.methods);

  // 這個 contract 指定了剛剛部署的 contract address，所以可以呼叫這個 address 上的 contract 的函數。
  const deployedContract = new web3.eth.Contract(abi, result.options.address);

  args.actions &&
    args.actions.forEach(async (action) => {
      if (action.name in contract.methods) {
        const callback = await deployedContract.methods[action.name](...action.args).call();
        console.log(action.name, 'with callback', callback);
      }
    });

  return result.options;
};
