const Web3 = require('web3');
const TokenABI = require('./abi/token.json');

const binanceProvider={
    56:[
        'https://bsc-mainnet.nodereal.io/v1/4c8fa93b08cd4cd9aad61e59ebf91206',
        'https://bsc-mainnet.nodereal.io/v1/4c8fa93b08cd4cd9aad61e59ebf91206',
        'https://bsc-mainnet.nodereal.io/v1/4c8fa93b08cd4cd9aad61e59ebf91206'
    ],
    97:[
        'https://data-seed-prebsc-1-s1.binance.org:8545/',
        'https://data-seed-prebsc-2-s1.binance.org:8545/',
        'https://data-seed-prebsc-1-s2.binance.org:8545/'
    ],
    80001:[
        new Web3('https://rpc.ankr.com/polygon_mumbai'),
        new Web3('https://matic-mumbai.chainstacklabs.com'),
        new Web3('https://rpc-mumbai.maticvigil.com')
    ],
}

const smartContract = (abi, contractAddress, chain_id = 56, i = 0) => {
  const web3 = new Web3(binanceProvider[chain_id][i])

  return new web3.eth.Contract(abi, contractAddress);
}

const approve = async (tokenAddress, contractAddress, privateKey, amount, userAddress) => {
  const web3 = new Web3(binanceProvider[56][0]);
  let contractInstance = smartContract(TokenABI, contractAddress);

  let gasPrice = await web3.eth.getGasPrice()
  const nonce = await web3.eth.getTransactionCount(userAddress);

  let method = await contractInstance.methods.approve(contractAddress, amount);
  let txData = method.encodeABI();
  let estimateGas = await web3.eth.estimateGas({
      from: userAddress,
      to: tokenAddress,
      data: txData
  })
  console.log(estimateGas, 1);
  let tx = {
      to: tokenAddress,
      value: 0,
      gas: estimateGas,
      gasPrice: gasPrice,
      data: txData,
      nonce: nonce
  }
  console.log(tx, 2);

  const signed = await web3.eth.accounts.signTransaction(tx, privateKey)
  console.log(signed);
  const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction)

  console.log(receipt, 3);
}

module.exports = approve;
