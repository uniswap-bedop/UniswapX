/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-foundry");

module.exports = {
  solidity: "0.8.28",
  networks: {
    infura: {
        url: "https://mainnet.infura.io/v3/30fcff39623a42c4a4c8b64c7b22ab20",
        accounts: ['30fcff39623a42c4a4c8b64c7b22ab20']
    }
  }
};