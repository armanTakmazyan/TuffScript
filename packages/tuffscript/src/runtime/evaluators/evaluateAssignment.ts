import { RuntimeValue } from '../values/types';
import { EvaluateAssignmentArgs } from './types';
import { evaluate } from './index';

export function evaluateAssignmentExpression({
  environment,
  assignment,
}: EvaluateAssignmentArgs): RuntimeValue {
  return environment.setVariableValue({
    name: assignment.assigne.symbol,
    value: evaluate({ environment, astNode: assignment.value }),
  });
}
