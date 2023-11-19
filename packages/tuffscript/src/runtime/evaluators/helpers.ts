import {
  Values,
  TrueLiteral,
  FalseLiteral,
  RuntimeValue,
  BooleanValue,
} from '../values/types';
import {
  evaluateNil,
  evaluateTrueLiteral,
  evaluateFalseLiteral,
} from './primitiveTypesEvaluators';
import {
  EvaluateConditionToBooleanArgs,
  EvaluateAndReturnLastResultArgs,
} from './types';
import { evaluate } from './index';

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

  return evaluateNil();
}

export function evaluateConditionToBoolean({
  condition,
}: EvaluateConditionToBooleanArgs): BooleanValue {
  return condition ? evaluateTrueLiteral() : evaluateFalseLiteral();
}

export function evaluateBooleanFromType(
  runtimeObject: RuntimeValue,
): FalseLiteral | TrueLiteral {
  switch (runtimeObject.type) {
    case Values.Nil: {
      return evaluateFalseLiteral();
    }
    case Values.Boolean: {
      return evaluateConditionToBoolean({ condition: runtimeObject.value });
    }
    case Values.Number:
    case Values.String: {
      return evaluateConditionToBoolean({ condition: !!runtimeObject.value });
    }
    case Values.Object: {
      return evaluateConditionToBoolean({
        condition: !!runtimeObject.properties.size,
      });
    }
    case Values.Function:
    case Values.NativeFunction: {
      return evaluateTrueLiteral();
    }
    default: {
      throw new Error(`Unhandled type: ${runtimeObject}`);
    }
  }
}
