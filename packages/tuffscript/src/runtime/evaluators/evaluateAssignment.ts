import { ExpressionNodeType } from '../../frontend/ast/types';
import { RuntimeValue } from '../values/types';
import {
  EvaluateAssignmentArgs,
  EvaluatePropertyAssignmentArgs,
} from './types';
import { evaluate } from './index';
import {
  getMemberExpressionObject,
  getMemberExpressionProperty,
} from './evaluateMemberExpression';

export function evaluatePropertyAssignment({
  environment,
  assignment,
}: EvaluatePropertyAssignmentArgs): RuntimeValue {
  const targetObject = getMemberExpressionObject({
    environment,
    memberObject: assignment.assignee.object,
  });

  const propertyKey = getMemberExpressionProperty({
    environment,
    ...assignment.assignee,
  });

  const newValue = evaluate({ astNode: assignment.value, environment });
  targetObject.properties.set(propertyKey, newValue);

  return targetObject;
}

export function evaluateAssignmentExpression({
  environment,
  assignment,
}: EvaluateAssignmentArgs): RuntimeValue {
  if (assignment.assignee.type === ExpressionNodeType.Identifier) {
    return environment.setVariableValue({
      name: assignment.assignee.symbol,
      value: evaluate({ environment, astNode: assignment.value }),
    });
  } else {
    return evaluatePropertyAssignment({
      assignment: {
        ...assignment,
        assignee: assignment.assignee,
      },
      environment,
    });
  }
}
