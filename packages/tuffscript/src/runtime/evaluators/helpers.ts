import { evaluate } from '.';
import { createNil } from '../values/factories';
import { RuntimeValue } from '../values/types';
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

  return createNil();
}
