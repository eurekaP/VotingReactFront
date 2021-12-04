import Web3 from "web3";

const getWeb3 = () =>
  new Promise((resolve, reject) => {
      let web3 = null;
      if (typeof web3 !== 'undefined') {
        web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
        
        resolve(web3);
      } else {
        resolve(web3);
      }
  });

export default getWeb3;
