import { evaluate } from '.';
import { RuntimeValue } from '../values/types';
import { evaluateAndReturnLastResult } from './helpers';
import { evaluateBooleanFromType } from './primitiveTypesEvaluators';
import { EvaluateIfExpressionArgs } from './types';

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
