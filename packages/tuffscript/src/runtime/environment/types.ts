import { RuntimeValue } from '../values/types';

export interface CreateConstantArgs {
  name: string;
  value: RuntimeValue;
}

export interface SetVariableValueArgs {
  name: string;
  value: RuntimeValue;
}

export interface GetVariableValueArgs {
  name: string;
}

export interface FindVariableEnvironmentArgs {
  name: string;
}
