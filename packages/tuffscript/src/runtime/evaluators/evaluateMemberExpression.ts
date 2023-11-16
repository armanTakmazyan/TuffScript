import { RuntimeValue } from '../values/types';
import { evaluateNil } from './primitiveTypesEvaluators';
import { EvaluateMemberExpressionArgs } from './types';

export function evaluateMemberExpression({
  environment,
  memberExpression,
}: EvaluateMemberExpressionArgs): RuntimeValue {
  environment;
  // TODO: member expression
  console.log('memberExpression', memberExpression);

  return evaluateNil();
}
