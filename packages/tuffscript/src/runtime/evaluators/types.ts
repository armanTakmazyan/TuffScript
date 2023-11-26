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
  PrimitiveExpression,
} from '../../frontend/ast/types';
import { Environment } from '../environment';
import { RuntimeValue } from '../values/types';

export interface EvaluateProgramArgs {
  program: Program;
  environment: Environment;
}

export interface EvaluateArgs {
  environment: Environment;
  astNode: Expression;
}

export interface EvaluateAndReturnLastResultArgs {
  environment: Environment;
  expressions: Expressions;
}

export interface EvaluateFunctionDeclarationArgs {
  environment: Environment;
  declaration: FunctionDeclaration;
}

export interface PropertyAssignmentExpression extends AssignmentExpression {
  assignee: MemberExpression;
}

export interface EvaluatePropertyAssignmentArgs {
  environment: Environment;
  assignment: PropertyAssignmentExpression;
}

export interface EvaluateAssignmentArgs {
  environment: Environment;
  assignment: AssignmentExpression;
}

export interface EvaluateIfExpressionArgs {
  ifExpression: IfExpression;
  environment: Environment;
}

export interface EvaluateConditionToBooleanArgs {
  condition: boolean;
}

export interface EvaluateStringConcatenationArgs {
  leftHandSide: RuntimeValue;
  rightHandSide: RuntimeValue;
}

export interface EvaluateAdditionExpressionArgs {
  leftHandSide: RuntimeValue;
  rightHandSide: RuntimeValue;
  operator: string;
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
  environment: Environment;
  objectLiteral: ObjectLiteral;
}

export interface GetMemberExpressionObjectArgs {
  environment: Environment;
  memberObject: PrimitiveExpression;
}

export interface GetMemberExpressionProperty {
  environment: Environment;
  property: PrimitiveExpression;
}

export interface EvaluateMemberExpressionArgs {
  environment: Environment;
  memberExpression: MemberExpression;
}

export interface EvaluateCallExpressionArgs {
  environment: Environment;
  callExpression: CallExpression;
}
