import { evaluate } from '.';
import { UnaryOperators } from '../../frontend/lexer/token/constants';
import { BooleanValue, NilValue } from '../values/types';
import {
  evaluateNil,
  evaluateBooleanFromType,
} from './primitiveTypesEvaluators';
import { EvaluateUnaryExpressionArgs } from './types';

export function evaluateUnaryExpression({
  environment,
  unaryExpression,
}: EvaluateUnaryExpressionArgs): BooleanValue | NilValue {
  if (unaryExpression.operator === UnaryOperators.Not) {
    const argumentValue = evaluate({
      astNode: unaryExpression.argument,
      environment,
    });
    const result = evaluateBooleanFromType(argumentValue);

    return result;
  }

  // TODO: we do not have this unary operator
  return evaluateNil();
}
