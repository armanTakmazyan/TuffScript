import {
  Program,
  Expression,
  FunctionDeclaration,
  AssignmentExpression,
  IfExpression,
  Expressions,
  Identifier,
  NumberLiteral,
  StringLiteral,
  ObjectLiteral,
  CallExpression,
  BinaryExpression,
  MemberExpression,
  UnaryExpression,
} from '../../frontend/ast/types';
import { Environment } from '../environment';
import { RuntimeValue } from '../values/types';

export interface EvaluateProgramArgs {
  program: Program;
  environment: Environment;
}

export interface EvaluateAssignmentArgs {
  assignment: AssignmentExpression;
  environment: Environment;
}

export interface EvaluateFunctionDeclarationArgs {
  environment: Environment;
  declaration: FunctionDeclaration;
}

export interface EvaluateArgs {
  environment: Environment;
  astNode: Expression;
}

export interface EvaluateAndReturnLastResultArgs {
  environment: Environment;
  expressions: Expressions;
}

export interface EvaluateIfExpressionArgs {
  ifExpression: IfExpression;
  environment: Environment;
}

export interface EvaluateAdditionExpressionArgs {
  leftHandSide: RuntimeValue;
  rightHandSide: RuntimeValue;
}

export interface EvaluateNumericBinaryExpressionArgs {
  leftHandSide: RuntimeValue;
  rightHandSide: RuntimeValue;
  operator: string;
}

export interface EvaluateConditionalBinaryExpressionArgs {
  leftHandSide: RuntimeValue;
  rightHandSide: RuntimeValue;
  operator: string;
}

export interface EvaluateLogicalBinaryExpressionArgs {
  leftHandSide: RuntimeValue;
  rightHandSide: RuntimeValue;
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

export interface EvaluateEqualityExpressionArgs {
  leftHandSide: RuntimeValue;
  rightHandSide: RuntimeValue;
}

export interface evaluateAssignment {
  environment: Environment;
  assignmentExpresion: AssignmentExpression;
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
