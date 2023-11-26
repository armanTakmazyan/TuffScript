import { ExpressionNodeType } from '../../frontend/ast/types';
import { Values, ObjectValue, RuntimeValue } from '../values/types';
import {
  GetMemberExpressionProperty,
  GetMemberExpressionObjectArgs,
  EvaluateMemberExpressionArgs,
} from './types';
import { evaluate } from './index';

export function getMemberExpressionObject({
  environment,
  memberObject,
}: GetMemberExpressionObjectArgs): ObjectValue {
  if (memberObject.type === ExpressionNodeType.Identifier) {
    const value = environment.getVariableValue({ name: memberObject.symbol });
    if (value.type !== Values.Object) {
      throw new Error('Member expression target is not an object');
    }
    return value;
  }
  const evaluatedObject = evaluate({ astNode: memberObject, environment });

  if (evaluatedObject.type !== Values.Object) {
    throw new Error('Member expression target is not an object');
  }

  return evaluatedObject;
}

export function getMemberExpressionProperty({
  environment,
  property,
}: GetMemberExpressionProperty): string {
  if (property.type === ExpressionNodeType.Identifier) {
    return property.symbol;
  }

  const evaluatedProperty = evaluate({ astNode: property, environment });

  if (evaluatedProperty.type !== Values.String) {
    throw new Error('Incorrect property type computed');
  }

  return evaluatedProperty.value;
}

export function evaluateMemberExpression({
  environment,
  memberExpression,
}: EvaluateMemberExpressionArgs): RuntimeValue {
  const expressionObject = getMemberExpressionObject({
    environment,
    memberObject: memberExpression.object,
  });

  const expressionPropertyValue = getMemberExpressionProperty({
    environment,
    property: memberExpression.property,
  });

  const resultValue = expressionObject.properties.get(expressionPropertyValue);

  if (!resultValue) {
    throw new Error(
      `Property '${expressionPropertyValue}' does not exist on the specified object. Object details: { ${[
        ...expressionObject.properties.keys(),
      ]} }`,
    );
  }

  return resultValue;
}
