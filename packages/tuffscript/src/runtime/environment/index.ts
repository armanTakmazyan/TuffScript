import { RuntimeValue } from '../values/types';

interface CreateConstantArgs {
  name: string;
  value: RuntimeValue;
}

interface AssignVariableArgs {
  name: string;
  value: RuntimeValue;
}

interface FindVariableArgs {
  name: string;
}

interface ResolveVariableArgs {
  name: string;
}

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
    if (this.variables.has(name)) {
      throw `Cannot declare variable ${name}. As it already is defined.`;
    }

    this.constants.add(name);

    return value;
  }

  assignVariable({ name, value }: AssignVariableArgs): RuntimeValue {
    const environment = this.resolveVariable({ name }) ?? this;

    if (environment.constants.has(name)) {
      throw `Cannot reasign to variable ${name} as it was declared constant.`;
    }

    environment.variables.set(name, value);
    return value;
  }

  findVariable({ name }: FindVariableArgs): RuntimeValue {
    const environment = this.resolveVariable({ name });
    const variableValue = environment?.variables?.get?.(name);
    if (!variableValue) {
      throw `Cannot resolve '${name}' as it does not exist.`;
    }
    return variableValue;
  }

  resolveVariable({ name }: ResolveVariableArgs): Environment | undefined {
    if (this.variables.has(name)) {
      return this;
    }

    if (!this.parent) {
      return;
    }

    return this.parent.resolveVariable({ name });
  }
}
