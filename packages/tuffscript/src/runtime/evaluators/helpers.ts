import { evaluate } from '.';
import { RuntimeValue } from '../values/types';
import { evaluateNil } from './primitiveTypesEvaluators';
import { EvaluateAndReturnLastResultArgs } from './types';

export function evaluateAndReturnLastResult({
  environment,
  expressions,
}: EvaluateAndReturnLastResultArgs): RuntimeValue {
  for (const [expressionIndex, expression] of expressions.entries()) {
    const result = evaluate({
      environment,
      astNode: expression,
    });

    if (expressionIndex === expressions.length - 1) {
      return result;
    }
  }

  return evaluateNil();
}
