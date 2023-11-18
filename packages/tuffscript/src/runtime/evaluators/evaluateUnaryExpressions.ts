import { UnaryOperators } from '../../frontend/lexer/token/constants';
import { BooleanValue } from '../values/types';
import { evaluateBooleanFromType, evaluateConditionToBoolean } from './helpers';
import { EvaluateUnaryExpressionArgs } from './types';
import { evaluate } from './index';

export function evaluateUnaryExpression({
  environment,
  unaryExpression,
}: EvaluateUnaryExpressionArgs): BooleanValue {
  if (unaryExpression.operator === UnaryOperators.Not) {
    const argumentValue = evaluate({
      astNode: unaryExpression.argument,
      environment,
    });
    const result = evaluateBooleanFromType(argumentValue);
    return evaluateConditionToBoolean({ condition: !result.value });
  }

  throw new Error(`Unsupported Unary operator: ${unaryExpression.operator}`);
}
