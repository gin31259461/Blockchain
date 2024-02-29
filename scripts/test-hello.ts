import ganache from 'ganache';
import { deploy } from './web3-deploy';

(async () => {
  try {
    await deploy('hello', ganache.provider());
  } catch (e) {
    console.log(e);
  }
})();
