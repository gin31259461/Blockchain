import ganache from 'ganache';
import { deploy } from './web3-deploy';

(async () => {
  try {
    await deploy<any>({
      contractFileName: 'bank-contract',
      provider: ganache.provider(),
      targetContractName: 'BankContract',
      actions: [{ name: 'getContractBalance', args: [] }],
    });
  } catch (e) {
    console.log(e);
  }
})();
