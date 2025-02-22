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
import { ERC1271WalletMock } from 'permit2/lib/openzeppelin-contracts/contracts/mocks/ERC1271WalletMock.sol';
import 'lib/openzeppelin-contracts/contracts/interfaces/IERC1271.sol';

contract SwapRouter02ExecutorNewTest is Test, PermitSignature, DeployPermit2 {
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
    ERC1271WalletMock internal erc1271WalletMock;

    address constant PROTOCOL_FEE_OWNER = address(80085);

    function setUp() public {
        //vm.warp(1000);
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
        uint256 inputAmount = 1;
        uint256 outputAmount = inputAmount;

        tokenIn.mint(address(swapRouter02ExecutorNew), inputAmount * 10);
        tokenOut.mint(address(swapRouter02ExecutorNew), outputAmount * 10);
        weth.deposit{ value: 1 ether }();

        uint256 makerPrivateKey = 0x1234123412341234123412341234123412341234123412341234123412341234;
        address makerAddress = vm.addr(makerPrivateKey);

        Order.Single memory order;
        order.expiry = block.timestamp + 1000;
        order.taker_address = address(swapRouter02ExecutorNew);
        order.taker_token = address(weth);
        order.maker_address = 0x82637ed11beef09e7008bd982aa99d54bbb42613cb3d05319350cff813f61e34;
        order.maker_token = address(tokenOut);
        order.taker_amount = 1 ether;
        order.maker_amount = 2710600;
        order.maker_nonce = 1738726891508;
        address receiver = vm.addr(1);
        order.receiver = address(swapRouter02ExecutorNew);

        weth.approve(address(swapRouter02ExecutorNew), type(uint256).max);
        weth.approve(address(order.receiver), type(uint256).max);

        tokenIn.forceApprove(address(swapRouter02ExecutorNew), order.receiver, type(uint256).max);
        tokenOut.forceApprove(address(swapRouter02ExecutorNew), order.receiver, type(uint256).max);

        tokenOut.mint(order.taker_address, 10 ** 18);
        tokenOut.mint(order.maker_address, 10 ** 18);
        weth.deposit{ value: 1 ether }();
        weth.transfer(address(order.receiver), 1 ether);
        vm.deal(address(weth), 1 ether);
        deal(address(weth), address(swapRouter02ExecutorNew), 10 ** 18);

        tokenIn.mint(address(swapRouter02ExecutorNew), 10 ** 18);
        tokenOut.mint(address(mockSwapRouter), 10 ** 18);
        ResolvedOrder[] memory resolvedOrders = new ResolvedOrder[](0);
        bytes32 orderHash = keccak256(abi.encode(order));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(makerPrivateKey, orderHash);

        Signature.MakerSignature memory makerSigx;
        makerSigx.signatureBytes = abi.encodePacked(r, s, v);

        makerSigx.flags = 1;
        bytes memory callbackData = abi.encode(tokenIn, tokenOut, order, makerSigx, 0);

        vm.prank(address(swapRouter02ExecutorNew));
        weth.approve(address(swapRouter02ExecutorNew), type(uint256).max);

        vm.prank(address(reactor));
        swapRouter02ExecutorNew.reactorCallback(resolvedOrders, callbackData);

        assertEq(tokenIn.balanceOf(address(swapRouter02ExecutorNew)), 10 ** 18);
    }
}
