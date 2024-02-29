import { deploy } from './deploy';

(async () => {
  try {
    const result = await deploy('HelloWorld', []);
    console.log(`address: ${result.address}`);
  } catch (e) {
    // console.log(e.message);
  }
})();
