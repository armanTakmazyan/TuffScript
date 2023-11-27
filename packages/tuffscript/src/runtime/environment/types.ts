import { Expressions, Program } from '../../frontend/ast/types';
import { RuntimeValue } from '../values/types';
import { Environment } from './index';

export interface IsNameDefinedInScopeArgs {
  name: string;
}

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

interface SetupExecutionContextArgs {
  environment: Environment;
  expressions: Expressions;
}

export type SetupExecutionContext = (
  args: SetupExecutionContextArgs,
) => Environment;

export interface CreateGlobalEnvironmentArgs {
  program: Program;
}
