import {
  Values,
  NilValue,
  BooleanValue,
  NumberValue,
  NativeFuctionValue,
  FunctionCall,
} from './types';

export const createNativeFunction = (
  execute: FunctionCall,
): NativeFuctionValue => {
  return { type: Values.NativeFunction, execute };
};

export const createNumber = (n = 0): NumberValue => {
  return { type: Values.Number, value: n };
};

export const createBoolean = (b = true): BooleanValue => {
  return { type: Values.Boolean, value: b };
};

export const createNil = (): NilValue => {
  return { type: Values.Nil, value: null };
};
