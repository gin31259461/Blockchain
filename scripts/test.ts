import { deploy } from './web3-deploy';

(async () => {
  try {
    await deploy('hello');
  } catch (e) {
    console.log(e);
  }
})();
