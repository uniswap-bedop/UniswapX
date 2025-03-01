/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export declare namespace Order {
  export type AggregateStruct = {
    expiry: BigNumberish;
    taker_address: AddressLike;
    maker_addresses: AddressLike[];
    maker_nonces: BigNumberish[];
    taker_tokens: AddressLike[][];
    maker_tokens: AddressLike[][];
    taker_amounts: BigNumberish[][];
    maker_amounts: BigNumberish[][];
    receiver: AddressLike;
    commands: BytesLike;
    flags: BigNumberish;
  };

  export type AggregateStructOutput = [
    expiry: bigint,
    taker_address: string,
    maker_addresses: string[],
    maker_nonces: bigint[],
    taker_tokens: string[][],
    maker_tokens: string[][],
    taker_amounts: bigint[][],
    maker_amounts: bigint[][],
    receiver: string,
    commands: string,
    flags: bigint
  ] & {
    expiry: bigint;
    taker_address: string;
    maker_addresses: string[];
    maker_nonces: bigint[];
    taker_tokens: string[][];
    maker_tokens: string[][];
    taker_amounts: bigint[][];
    maker_amounts: bigint[][];
    receiver: string;
    commands: string;
    flags: bigint;
  };

  export type SingleStruct = {
    expiry: BigNumberish;
    taker_address: AddressLike;
    maker_address: AddressLike;
    maker_nonce: BigNumberish;
    taker_token: AddressLike;
    maker_token: AddressLike;
    taker_amount: BigNumberish;
    maker_amount: BigNumberish;
    receiver: AddressLike;
    packed_commands: BigNumberish;
    flags: BigNumberish;
  };

  export type SingleStructOutput = [
    expiry: bigint,
    taker_address: string,
    maker_address: string,
    maker_nonce: bigint,
    taker_token: string,
    maker_token: string,
    taker_amount: bigint,
    maker_amount: bigint,
    receiver: string,
    packed_commands: bigint,
    flags: bigint
  ] & {
    expiry: bigint;
    taker_address: string;
    maker_address: string;
    maker_nonce: bigint;
    taker_token: string;
    maker_token: string;
    taker_amount: bigint;
    maker_amount: bigint;
    receiver: string;
    packed_commands: bigint;
    flags: bigint;
  };
}

export interface BebopSigningInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "DOMAIN_SEPARATOR"
      | "hashAggregateOrder"
      | "hashSingleOrder"
      | "registerAllowedOrderSigner"
  ): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: "OrderSignerRegistered"): EventFragment;

  encodeFunctionData(
    functionFragment: "DOMAIN_SEPARATOR",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "hashAggregateOrder",
    values: [
      Order.AggregateStruct,
      BigNumberish,
      BigNumberish[][],
      BigNumberish[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "hashSingleOrder",
    values: [Order.SingleStruct, BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "registerAllowedOrderSigner",
    values: [AddressLike, boolean]
  ): string;

  decodeFunctionResult(
    functionFragment: "DOMAIN_SEPARATOR",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "hashAggregateOrder",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "hashSingleOrder",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "registerAllowedOrderSigner",
    data: BytesLike
  ): Result;
}

export namespace OrderSignerRegisteredEvent {
  export type InputTuple = [
    maker: AddressLike,
    signer: AddressLike,
    allowed: boolean
  ];
  export type OutputTuple = [maker: string, signer: string, allowed: boolean];
  export interface OutputObject {
    maker: string;
    signer: string;
    allowed: boolean;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface BebopSigning extends BaseContract {
  connect(runner?: ContractRunner | null): BebopSigning;
  waitForDeployment(): Promise<this>;

  interface: BebopSigningInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  DOMAIN_SEPARATOR: TypedContractMethod<[], [string], "view">;

  hashAggregateOrder: TypedContractMethod<
    [
      order: Order.AggregateStruct,
      partnerId: BigNumberish,
      updatedMakerAmounts: BigNumberish[][],
      updatedMakerNonces: BigNumberish[]
    ],
    [string],
    "view"
  >;

  hashSingleOrder: TypedContractMethod<
    [
      order: Order.SingleStruct,
      partnerId: BigNumberish,
      updatedMakerAmount: BigNumberish,
      updatedMakerNonce: BigNumberish
    ],
    [string],
    "view"
  >;

  registerAllowedOrderSigner: TypedContractMethod<
    [signer: AddressLike, allowed: boolean],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "DOMAIN_SEPARATOR"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "hashAggregateOrder"
  ): TypedContractMethod<
    [
      order: Order.AggregateStruct,
      partnerId: BigNumberish,
      updatedMakerAmounts: BigNumberish[][],
      updatedMakerNonces: BigNumberish[]
    ],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "hashSingleOrder"
  ): TypedContractMethod<
    [
      order: Order.SingleStruct,
      partnerId: BigNumberish,
      updatedMakerAmount: BigNumberish,
      updatedMakerNonce: BigNumberish
    ],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "registerAllowedOrderSigner"
  ): TypedContractMethod<
    [signer: AddressLike, allowed: boolean],
    [void],
    "nonpayable"
  >;

  getEvent(
    key: "OrderSignerRegistered"
  ): TypedContractEvent<
    OrderSignerRegisteredEvent.InputTuple,
    OrderSignerRegisteredEvent.OutputTuple,
    OrderSignerRegisteredEvent.OutputObject
  >;

  filters: {
    "OrderSignerRegistered(address,address,bool)": TypedContractEvent<
      OrderSignerRegisteredEvent.InputTuple,
      OrderSignerRegisteredEvent.OutputTuple,
      OrderSignerRegisteredEvent.OutputObject
    >;
    OrderSignerRegistered: TypedContractEvent<
      OrderSignerRegisteredEvent.InputTuple,
      OrderSignerRegisteredEvent.OutputTuple,
      OrderSignerRegisteredEvent.OutputObject
    >;
  };
}
