import { Environment } from '../environment';
import { Values, RuntimeValue } from '../values/types';
import { evaluateNil } from './primitiveTypesEvaluators';
import { EvaluateCallExpressionArgs } from './types';
import { evaluate } from './index';
import { setupExecutionContext } from '../environment/helpers';

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

    // TODO: Execution context creation phase we need to check the assignments and function declarations, other things do not matter
    // Handle Linter as well, when we're trying to get a variable value that is not declared yet
    const newEnvironment = new Environment(callable.declarationEnvironment);

    for (let i = 0; i < callable.arguments.length; i++) {
      const functionArgumentName = callable.arguments[i];
      newEnvironment.setVariableValue({
        name: functionArgumentName,
        value: functionArguments[i],
      });
    }

    setupExecutionContext({
      environment: newEnvironment,
      expressions: callable.body,
    });

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
