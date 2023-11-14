import { evaluate } from '.';
import { RuntimeValue } from '../values/types';
import { EvaluateAssignmentArgs } from './types';

export function evaluateAssignment({
  environment,
  assignment,
}: EvaluateAssignmentArgs): RuntimeValue {
  return environment.assignVariable({
    name: assignment.assigne,
    value: evaluate({ environment, astNode: assignment.value }),
  });
}
