import { evaluate } from '.';
import { Environment } from '../environment';
import { createNil } from '../values/factories';
import { Values, RuntimeValue } from '../values/types';
import { EvaluateCallExpressionArgs } from './types';

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
    const environment = new Environment(callable.declarationEnvironment);

    for (let i = 0; i < callable.arguments.length; i++) {
      // TODO: Check the bounds here. Verify arity of function
      const functionName = callable.arguments[i];
      environment.setVariableValue({
        name: functionName,
        value: functionArguments[i],
      });
    }

    let result: RuntimeValue = createNil();

    for (const expression of callable.body) {
      result = evaluate({
        astNode: expression,
        environment: environment,
      });
    }

    return result;
  }

  throw new Error(`Cannot call value that is not a function: ${callable}`);
}
