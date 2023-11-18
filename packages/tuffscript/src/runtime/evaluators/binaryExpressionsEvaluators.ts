import { BinaryOperators } from '../../frontend/lexer/token/constants';
import { evaluateBooleanFromType, evaluateConditionToBoolean } from './helpers';
import { createBoolean, createNumber, createString } from '../factories';
import {
  Values,
  BooleanValue,
  NumberValue,
  StringValue,
  RuntimeValue,
} from '../values/types';
import {
  EvaluateAdditionExpressionArgs,
  EvaluateBinaryExpressionArgs,
  EvaluateConditionalBinaryExpressionArgs,
  EvaluateEqualityExpressionArgs,
  EvaluateLogicalBinaryExpressionArgs,
  EvaluateNumericBinaryExpressionArgs,
  EvaluateStringConcatenationArgs,
} from './types';
import { evaluate } from './index';

function evaluateNumericBinaryExpression({
  operator,
  leftHandSide,
  rightHandSide,
}: EvaluateNumericBinaryExpressionArgs): NumberValue {
  if (
    leftHandSide.type === Values.Number &&
    rightHandSide.type === Values.Number
  ) {
    switch (operator) {
      case '+': {
        return createNumber({
          numberValue: leftHandSide.value + rightHandSide.value,
        });
      }
      case '-': {
        return createNumber({
          numberValue: leftHandSide.value - rightHandSide.value,
        });
      }
      case '*': {
        return createNumber({
          numberValue: leftHandSide.value * rightHandSide.value,
        });
      }
      case '/': {
        if (rightHandSide.value === 0) {
          throw new Error('Division by zero error');
        }
        return createNumber({
          numberValue: leftHandSide.value / rightHandSide.value,
        });
      }
      case '%': {
        if (rightHandSide.value === 0) {
          throw new Error('Modulus by zero error');
        }
        return createNumber({
          numberValue: leftHandSide.value % rightHandSide.value,
        });
      }
      default:
        throw new Error(`Unsupported binary operator: ${operator}`);
    }
  }

  throw new Error(
    `Invalid operand type(s) for binary operator ${operator}. Expected both operands to be of type 'Number', but received types: left operand - ${leftHandSide.type}, right operand - ${rightHandSide.type}.`,
  );
}

export function evaluateStringConcatenation({
  leftHandSide,
  rightHandSide,
}: EvaluateStringConcatenationArgs): StringValue {
  if (
    leftHandSide.type === Values.String &&
    rightHandSide.type === Values.String
  ) {
    return createString({
      stringValue: leftHandSide.value + rightHandSide.value,
    });
  }

  throw new Error(
    `Unexpected String Concatenation on: ${leftHandSide.type} and ${rightHandSide.type}`,
  );
}

export function evaluateAdditionExpression({
  operator,
  leftHandSide,
  rightHandSide,
}: EvaluateAdditionExpressionArgs): StringValue | NumberValue {
  if (
    leftHandSide.type === Values.Number &&
    rightHandSide.type === Values.Number
  ) {
    return evaluateNumericBinaryExpression({
      leftHandSide,
      operator,
      rightHandSide,
    });
  }

  return evaluateStringConcatenation({
    leftHandSide,
    rightHandSide,
  });
}

export function evaluateEqualityExpression({
  leftHandSide,
  rightHandSide,
}: EvaluateEqualityExpressionArgs): BooleanValue {
  switch (leftHandSide.type) {
    case Values.Nil: {
      return evaluateConditionToBoolean({
        condition: leftHandSide.type === rightHandSide.type,
      });
    }
    case Values.Boolean:
    case Values.Number:
    case Values.String: {
      return evaluateConditionToBoolean({
        condition:
          leftHandSide.type === rightHandSide.type &&
          leftHandSide.value === rightHandSide.value,
      });
    }
    case Values.Object: {
      return evaluateConditionToBoolean({
        condition:
          leftHandSide.type === rightHandSide.type &&
          leftHandSide.properties === rightHandSide.properties,
      });
    }
    case Values.Function:
    case Values.NativeFunction: {
      return evaluateConditionToBoolean({
        condition: leftHandSide === rightHandSide,
      });
    }
    default: {
      throw new Error(
        `Unsupported equality comparison for type: ${leftHandSide}`,
      );
    }
  }
}

export function evaluateConditionalBinaryExpression({
  operator,
  leftHandSide,
  rightHandSide,
}: EvaluateConditionalBinaryExpressionArgs): BooleanValue {
  if (operator === BinaryOperators.EQUALS) {
    return evaluateEqualityExpression({ leftHandSide, rightHandSide });
  }

  if (
    leftHandSide.type === Values.Number &&
    rightHandSide.type === Values.Number
  ) {
    if (operator === BinaryOperators.LESS_THAN) {
      return createBoolean({
        booleanValue: leftHandSide.value < rightHandSide.value,
      });
    }

    if (operator === BinaryOperators.GREATER_THAN) {
      return createBoolean({
        booleanValue: leftHandSide.value > rightHandSide.value,
      });
    }
  }

  throw new Error(
    `Unsupported conditional binary expression with the operator: ${operator}`,
  );
}

export function evaluateLogicalBinaryExpression({
  leftHandSide,
  operator,
  rightHandSide,
}: EvaluateLogicalBinaryExpressionArgs): BooleanValue {
  if (operator === BinaryOperators.AND) {
    const booleanLeftSide = evaluateBooleanFromType(leftHandSide);
    const booleanRightSide = evaluateBooleanFromType(rightHandSide);
    return createBoolean({
      booleanValue: booleanLeftSide.value && booleanRightSide.value,
    });
  }

  if (operator === BinaryOperators.OR) {
    const booleanLeftSide = evaluateBooleanFromType(leftHandSide);
    const booleanRightSide = evaluateBooleanFromType(rightHandSide);
    return createBoolean({
      booleanValue: booleanLeftSide.value || booleanRightSide.value,
    });
  }

  throw new Error(`Unsupported Binary operation: ${operator}`);
}

export function evaluateBinaryExpression({
  binaryExpression,
  environment,
}: EvaluateBinaryExpressionArgs): RuntimeValue {
  const leftHandSide = evaluate({
    environment,
    astNode: binaryExpression.left,
  });
  const rightHandSide = evaluate({
    environment,
    astNode: binaryExpression.right,
  });

  switch (binaryExpression.operator) {
    case BinaryOperators.ADDITION: {
      return evaluateAdditionExpression({
        leftHandSide,
        operator: binaryExpression.operator,
        rightHandSide,
      });
    }
    case BinaryOperators.SUBTRACTION:
    case BinaryOperators.MULTIPLICATION:
    case BinaryOperators.DIVISION:
    case BinaryOperators.MODULUS: {
      return evaluateNumericBinaryExpression({
        leftHandSide,
        operator: binaryExpression.operator,
        rightHandSide,
      });
    }
    case BinaryOperators.LESS_THAN:
    case BinaryOperators.GREATER_THAN:
    case BinaryOperators.EQUALS: {
      return evaluateConditionalBinaryExpression({
        leftHandSide,
        operator: binaryExpression.operator,
        rightHandSide,
      });
    }
    case BinaryOperators.AND:
    case BinaryOperators.OR: {
      return evaluateLogicalBinaryExpression({
        leftHandSide,
        operator: binaryExpression.operator,
        rightHandSide,
      });
    }
    default: {
      throw new Error('Unsupported binary operator');
    }
  }
}
