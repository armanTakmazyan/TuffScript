import { Environment } from '../environment';
import { Values, RuntimeValue } from '../values/types';
import { evaluateNil } from './primitiveTypesEvaluators';
import { EvaluateCallExpressionArgs } from './types';
import { evaluate } from './index';

export function evaluateCallExpression({
  environment,
  callExpression,
}: EvaluateCallExpressionArgs): RuntimeValue {
  const functionArguments = callExpression.arguments.map(argument =>
    evaluate({
      astNode: argument,
      environment,
    }),
  );

  const callable = evaluate({
    astNode: callExpression.caller,
    environment,
  });

  if (callable.type === Values.NativeFunction) {
    const result = callable.execute(functionArguments, environment);
    return result;
  }

  if (callable.type === Values.Function) {
    if (callable.arguments.length !== functionArguments.length) {
      throw new Error(
        `Expected ${callable.arguments.length} arguments, but got ${functionArguments.length}`,
      );
    }

    const newEnvironment = new Environment(callable.declarationEnvironment);

    for (let i = 0; i < callable.arguments.length; i++) {
      const functionArgumentName = callable.arguments[i];
      newEnvironment.setVariableValue({
        name: functionArgumentName,
        value: functionArguments[i],
      });
    }

    let result: RuntimeValue = evaluateNil();

    for (const expression of callable.body) {
      result = evaluate({
        astNode: expression,
        environment: newEnvironment,
      });
    }

    return result;
  }

  throw new Error(`Cannot call value that is not a function: ${callable}`);
}
