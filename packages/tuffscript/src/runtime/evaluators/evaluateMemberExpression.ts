import { createNil } from '../values/factories';
import { RuntimeValue } from '../values/types';
import { EvaluateMemberExpressionArgs } from './types';

export function evaluateMemberExpression({
  environment,
  memberExpression,
}: EvaluateMemberExpressionArgs): RuntimeValue {
  environment;
  // TODO: member expression
  console.log('memberExpression', memberExpression);

  return createNil();
}
