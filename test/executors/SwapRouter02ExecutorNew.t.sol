// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import { Test } from 'forge-std/Test.sol';
import { Vm } from 'forge-std/Vm.sol';
import { console } from 'forge-std/console.sol';

// Contract under test
import { SwapRouter02ExecutorNew } from 'src/sample-executors/SwapRouter02ExecutorNew.sol';
import { MockERC20 } from '../util/mock/MockERC20.sol';
import { IReactor } from 'src/interfaces/IReactor.sol';
import { IBebopSettlement } from 'src/interfaces/IBebopSettlement.sol';
import { MockBebopSettlement } from '../util/mock/MockBebopSettlement.sol';
import { WETH } from 'solmate/src/tokens/WETH.sol';
import { IPermit2 } from 'permit2/src/interfaces/IPermit2.sol';
import { PermitSignature } from '../util/PermitSignature.sol';
import { SwapRouter02Executor } from '../../src/sample-executors/SwapRouter02Executor.sol';
import { MockSwapRouter } from '../util/mock/MockSwapRouter.sol';
import { DutchOrderReactor } from '../../src/reactors/DutchOrderReactor.sol';
import { DeployPermit2 } from '../util/DeployPermit2.sol';
import { ISwapRouter02 } from '../../src/external/ISwapRouter02.sol';
import { Order } from '../../src/lib/Order.sol';
import { ResolvedOrder } from '../../src/base/ReactorStructs.sol';
import { Signature } from '../../src/lib/Signature.sol';
import { BebopSettlement } from '../../src/settlement/BebopSettlement.sol';

contract SwapRouter02ExecutorTest is Test, PermitSignature, DeployPermit2 {
    address internal owner;
    address internal whitelisted;
    address internal nonWhitelisted;

    uint256 fillerPrivateKey;
    uint256 swapperPrivateKey;
    MockERC20 tokenIn;
    MockERC20 tokenOut;
    WETH weth;
    address filler;
    address swapper;
    SwapRouter02ExecutorNew swapRouter02ExecutorNew;
    MockSwapRouter mockSwapRouter;
    DutchOrderReactor reactor;
    IPermit2 permit2;
    BebopSettlement internal bebopTest;

    address constant PROTOCOL_FEE_OWNER = address(80085);

    function setUp() public {
        vm.warp(1000);

        // Mock input/output tokens
        tokenIn = new MockERC20('Input', 'IN', 18);
        tokenOut = new MockERC20('Output', 'OUT', 18);
        weth = new WETH();

        // Mock filler and swapper
        fillerPrivateKey = 0x12341234;
        filler = vm.addr(fillerPrivateKey);
        swapperPrivateKey = 0x12341235;
        swapper = vm.addr(swapperPrivateKey);

        // Instantiate relevant contracts
        mockSwapRouter = new MockSwapRouter(address(weth));
        permit2 = IPermit2(deployPermit2());
        reactor = new DutchOrderReactor(permit2, PROTOCOL_FEE_OWNER);
        bebopTest = new BebopSettlement(
            address(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2),
            address(permit2),
            address(0x6B175474E89094C44Da98b954EedeAC495271d0F)
        );

        swapRouter02ExecutorNew = new SwapRouter02ExecutorNew(
            address(this),
            reactor,
            address(this),
            ISwapRouter02(address(mockSwapRouter)),
            IBebopSettlement(address(bebopTest))
        );

        // Do appropriate max approvals
        tokenIn.forceApprove(swapper, address(permit2), type(uint256).max);
    }

    function testReactorCallback() public {
        uint256 inputAmount = 10 ** 18;
        uint256 outputAmount = inputAmount;

        tokenIn.mint(address(swapper), inputAmount * 10);
        tokenOut.mint(address(mockSwapRouter), outputAmount * 10);
        tokenIn.forceApprove(swapper, address(permit2), type(uint256).max);

        Order.Single memory order;
        order.expiry = 1739922415;
        order.taker_address = address(swapRouter02ExecutorNew);
        order.taker_token = address(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266);
        order.maker_address = address(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266);
        order.maker_token = address(0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913);
        order.taker_amount = inputAmount;
        order.maker_amount = inputAmount * 2;
        order.maker_nonce = 1738726891508;
        order.receiver = address(0x70997970C51812dc3A010C7d01b50e0d17dc79C8);

        tokenIn.mint(address(swapRouter02ExecutorNew), 10 ** 18);
        tokenOut.mint(address(mockSwapRouter), 10 ** 18);
        ResolvedOrder[] memory resolvedOrders = new ResolvedOrder[](0);
        Signature.MakerSignature memory makerSigx;
        makerSigx
            .signatureBytes = hex'4355c47d63924e8a72e509b65029052eb6c299d53a04e167c5775fd466751c9d07299936d304c153f6443dfa05f40ff007d72911b6f72307f996231605b915621c';

        bytes memory callbackData = abi.encode(tokenIn, tokenOut, order, makerSigx, 10 ** 18);

        vm.prank(address(reactor));

        swapRouter02ExecutorNew.reactorCallback(resolvedOrders, callbackData);

        assertEq(tokenIn.balanceOf(address(swapRouter02ExecutorNew)), 10 ** 18);
    }
}
