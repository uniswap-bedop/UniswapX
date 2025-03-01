/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../../common";
import type {
  SafeCast160,
  SafeCast160Interface,
} from "../../../../src/lib/common/SafeCast160";

const _abi = [
  {
    inputs: [],
    name: "UnsafeCast",
    type: "error",
  },
] as const;

const _bytecode =
  "0x60566050600b82828239805160001a6073146043577f4e487b7100000000000000000000000000000000000000000000000000000000600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220dbffb2e1a46aaad8e8e79f1af599b932405e1df12b9a5c6fd2847f8730557dc364736f6c634300081c0033";

type SafeCast160ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SafeCast160ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SafeCast160__factory extends ContractFactory {
  constructor(...args: SafeCast160ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      SafeCast160 & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): SafeCast160__factory {
    return super.connect(runner) as SafeCast160__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SafeCast160Interface {
    return new Interface(_abi) as SafeCast160Interface;
  }
  static connect(address: string, runner?: ContractRunner | null): SafeCast160 {
    return new Contract(address, _abi, runner) as unknown as SafeCast160;
  }
}
