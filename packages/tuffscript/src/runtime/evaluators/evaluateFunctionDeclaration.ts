import { Values, FunctionValue } from '../values/types';
import { EvaluateFunctionDeclarationArgs } from './types';

export function evaluateFunctionDeclaration({
  declaration,
  environment,
}: EvaluateFunctionDeclarationArgs): FunctionValue {
  const newFunction: FunctionValue = {
    type: Values.Function,
    name: declaration.name.symbol,
    arguments: declaration.arguments.map(argument => argument.symbol),
    declarationEnvironment: environment,
    body: declaration.body,
  };

  environment.setVariableValue({ name: newFunction.name, value: newFunction });

  return newFunction;
}
