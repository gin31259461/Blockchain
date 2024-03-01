import ganache from 'ganache';
import { deploy } from './web3-deploy';

(async () => {
  try {
    await deploy({
      contractFileName: 'hello',
      provider: ganache.provider(),
      targetContractName: 'HelloWorld',
      interact: async (contract) => {
        if ('getMessage' in contract.methods) {
          const message = await contract.methods['getMessage']().call();
          console.log("This is the smart contract's message:\n\n" + message + '\n');
        }
      },
    });
  } catch (e) {
    console.log(e);
  }
})();
