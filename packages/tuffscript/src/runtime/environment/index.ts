import { RuntimeValue } from '../values/types';
import {
  CreateConstantArgs,
  SetVariableValueArgs,
  GetVariableValueArgs,
  FindVariableEnvironmentArgs,
} from './types';

export class Environment {
  private parent?: Environment;
  private constants: Set<string>;
  private variables: Map<string, RuntimeValue>;

  constructor(parentENV?: Environment) {
    this.parent = parentENV;
    this.variables = new Map();
    this.constants = new Set();
  }

  createConstant({ name, value }: CreateConstantArgs): RuntimeValue {
    if (this.variables.has(name) || this.constants.has(name)) {
      throw `Cannot declare variable ${name}. As it already is defined.`;
    }

    this.constants.add(name);

    return value;
  }

  setVariableValue({ name, value }: SetVariableValueArgs): RuntimeValue {
    const environment = this.findVariableEnvironment({ name }) ?? this;

    if (environment.constants.has(name)) {
      throw `Cannot reasign to variable ${name} as it was declared constant.`;
    }

    environment.variables.set(name, value);
    return value;
  }

  getVariableValue({ name }: GetVariableValueArgs): RuntimeValue {
    const environment = this.findVariableEnvironment({ name });
    const variableValue = environment?.variables?.get?.(name);
    if (!variableValue) {
      throw `Cannot resolve '${name}' as it does not exist.`;
    }
    return variableValue;
  }

  findVariableEnvironment({
    name,
  }: FindVariableEnvironmentArgs): Environment | undefined {
    if (this.variables.has(name)) {
      return this;
    }

    if (!this.parent) {
      return;
    }

    return this.parent.findVariableEnvironment({ name });
  }
}
