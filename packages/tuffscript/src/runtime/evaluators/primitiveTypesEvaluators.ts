import {
  Values,
  FalseLiteral,
  NilValue,
  NumberValue,
  RuntimeValue,
  StringValue,
  TrueLiteral,
} from '../values/types';
import {
  EvaluateIdentifierArgs,
  EvaluateNumberArgs,
  EvaluateStringArgs,
} from './types';

export function evaluateIdentifier({
  identifier,
  environment,
}: EvaluateIdentifierArgs): RuntimeValue {
  const identifierValue = environment.getVariableValue({
    name: identifier.symbol,
  });
  return identifierValue;
}

export function evaluateNumber({
  numberLiteral,
}: EvaluateNumberArgs): NumberValue {
  return {
    value: numberLiteral.value,
    type: Values.Number,
  };
}

export function evaluateString({
  stringLiteral,
}: EvaluateStringArgs): StringValue {
  return {
    type: Values.String,
    value: stringLiteral.value,
  };
}

export function evaluateNil(): NilValue {
  return {
    type: Values.Nil,
    value: null,
  };
}

export function evaluateFalseLiteral(): FalseLiteral {
  return {
    type: Values.Boolean,
    value: false,
  };
}

export function evaluateTrueLiteral(): TrueLiteral {
  return {
    type: Values.Boolean,
    value: true,
  };
}

export function evaluateBooleanFromType(
  runtimeObject: RuntimeValue,
): FalseLiteral | TrueLiteral {
  switch (runtimeObject.type) {
    case Values.Nil: {
      return evaluateFalseLiteral();
    }
    case Values.Boolean: {
      return runtimeObject;
    }
    case Values.Number: {
      return runtimeObject.value
        ? evaluateTrueLiteral()
        : evaluateFalseLiteral();
    }
    case Values.String: {
      return runtimeObject.value
        ? evaluateTrueLiteral()
        : evaluateFalseLiteral();
    }
    case Values.Object: {
      return runtimeObject.properties.size
        ? evaluateTrueLiteral()
        : evaluateFalseLiteral();
    }
    case Values.Function: {
      return evaluateTrueLiteral();
    }
    case Values.NativeFunction: {
      return evaluateTrueLiteral();
    }
    default: {
      throw new Error(`Unhandled type: ${runtimeObject}`);
    }
  }
}
