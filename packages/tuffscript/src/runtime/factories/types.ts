import {
  NilValue,
  BooleanValue,
  StringValue,
  NumberValue,
  FunctionCall,
  NativeFuctionValue,
} from '../values/types';

export type CreateNil = () => NilValue;

export interface CreateBooleanArgs {
  booleanValue: boolean;
}

export type CreateBoolean = (args: CreateBooleanArgs) => BooleanValue;

export interface CreateNumberArgs {
  numberValue: number;
}

export type CreateNumber = (args: CreateNumberArgs) => NumberValue;

export interface CreateStringArgs {
  stringValue: string;
}

export type CreateString = (args: CreateStringArgs) => StringValue;

export interface CreateNativeFunctionArgs {
  execute: FunctionCall;
}

export type CreateNativeFunction = (
  args: CreateNativeFunctionArgs,
) => NativeFuctionValue;
