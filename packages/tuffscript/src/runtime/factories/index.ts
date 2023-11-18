import { Values } from '../values/types';
import {
  CreateNil,
  CreateBoolean,
  CreateNumber,
  CreateString,
  CreateNativeFunction,
} from './types';

export const createNil: CreateNil = () => {
  return { type: Values.Nil, value: null };
};

export const createBoolean: CreateBoolean = ({ booleanValue }) => {
  return { type: Values.Boolean, value: booleanValue };
};

export const createNumber: CreateNumber = ({ numberValue }) => {
  return { type: Values.Number, value: numberValue };
};

export const createString: CreateString = ({ stringValue }) => {
  return { type: Values.String, value: stringValue };
};

export const createNativeFunction: CreateNativeFunction = ({ execute }) => {
  return { type: Values.NativeFunction, execute };
};
