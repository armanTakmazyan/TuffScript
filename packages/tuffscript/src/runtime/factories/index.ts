import { Values } from '../values/types';
import {
  CreateNil,
  CreateBoolean,
  CreateNumberValue,
  CreateNativeFunction,
} from './types';

export const createNil: CreateNil = () => {
  return { type: Values.Nil, value: null };
};

export const createBoolean: CreateBoolean = ({ booleanValue }) => {
  return { type: Values.Boolean, value: booleanValue };
};

export const createNumber: CreateNumberValue = ({ numberValue }) => {
  return { type: Values.Number, value: numberValue };
};

export const createNativeFunction: CreateNativeFunction = ({ execute }) => {
  return { type: Values.NativeFunction, execute };
};
