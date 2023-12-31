import { Values, ObjectValue, RuntimeValue } from '../values/types';
import { EvaluateObjectExpressionArgs } from './types';
import { evaluate } from './index';

export function evaluateObjectExpression({
  environment,
  objectLiteral,
}: EvaluateObjectExpressionArgs): ObjectValue {
  const newObject: ObjectValue = {
    type: Values.Object,
    properties: new Map<string, RuntimeValue>(),
  };

  for (const { key, value } of objectLiteral.properties) {
    const runtimeVal = !value
      ? environment.getVariableValue({ name: key })
      : evaluate({
          astNode: value,
          environment,
        });

    newObject.properties.set(key, runtimeVal);
  }

  return newObject;
}
