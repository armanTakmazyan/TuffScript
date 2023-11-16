import {
  NilValue,
  BooleanValue,
  NumberValue,
  FunctionCall,
  NativeFuctionValue,
} from '../values/types';

export type CreateNil = () => NilValue;

export interface CreateBooleanArgs {
  booleanValue: boolean;
}

export type CreateBoolean = (args: CreateBooleanArgs) => BooleanValue;

export interface CreateNumberValueArgs {
  numberValue: number;
}

export type CreateNumberValue = (args: CreateNumberValueArgs) => NumberValue;

export interface CreateNativeFunctionArgs {
  execute: FunctionCall;
}

export type CreateNativeFunction = (
  args: CreateNativeFunctionArgs,
) => NativeFuctionValue;
