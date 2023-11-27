import { Environment } from '../environment';
import { setupExecutionContext } from '../environment/helpers';
import { Values, RuntimeValue } from '../values/types';
import { evaluateNil } from './primitiveTypesEvaluators';
import {
  ValidateFunctionArgumentsArgs,
  SetupFunctionExecutionContextArgs,
  EvaluateFunctionCallArgs,
  EvaluateCallExpressionArgs,
} from './types';
import { evaluate } from './index';

export function validateFunctionArguments({
  expectedArguments,
  actualArguments,
}: ValidateFunctionArgumentsArgs): void {
  if (expectedArguments.length !== actualArguments.length) {
    throw new Error(
      `Expected ${expectedArguments.length} arguments, but got ${actualArguments.length}`,
    );
  }
}

export function setupFunctionExecutionContext({
  callable,
  functionArguments,
}: SetupFunctionExecutionContextArgs): Environment {
  const newEnvironment = new Environment(callable.declarationEnvironment);

  callable.arguments.forEach((argumentName, argumentIndex) => {
    newEnvironment.setVariableValue({
      name: argumentName,
      value: functionArguments[argumentIndex],
    });
  });

  setupExecutionContext({
    environment: newEnvironment,
    expressions: callable.body,
  });

  return newEnvironment;
}

export function evaluateFunctionCall({
  callable,
  functionArguments,
}: EvaluateFunctionCallArgs): RuntimeValue {
  validateFunctionArguments({
    expectedArguments: callable.arguments,
    actualArguments: functionArguments,
  });

  const newEnvironment = setupFunctionExecutionContext({
    callable,
    functionArguments,
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
    return callable.execute(functionArguments, environment);
  }

  if (callable.type === Values.Function) {
    return evaluateFunctionCall({
      callable,
      functionArguments,
    });
  }

  throw new Error(`Cannot call value that is not a function: ${callable}`);
}
