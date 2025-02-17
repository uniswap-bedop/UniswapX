import { DutchOrder, DutchOrderBuilder, NonceManager } from '@uniswap/uniswapx-sdk';
import { DutchOrderReactor, WETH } from '../../typechain-types';

const { expect } = require('chai');
import hre from 'hardhat';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';
import { ZeroAddress } from 'ethers';
import { HardhatEthersProvider } from '@nomicfoundation/hardhat-ethers/internal/hardhat-ethers-provider';

const ethers = require('oldethers');
import { BigNumber } from 'oldethers';
describe('Bebop', function () {
    let dutchReactor: DutchOrderReactor;
    let permit2;
    let executor;
    let WETH: WETH;

    this.beforeAll(async function () {
        WETH = await hre.ethers.getContractAt('WETH', '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2');
        permit2 = await hre.ethers.getContractAt('IPermit2', '0x000000000022D473030F116dDEE9F6B43aC78BA3');
        dutchReactor = await hre.ethers.deployContract('DutchOrderReactor', [permit2, ZeroAddress]);
    });

    it('Passed order should parse correctly', async function () {
        // get some weth

        let signers = await hre.ethers.getSigners();
        const deadline = Math.floor(Date.now() / 1000) + 1000;

        await WETH.connect(signers[0]).deposit({ value: 1000000000 });
        expect(await WETH.balanceOf(signers[0].address), 1000000000);
        // create a signed order and pass to dutch order reactor

        const provider = new ethers.providers.JsonRpcProvider();
        const account = await provider.getSigner().getAddress();
        const nonceMgr = new NonceManager(provider, 1);
        const nonce = await nonceMgr.useNonce(account);
        const builder = new DutchOrderBuilder(1, permit2.address, dutchReactor.address);
        const order = builder
            .deadline(deadline)
            .decayEndTime(deadline)
            .decayStartTime(deadline - 100)
            .nonce(nonce)
            .input({
                token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',

                startAmount: BigNumber.from('1000000000000000000'),
                endAmount: BigInt(90000000000000),
            })
            .output({
                token: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
                recipient: '0x0000000000000000000000000000000000000000',

                startAmount: BigNumber.from('1000000000000000000'),
                endAmount: BigInt(90000000000000),
            })
            .swapper(signers[0].address)
            .validation({ additionalValidationData: 'blah', additionalValidationContract: ZeroAddress })
            .build();
        //sign order

        let { domain, types, values } = order.permitData();
        const signature = await signers[0].signTypedData(
            {
                name: domain.name,
                salt: domain.salt?.toString(),
                verifyingContract: domain.verifyingContract,
                version: domain.version,
            },
            types,
            values
        );

        await dutchReactor.execute({
            order: order.hash(),
            sig: signature,
        });
    });

    it('Passed Bebop data should decode correctly', async function () {
        //get BEBOP tx (encoded calldata) and pass it as
    });

    it('Passed Bebop order should execute correctly, swapper having input token', async function () {});

    // it("Should set the right unlockTime", async function () {
    //   //get a standard ERC20 approval

    //   //get a BEBOP quote

    //   const quote = console.log(
    //     await hre.ethers.provider.call({
    //       to: "0xbbbbbBB520d69a9775E85b458C58c648259FAD5F",
    //       value: "0x0",
    //       data: "0x4dcebcba0000000000000000000000000000000000000000000000000000000067af7d95000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb9226600000000000000000000000051c72848c68a965f66fa7a88855f9f7784502a7f00000000000000000000000000000000000000000000000000000329a9056ad5000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec7000000000000000000000000000000000000000000000000016345785d8a000000000000000000000000000000000000000000000000000000000000102812fa000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb9226600000000000000000000000000000000000000000000000000000000000000003f08b056975bfaed44e7fc8062d4a4a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000004182ed7cb10fc0c3b17707c1dd639d93e3ed0b865392a05d7e857d87cec960766c12c8e1f22850598abb8ba3e22b892c496833f31477c1d87c446504245af8528d1b00000000000000000000000000000000000000000000000000000000000000",
    //       from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    //       gas: 91793,
    //       gasPrice: 1186930437,
    //     })
    //   );
    // });
});
