import { evaluate } from '.';
import { BinaryOperators } from '../../frontend/lexer/token/constants';
import {
  Values,
  NumberValue,
  BooleanValue,
  RuntimeValue,
  StringValue,
} from '../values/types';
import {
  evaluateBooleanFromType,
  evaluateFalseLiteral,
  evaluateTrueLiteral,
} from './primitiveTypesEvaluators';
import {
  EvaluateAdditionExpressionArgs,
  EvaluateBinaryExpressionArgs,
  EvaluateConditionalBinaryExpressionArgs,
  EvaluateEqualityExpressionArgs,
  EvaluateLogicalBinaryExpressionArgs,
  EvaluateNumericBinaryExpressionArgs,
} from './types';

function evaluatNumericBinaryExpression({
  operator,
  leftHandSide,
  rightHandSide,
}: EvaluateNumericBinaryExpressionArgs): NumberValue {
  if (
    leftHandSide.type === Values.Number &&
    rightHandSide.type === Values.Number
  ) {
    let result: number;
    // TODO: we catch this in the other expression evaluator
    if (operator == '+') {
      result = leftHandSide.value + rightHandSide.value;
    } else if (operator == '-') {
      result = leftHandSide.value - rightHandSide.value;
    } else if (operator == '*') {
      result = leftHandSide.value * rightHandSide.value;
    } else if (operator == '/') {
      // TODO: Division by zero checks
      result = leftHandSide.value / rightHandSide.value;
    } else {
      result = leftHandSide.value % rightHandSide.value;
    }

    return { value: result, type: Values.Number };
  }

  throw new Error(
    `Binary operator ${operator} does not support value type: ${rightHandSide.type}`,
  );
}

export function evaluateEqualityExpression({
  leftHandSide,
  rightHandSide,
}: EvaluateEqualityExpressionArgs): BooleanValue {
  switch (leftHandSide.type) {
    case Values.Nil: {
      return leftHandSide.type === rightHandSide.type
        ? evaluateTrueLiteral()
        : evaluateFalseLiteral();
    }
    case Values.Boolean:
    case Values.Number:
    case Values.String: {
      return leftHandSide.type === rightHandSide.type &&
        leftHandSide.value === rightHandSide.value
        ? evaluateTrueLiteral()
        : evaluateFalseLiteral();
    }
    case Values.Object: {
      return leftHandSide.type === rightHandSide.type &&
        leftHandSide.properties === rightHandSide.properties
        ? evaluateTrueLiteral()
        : evaluateFalseLiteral();
    }
    case Values.Function:
    case Values.NativeFunction: {
      return leftHandSide === rightHandSide
        ? evaluateTrueLiteral()
        : evaluateFalseLiteral();
    }
    default: {
      throw new Error(
        `Unsupported conditional binary expression with the operator: Equality`,
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
      const booleanResult = leftHandSide.value < rightHandSide.value;
      return {
        type: Values.Boolean,
        value: booleanResult,
      };
    }

    if (operator === BinaryOperators.GREATER_THAN) {
      const booleanResult = leftHandSide.value > rightHandSide.value;
      return {
        type: Values.Boolean,
        value: booleanResult,
      };
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
    const booleanResult = booleanLeftSide.value && booleanRightSide.value;
    return {
      type: Values.Boolean,
      value: booleanResult,
    };
  }

  if (operator === BinaryOperators.OR) {
    const booleanLeftSide = evaluateBooleanFromType(leftHandSide);
    const booleanRightSide = evaluateBooleanFromType(rightHandSide);
    const booleanResult = booleanLeftSide.value || booleanRightSide.value;
    return {
      type: Values.Boolean,
      value: booleanResult,
    };
  }

  throw new Error(`Unsupported Binary operation: ${operator}`);
}

export function evaluateAdditionExpression({
  leftHandSide,
  rightHandSide,
}: EvaluateAdditionExpressionArgs): StringValue | NumberValue {
  if (
    leftHandSide.type === Values.Number &&
    rightHandSide.type === Values.Number
  ) {
    const result = leftHandSide.value + rightHandSide.value;
    return { type: Values.Number, value: result };
  }

  if (
    leftHandSide.type === Values.String &&
    rightHandSide.type === Values.String
  ) {
    const result = leftHandSide.value + rightHandSide.value;
    return { type: Values.String, value: result };
  }

  throw new Error(
    `Unsupported Addition operation on: ${leftHandSide.type} and ${rightHandSide.type}`,
  );
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
        rightHandSide,
      });
    }
    case BinaryOperators.SUBTRACTION:
    case BinaryOperators.MULTIPLICATION:
    case BinaryOperators.DIVISION:
    case BinaryOperators.MODULUS: {
      return evaluatNumericBinaryExpression({
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
