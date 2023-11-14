import { evaluate } from '.';
import { RuntimeValue } from '../values/types';
import { EvaluateAssignmentArgs } from './types';

export function evaluateAssignmentExpression({
  environment,
  assignment,
}: EvaluateAssignmentArgs): RuntimeValue {
  return environment.setVariableValue({
    name: assignment.assigne,
    value: evaluate({ environment, astNode: assignment.value }),
  });
}
