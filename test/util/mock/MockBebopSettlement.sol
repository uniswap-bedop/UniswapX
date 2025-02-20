// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {IBebopSettlement} from "src/interfaces/IBebopSettlement.sol";
import {Order} from "src/lib/Order.sol";
import {Signature} from "src/lib/Signature.sol";
import {Transfer} from "src/lib/Transfer.sol";

contract MockBebopSettlement is IBebopSettlement {
    function swapSingle(
        Order.Single calldata order,
        Signature.MakerSignature calldata makerSignature,
        uint256 filledTakerAmount
    ) external payable override {
        emit BebopOrder(0);
    }

    function swapSingleFromContract(
        Order.Single calldata order,
        Signature.MakerSignature calldata makerSignature
    ) external payable override {
        emit BebopOrder(1);
    }

    function settleSingle(
        Order.Single calldata order,
        Signature.MakerSignature calldata makerSignature,
        uint256 filledTakerAmount,
        Transfer.OldSingleQuote calldata takerQuoteInfo,
        bytes calldata takerSignature
    ) external payable override {
        emit BebopOrder(2);
    }

    function settleSingleAndSignPermit(
        Order.Single calldata order,
        Signature.MakerSignature calldata makerSignature,
        uint256 filledTakerAmount,
        Transfer.OldSingleQuote calldata takerQuoteInfo,
        bytes calldata takerSignature,
        Signature.PermitSignature calldata takerPermitSignature
    ) external payable override {
        emit BebopOrder(3);
    }

    function settleSingleAndSignPermit2(
        Order.Single calldata order,
        Signature.MakerSignature calldata makerSignature,
        uint256 filledTakerAmount,
        Transfer.OldSingleQuote calldata takerQuoteInfo,
        bytes calldata takerSignature,
        Signature.Permit2Signature calldata takerPermit2Signature
    ) external payable override {
        emit BebopOrder(4);
    }
}
