import { RuntimeValue } from '../values/types';
import { EvaluateIfExpressionArgs } from './types';
import {
  evaluateBooleanFromType,
  evaluateAndReturnLastResult,
} from './helpers';
import { evaluate } from './index';

export function evaluateIfExpression({
  ifExpression,
  environment,
}: EvaluateIfExpressionArgs): RuntimeValue {
  const conditionValue = evaluate({
    environment,
    astNode: ifExpression.condition,
  });

  const conditionBooleanValue = evaluateBooleanFromType(conditionValue);

  if (conditionBooleanValue.value) {
    return evaluateAndReturnLastResult({
      environment,
      expressions: ifExpression.thenBody,
    });
  }

  return evaluateAndReturnLastResult({
    environment,
    expressions: ifExpression.elseBody,
  });
}
