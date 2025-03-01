/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  BebopTransfer,
  BebopTransferInterface,
} from "../../../src/base/BebopTransfer";

const _abi = [
  {
    inputs: [],
    name: "NullBeneficiary",
    type: "error",
  },
  {
    inputs: [],
    name: "PartnerAlreadyRegistered",
    type: "error",
  },
  {
    inputs: [],
    name: "PartnerFeeTooHigh",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    name: "partners",
    outputs: [
      {
        internalType: "uint16",
        name: "fee",
        type: "uint16",
      },
      {
        internalType: "address",
        name: "beneficiary",
        type: "address",
      },
      {
        internalType: "bool",
        name: "registered",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "partnerId",
        type: "uint64",
      },
      {
        internalType: "uint16",
        name: "fee",
        type: "uint16",
      },
      {
        internalType: "address",
        name: "beneficiary",
        type: "address",
      },
    ],
    name: "registerPartner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class BebopTransfer__factory {
  static readonly abi = _abi;
  static createInterface(): BebopTransferInterface {
    return new Interface(_abi) as BebopTransferInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): BebopTransfer {
    return new Contract(address, _abi, runner) as unknown as BebopTransfer;
  }
}
