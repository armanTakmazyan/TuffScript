import { Environment } from '../environment';
import { Expressions } from '../../frontend/ast/types';

export enum Values {
  Nil = 'Nil',
  Boolean = 'Boolean',
  Number = 'Number',
  String = 'String',
  Object = 'Object',
  NativeFunction = 'NativeFunction',
  Function = 'Function',
}

export interface BaseRuntimeValue {
  type: Values;
}

export interface NilValue extends BaseRuntimeValue {
  type: Values.Nil;
  value: null;
}

export interface NumberValue extends BaseRuntimeValue {
  type: Values.Number;
  value: number;
}

export interface StringValue extends BaseRuntimeValue {
  type: Values.String;
  value: string;
}

export interface FalseLiteral extends BaseRuntimeValue {
  type: Values.Boolean;
  value: false;
}

export interface TrueLiteral extends BaseRuntimeValue {
  type: Values.Boolean;
  value: true;
}

export type BooleanValue = FalseLiteral | TrueLiteral;

export interface ObjectValue extends BaseRuntimeValue {
  type: Values.Object;
  properties: Map<string, RuntimeValue>;
}

export type FunctionCall = (
  args: RuntimeValue[],
  env: Environment,
) => RuntimeValue;

export interface NativeFuctionValue extends BaseRuntimeValue {
  type: Values.NativeFunction;
  execute: FunctionCall;
}

export interface FunctionValue extends BaseRuntimeValue {
  type: Values.Function;
  name: string;
  arguments: string[];
  body: Expressions;
  declarationEnvironment: Environment;
}

export type RuntimeValue =
  | NilValue
  | BooleanValue
  | NumberValue
  | StringValue
  | ObjectValue
  | NativeFuctionValue
  | FunctionValue;
