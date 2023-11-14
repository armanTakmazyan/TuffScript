import { Values, FunctionValue } from '../values/types';
import { EvaluateFunctionDeclarationArgs } from './types';

export function evaluateFunctionDeclaration({
  declaration,
  environment,
}: EvaluateFunctionDeclarationArgs): FunctionValue {
  const newFunction: FunctionValue = {
    type: Values.Function,
    name: declaration.name,
    arguments: declaration.arguments,
    declarationEnvironment: environment,
    body: declaration.body,
  };

  environment.assignVariable({ name: newFunction.name, value: newFunction });

  return newFunction;
}
