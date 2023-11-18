import { UnaryOperators } from '../../frontend/lexer/token/constants';
import { Values, BooleanValue, NumberValue } from '../values/types';
import { createNumber } from '../factories';
import { evaluateBooleanFromType, evaluateConditionToBoolean } from './helpers';
import { EvaluateUnaryExpressionArgs } from './types';
import { evaluate } from './index';

export function evaluateUnaryExpression({
  environment,
  unaryExpression,
}: EvaluateUnaryExpressionArgs): BooleanValue | NumberValue {
  if (unaryExpression.operator === UnaryOperators.Not) {
    const argumentValue = evaluate({
      astNode: unaryExpression.argument,
      environment,
    });
    const result = evaluateBooleanFromType(argumentValue);
    return evaluateConditionToBoolean({ condition: !result.value });
  }

  if (unaryExpression.operator === UnaryOperators.Minus) {
    const argumentValue = evaluate({
      astNode: unaryExpression.argument,
      environment,
    });

    if (argumentValue.type !== Values.Number) {
      throw new Error(
        `Invalid operand type for unary minus operator. Expected a number, but received a value of type '${argumentValue.type}'.`,
      );
    }

    return createNumber({
      numberValue: -argumentValue.value,
    });
  }

  throw new Error(`Unsupported Unary operator: ${unaryExpression.operator}`);
}
