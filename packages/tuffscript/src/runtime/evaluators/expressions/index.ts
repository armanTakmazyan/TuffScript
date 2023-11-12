import { createNil } from '../../values/factories';
import { Environment } from '../../environment';
import { evaluate } from '../statements';
import {
  Values,
  NumberValue,
  StringValue,
  RuntimeValue,
  ObjectValue,
  NilValue,
  FalseLiteral,
  TrueLiteral,
  BooleanValue,
} from '../../values/types';
import {
  EvaluateIdentifierArgs,
  EvaluateNumberArgs,
  EvaluateBinaryExpressionArgs,
  EvaluateUnaryExpressionArgs,
  EvaluateNumericBinaryExpressionArgs,
  EvaluateObjectExpressionArgs,
  EvaluateMemberExpressionArgs,
  EvaluateCallExpressionArgs,
  EvaluateStringArgs,
} from './types';
import { UnaryOperators } from '../../../frontend/lexer/token/constants';

export function evaluateIdentifier({
  identifier,
  environment,
}: EvaluateIdentifierArgs): RuntimeValue {
  const identifierValue = environment.findVariable({ name: identifier.symbol });
  return identifierValue;
}

export function evaluateNumber({
  numberLiteral,
}: EvaluateNumberArgs): NumberValue {
  return {
    value: numberLiteral.value,
    type: Values.Number,
  };
}

export function evaluateString({
  stringLiteral,
}: EvaluateStringArgs): StringValue {
  return {
    type: Values.String,
    value: stringLiteral.value,
  };
}

export function evaluateNil(): NilValue {
  return {
    type: Values.Nil,
    value: null,
  };
}

export function evaluateFalseLiteral(): FalseLiteral {
  return {
    type: Values.Boolean,
    value: false,
  };
}

export function evaluateTrueLiteral(): TrueLiteral {
  return {
    type: Values.Boolean,
    value: true,
  };
}

function evaluatNumericBinaryExpression({
  operator,
  leftHandSide,
  rightHandSide,
}: EvaluateNumericBinaryExpressionArgs): NumberValue {
  let result: number;
  if (operator == '+') {
    result = leftHandSide.value + rightHandSide.value;
  } else if (operator == '-') {
    result = leftHandSide.value - rightHandSide.value;
  } else if (operator == '*') {
    result = leftHandSide.value * rightHandSide.value;
  } else if (operator == '/') {
    // TODO: Division by zero checks
    result = leftHandSide.value / rightHandSide.value;
  } else {
    result = leftHandSide.value % rightHandSide.value;
  }

  return { value: result, type: Values.Number };
}

/**
 * Evaulates expressions following the binary operation type.
 */
export function evaluateBinaryExpression({
  binaryExpression,
  environment,
}: EvaluateBinaryExpressionArgs): RuntimeValue {
  const leftHandSide = evaluate({
    environment,
    astNode: binaryExpression.left,
  });
  const rightHandSide = evaluate({
    environment,
    astNode: binaryExpression.right,
  });

  // Only currently support numeric operations
  if (
    leftHandSide.type === Values.Number &&
    rightHandSide.type === Values.Number
  ) {
    return evaluatNumericBinaryExpression({
      leftHandSide,
      operator: binaryExpression.operator,
      rightHandSide,
    });
  }

  // TODO: One or both are NULL
  return createNil();
}

export function evaluateUnaryExpression({
  environment,
  unaryExpression,
}: EvaluateUnaryExpressionArgs): BooleanValue | NilValue {
  if (unaryExpression.operator === UnaryOperators.Not) {
    return {
      type: Values.Boolean,
      value: !!evaluate({
        astNode: unaryExpression.argument,
        environment,
      }),
    };
  }

  // TODO: we do not have this unary operator
  return createNil();
}

export function evaluateObjectExpression({
  environment,
  objectLiteral,
}: EvaluateObjectExpressionArgs): ObjectValue {
  const newObject: ObjectValue = {
    type: Values.Object,
    properties: new Map<string, RuntimeValue>(),
  };

  for (const { key, value } of objectLiteral.properties) {
    const runtimeVal = !value
      ? environment.findVariable({ name: key })
      : evaluate({
          astNode: value,
          environment,
        });

    newObject.properties.set(key, runtimeVal);
  }

  return newObject;
}

export function evaluateMemberExpression({
  environment,
  memberExpression,
}: EvaluateMemberExpressionArgs): RuntimeValue {
  environment;
  console.log('memberExpression', memberExpression);
  // environment.findVariable({
  //   name: memberExpression.object.
  // })
  // if (memberExpression.computed) {
  //   const property = evaluate({
  //     astNode: memberExpression.property,
  //     environment,
  //   });
  //   environment.fin
  // }

  return createNil();
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
    const result = callable.execute(functionArguments, environment);
    return result;
  }

  if (callable.type === Values.Function) {
    const environment = new Environment(callable.declarationEnvironment);

    for (let i = 0; i < callable.arguments.length; i++) {
      // TODO: Check the bounds here. Verify arity of function
      const functionName = callable.arguments[i];
      environment.assignVariable({
        name: functionName,
        value: functionArguments[i],
      });
    }

    let result: RuntimeValue = createNil();

    for (const statement of callable.body) {
      result = evaluate({
        astNode: statement,
        environment: environment,
      });
    }

    return result;
  }

  throw new Error(`Cannot call value that is not a function: ${callable}`);
}
