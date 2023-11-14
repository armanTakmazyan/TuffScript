import { createNil } from '../values/factories';
import { RuntimeValue } from '../values/types';
import { EvaluateMemberExpressionArgs } from './types';

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
