// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.0;

import { Owned } from 'solmate/src/auth/Owned.sol';
import { SafeTransferLib } from 'solmate/src/utils/SafeTransferLib.sol';
import { ERC20 } from 'solmate/src/tokens/ERC20.sol';
import { WETH } from 'solmate/src/tokens/WETH.sol';
import { IReactorCallback } from '../interfaces/IReactorCallback.sol';
import { IReactor } from '../interfaces/IReactor.sol';
import { CurrencyLibrary } from '../lib/CurrencyLibrary.sol';
import { ResolvedOrder, SignedOrder } from '../base/ReactorStructs.sol';
import { Order } from '../lib/Order.sol';
import { Signature } from '../lib/Signature.sol';
import { ISwapRouter02 } from '../external/ISwapRouter02.sol';
import { IBebopSettlement } from '../interfaces/IBebopSettlement.sol';
import { Transfer } from '../lib/Transfer.sol';

import { console } from 'forge-std/console.sol';

/// @notice A fill contract that uses SwapRouter02 to execute trades
contract SwapRouter02ExecutorNew is IReactorCallback, Owned {
    using SafeTransferLib for ERC20;
    using CurrencyLibrary for address;

    /// @notice thrown if reactorCallback is called with a non-whitelisted filler
    error CallerNotWhitelisted();
    /// @notice thrown if reactorCallback is called by an address other than the reactor
    error MsgSenderNotReactor();

    ISwapRouter02 private immutable swapRouter02;
    IBebopSettlement private immutable bebop;
    address private immutable whitelistedCaller;
    IReactor private immutable reactor;
    WETH private immutable weth;

    modifier onlyWhitelistedCaller() {
        if (msg.sender != whitelistedCaller) {
            revert CallerNotWhitelisted();
        }
        _;
    }

    modifier onlyReactor() {
        if (msg.sender != address(reactor)) {
            revert MsgSenderNotReactor();
        }
        _;
    }

    constructor(
        address _whitelistedCaller,
        IReactor _reactor,
        address _owner,
        ISwapRouter02 _swapRouter02,
        IBebopSettlement _bebop
    ) Owned(_owner) {
        whitelistedCaller = _whitelistedCaller;
        reactor = _reactor;
        swapRouter02 = _swapRouter02;
        bebop = _bebop;
        weth = WETH(payable(_swapRouter02.WETH9()));
    }

    /// @notice assume that we already have all output tokens
    function execute(SignedOrder calldata order, bytes calldata callbackData) external onlyWhitelistedCaller {
        reactor.executeWithCallback(order, callbackData);
    }

    /// @notice assume that we already have all output tokens
    function executeBatch(SignedOrder[] calldata orders, bytes calldata callbackData) external onlyWhitelistedCaller {
        reactor.executeBatchWithCallback(orders, callbackData);
    }

    function reactorCallback(ResolvedOrder[] calldata orders, bytes calldata callbackData) external onlyReactor {
        (
            address tokenIn,
            address tokenOut,
            Order.Single memory order,
            Signature.MakerSignature memory makerSigx,
            uint256 filledTakerAmount
        ) = abi.decode(callbackData, (address, address, Order.Single, Signature.MakerSignature, uint256));

        // leftover logic
        if (orders.length > 0) {
            uint256 dutchOrderAmount = orders[0].input.amount;
            uint256 bebopTakerAmount = order.taker_amount;

            if (bebopTakerAmount > dutchOrderAmount) {
                uint256 leftoverPositiveAmount = bebopTakerAmount - dutchOrderAmount;
                ERC20(order.taker_token).transferFrom(order.taker_address, address(this), leftoverPositiveAmount);
            }

            if (dutchOrderAmount > bebopTakerAmount) {
                uint256 leftoverNegativeAmount = dutchOrderAmount - bebopTakerAmount;
                ERC20(order.taker_token).transfer(order.taker_address, leftoverNegativeAmount);
            }
        }

        bebop.swapSingle(order, makerSigx, filledTakerAmount);
    }

    /// @notice This function can be used to convert ERC20s to ETH that remains in this contract
    /// @param tokensToApprove Max approve these tokens to swapRouter02
    /// @param multicallData Pass into swapRouter02.multicall()
    function multicall(ERC20[] calldata tokensToApprove, bytes[] calldata multicallData) external onlyOwner {
        for (uint256 i = 0; i < tokensToApprove.length; i++) {
            tokensToApprove[i].safeApprove(address(swapRouter02), type(uint256).max);
        }
        swapRouter02.multicall(type(uint256).max, multicallData);
    }

    /// @notice Unwraps the contract's WETH9 balance and sends it to the recipient as ETH. Can only be called by owner.
    /// @param recipient The address receiving ETH
    function unwrapWETH(address recipient) external onlyOwner {
        uint256 balanceWETH = weth.balanceOf(address(this));

        weth.withdraw(balanceWETH);
        SafeTransferLib.safeTransferETH(recipient, address(this).balance);
    }

    /// @notice Transfer all ETH in this contract to the recipient. Can only be called by owner.
    /// @param recipient The recipient of the ETH
    function withdrawETH(address recipient) external onlyOwner {
        SafeTransferLib.safeTransferETH(recipient, address(this).balance);
    }

    /// @notice Necessary for this contract to receive ETH when calling unwrapWETH()
    receive() external payable {}
}
