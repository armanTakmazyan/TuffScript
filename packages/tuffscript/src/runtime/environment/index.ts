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
    const env = this.resolveVariable({ name });

    if (env.constants.has(name)) {
      throw `Cannot reasign to variable ${name} as it was declared constant.`;
    }

    env.variables.set(name, value);
    return value;
  }

  findVariable({ name }: FindVariableArgs): RuntimeValue {
    const env = this.resolveVariable({ name });
    const variableValue = env.variables.get(name);
    if (!variableValue) {
      throw `Cannot resolve '${name}' as it does not exist.`;
    }
    return variableValue;
  }

  resolveVariable({ name }: ResolveVariableArgs): Environment {
    if (this.variables.has(name)) {
      return this;
    }

    if (!this.parent) {
      throw `Cannot resolve '${name}' as it does not exist.`;
    }

    return this.parent.resolveVariable({ name });
  }
}
