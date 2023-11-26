import { Values, RuntimeValue } from '../values/types';
import {
  IsNameDefinedInScopeArgs,
  CreateConstantArgs,
  SetVariableValueArgs,
  GetVariableValueArgs,
  FindVariableEnvironmentArgs,
} from './types';

export class Environment {
  private parent?: Environment;
  private constants: Map<string, RuntimeValue>;
  private variables: Map<string, RuntimeValue>;

  constructor(parentENV?: Environment) {
    this.parent = parentENV;
    this.variables = new Map();
    this.constants = new Map();
  }

  isNameDefinedInScope({ name }: IsNameDefinedInScopeArgs): boolean {
    return this.variables.has(name) || this.constants.has(name);
  }

  createConstant({ name, value }: CreateConstantArgs): RuntimeValue {
    if (this.isNameDefinedInScope({ name })) {
      throw `Cannot declare variable ${name}. As it already is defined.`;
    }

    this.constants.set(name, value);

    return value;
  }

  setVariableValue({ name, value }: SetVariableValueArgs): RuntimeValue {
    if (this.constants.has(name)) {
      throw `Cannot reasign to variable ${name} as it was declared constant.`;
    }

    this.variables.set(name, value);
    return value;
  }

  getVariableValue({ name }: GetVariableValueArgs): RuntimeValue {
    const environment = this.findVariableEnvironment({ name });
    const variableValue =
      environment?.variables.get(name) || environment?.constants.get(name);

    if (variableValue?.type === Values.Unassigned) {
      throw new Error(
        `ReferenceError: local variable '${name}' referenced before assignment`,
      );
    }

    if (!variableValue) {
      throw `Cannot resolve '${name}' as it does not exist.`;
    }

    return variableValue;
  }

  findVariableEnvironment({
    name,
  }: FindVariableEnvironmentArgs): Environment | undefined {
    if (this.isNameDefinedInScope({ name })) {
      return this;
    }

    if (!this.parent) {
      return;
    }

    return this.parent.findVariableEnvironment({ name });
  }
}
