import { HardhatUserConfig } from "hardhat/types";

/** @type import('hardhat/config').HardhatUserConfig */
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-foundry";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      forking: {
        enabled: true,

        url: "https://mainnet.infura.io/v3/100a0970864f4dde865358262e3d5bb4",
      },
    },
  },
};
export default config;
