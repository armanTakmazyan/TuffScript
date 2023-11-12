import {
  Assignment,
  Identifier,
  NumberLiteral,
  StringLiteral,
  ObjectLiteral,
  CallExpression,
  BinaryExpression,
  MemberExpression,
  UnaryExpression,
} from '../../../frontend/ast/types';
import { Environment } from '../../environment';
import { NumberValue } from '../../values/types';

export interface EvaluateNumericBinaryExpressionArgs {
  leftHandSide: NumberValue;
  rightHandSide: NumberValue;
  operator: string;
}

export interface EvaluateBinaryExpressionArgs {
  binaryExpression: BinaryExpression;
  environment: Environment;
}

export interface EvaluateUnaryExpressionArgs {
  unaryExpression: UnaryExpression;
  environment: Environment;
}

export interface evaluateAssignment {
  environment: Environment;
  assignmentExpresion: Assignment;
}

export interface EvaluateIdentifierArgs {
  identifier: Identifier;
  environment: Environment;
}

export interface EvaluateNumberArgs {
  numberLiteral: NumberLiteral;
}

export interface EvaluateStringArgs {
  stringLiteral: StringLiteral;
}

export interface EvaluateObjectExpressionArgs {
  objectLiteral: ObjectLiteral;
  environment: Environment;
}

export interface EvaluateMemberExpressionArgs {
  memberExpression: MemberExpression;
  environment: Environment;
}

export interface EvaluateCallExpressionArgs {
  environment: Environment;
  callExpression: CallExpression;
}
