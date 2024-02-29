import Web3, { ContractOptions } from 'web3';
import compileContract from './compile.cjs';

export const deploy = async (
  contractName: string,
  args: Array<any>,
  from?: string,
  gas?: string
): Promise<ContractOptions> => {
  /*
   * connect to ethereum node
   */
  const ethereumUri = 'http://localhost:3000';
  const address = '0x004ec07d2329997267Ec62b4166639513386F32E'; // user

  const web3 = new Web3();
  console.log(`deploying ${contractName}`);

  web3.setProvider(new web3.providers.HttpProvider(ethereumUri));

  if (!web3.eth.net.isListening()) {
    throw new Error('unable to connect to ethereum node at ' + ethereumUri);
  } else {
    console.log('connected to ehterum node at ' + ethereumUri);

    const coinbase = await web3.eth.getCoinbase();
    console.log('coinbase:' + coinbase);

    // const balance = web3.eth.getBalance(coinbase);
    // console.log('balance:' + web3.fromWei(balance, 'ether') + ' ETH');

    const accounts = web3.eth.accounts;
    console.log(accounts);

    // if (web3.personal.unlockAccount(address, 'user')) {
    //   console.log(`${address} is unlocaked`);
    // } else {
    //   console.log(`unlock failed, ${address}`);
    // }
  }

  /*
   * Compile Contract and Fetch ABI
   */
  const compiledContract = compileContract('../contracts/hello.sol');

  let bytecode;
  let abi;

  for (const contractName in compiledContract.contracts) {
    // code and ABI that are needed by web3
    // console.log(contractName + ': ' + compiledContract.contracts[contractName].bytecode);
    // console.log(contractName + '; ' + JSON.parse(compiledContract.contracts[contractName].interface));
    bytecode = compiledContract.contracts[contractName].bytecode;
    abi = JSON.parse(compiledContract.contracts[contractName].interface);
  }

  console.log(JSON.stringify(abi, undefined, 2));

  /*
   * deploy contract
   */
  const gasEstimate = await web3.eth.estimateGas({ data: '0x' + bytecode });
  console.log('gasEstimate = ' + gasEstimate);
  const contract = new web3.eth.Contract(abi);
  console.log('deploying contract...');

  const contractSend = contract.deploy({
    data: '0x' + bytecode,
    arguments: args,
  });

  const newContractInstance = await contractSend.send({
    from: from || address,
    gas: gas || gasEstimate.toString(),
  });

  return newContractInstance.options;
};
