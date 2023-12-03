import * as t from '@babel/types';
import {
  Expression as JSExpression,
  JSXNamespacedName,
  SpreadElement,
  StringLiteral,
  ArgumentPlaceholder,
  ObjectProperty,
  Statement,
  OptionalMemberExpression,
  Pattern,
  RestElement,
  Identifier as JSIdentifier,
} from '@babel/types';
import { ExpressionNodeType } from 'tuffscript/ast/types';
import { Transpiler } from '../index';
import {
  TransformFuntionDeclarationArgs,
  TransformFunctionDeclarationResult,
  TransformAssignmentExpressionArgs,
  TransformBinaryExpressionArgs,
  TransformCallExpressionArgs,
  TransformCallExpressionResult,
  TransformIfExpressionArgs,
  TransformMemberExpressionArgs,
  TransformObjectLiteralArgs,
  TransformPrimaryExpressionArgs,
  TransformPrimaryExpressionResult,
  TransformUnaryExpressionArgs,
  TransformMemberExpressionResult,
  TransformUnaryExpressionResult,
  TransformBinaryExpressionResult,
  TransformObjectLiteralResult,
  TransformIfExpressionResult,
  TransformAssignmentExpressionResult,
} from './types';
import {
  convertToJSBinaryOperator,
  convertToJSLogicalOperator,
  convertToJSUnaryOperator,
} from './helpers';

export function transformFunctionDeclaration(
  this: Transpiler,
  { astNode }: TransformFuntionDeclarationArgs,
): TransformFunctionDeclarationResult {
  const functionName = t.identifier(astNode.name.symbol);

  const functionParams = astNode.arguments.map(argument => {
    return argument.accept<JSIdentifier | Pattern | RestElement>(this);
  });

  const functionBody = t.blockStatement(
    astNode.body.map(expression => {
      const jsNode = expression.accept<Statement>(this);
      if (t.isExpression(jsNode)) {
        return t.expressionStatement(jsNode);
      }
      return jsNode;
    }),
  );
  console.log('functionBody', functionBody);
  return t.functionDeclaration(functionName, functionParams, functionBody);
}

// export function transformVariableDeclaration(
//   this: Transpiler,
//   { astNode }: TransformAssignmentExpressionArgs,
// ): t.VariableDeclaration {
//   // Assuming astNode.assignee is the variable name and astNode.value is the value being assigned.

//   // Create an Identifier for the variable name
//   const id = t.identifier(astNode.assignee.symbol);

//   // Transform the right-hand side expression
//   const init = astNode.value.accept<JSExpression>(this);

//   // Create a VariableDeclarator (part of a VariableDeclaration)
//   const declarator = t.variableDeclarator(id, init);

//   // Create and return the VariableDeclaration
//   // The kind can be 'var', 'let', or 'const' depending on your language's semantics
//   return t.variableDeclaration('var', [declarator]);
// }

export function transformAssignmentExpression(
  this: Transpiler,
  { astNode }: TransformAssignmentExpressionArgs,
): TransformAssignmentExpressionResult {
  const leftNode =
    astNode.assignee.type === ExpressionNodeType.Identifier
      ? t.identifier(astNode.assignee.symbol)
      : astNode.value.accept<OptionalMemberExpression>(this);

  const rightNode = astNode.value.accept<JSExpression>(this);
  const assignmentExpression = t.assignmentExpression('=', leftNode, rightNode);

  return t.expressionStatement(assignmentExpression);
}

export function transformIfExpression(
  this: Transpiler,
  { astNode }: TransformIfExpressionArgs,
): TransformIfExpressionResult {
  const conditionNode = astNode.condition.accept<JSExpression>(this);

  const thenBodyStatements = t.blockStatement(
    astNode.thenBody.map<Statement>(expression => {
      const jsNode = expression.accept<Statement>(this);
      if (t.isExpression(jsNode)) {
        return t.expressionStatement(jsNode);
      }
      return jsNode;
    }),
  );
  const elseBodyStatements = t.blockStatement(
    astNode.elseBody.map<Statement>(expression => {
      const jsNode = expression.accept<Statement>(this);
      if (t.isExpression(jsNode)) {
        return t.expressionStatement(jsNode);
      }
      return jsNode;
    }),
  );

  return t.ifStatement(conditionNode, thenBodyStatements, elseBodyStatements);
}

export function transformObjectLiteral(
  this: Transpiler,
  { astNode }: TransformObjectLiteralArgs,
): TransformObjectLiteralResult {
  const properties = astNode.properties.map(prop => {
    const keyNode = t.identifier(prop.key);

    // If valueNode is undefined, use keyNode for both key and value (shorthand property)
    const valueNode = prop.value
      ? prop.value?.accept<ObjectProperty['value']>(this)
      : keyNode;

    const isShorthand = keyNode === valueNode;

    return t.objectProperty(keyNode, valueNode, false, isShorthand);
  });

  return t.objectExpression(properties);
}

export function transformBinaryExpression(
  this: Transpiler,
  { astNode }: TransformBinaryExpressionArgs,
): TransformBinaryExpressionResult {
  const leftNode = astNode.left.accept<JSExpression>(this);
  const rightNode = astNode.right.accept<JSExpression>(this);
  const jsBinaryOperator = convertToJSBinaryOperator(astNode.operator);

  if (jsBinaryOperator) {
    return t.binaryExpression(jsBinaryOperator, leftNode, rightNode);
  }

  const jsLogicalOperator = convertToJSLogicalOperator(astNode.operator);

  if (jsLogicalOperator) {
    return t.logicalExpression(jsLogicalOperator, leftNode, rightNode);
  }

  throw new Error(`Invalid binary operator: ${astNode.operator}`);
}

export function transformUnaryExpression(
  this: Transpiler,
  { astNode }: TransformUnaryExpressionArgs,
): TransformUnaryExpressionResult {
  const argumentNode = astNode.argument.accept<JSExpression>(this);
  const jsUnaryOperator = convertToJSUnaryOperator(astNode.operator);

  if (!jsUnaryOperator) {
    throw new Error(`Invalid unary operator: ${astNode.operator}`);
  }

  return t.unaryExpression(jsUnaryOperator, argumentNode);
}

export function transformMemberExpression(
  this: Transpiler,
  { astNode }: TransformMemberExpressionArgs,
): TransformMemberExpressionResult {
  const transformedObject = astNode.object.accept<JSExpression>(this);
  const transformedProperty = astNode.property.accept<JSExpression>(this);

  const isComputed = transformedProperty.type !== ExpressionNodeType.Identifier;

  return t.memberExpression(transformedObject, transformedProperty, isComputed);
}

export function transformCallExpression(
  this: Transpiler,
  { astNode }: TransformCallExpressionArgs,
): TransformCallExpressionResult {
  const callee = astNode.caller.accept<StringLiteral>(this);
  const argumentsValues = astNode.arguments.map<
    JSExpression | SpreadElement | JSXNamespacedName | ArgumentPlaceholder
  >(argument => argument.accept(this));

  return t.callExpression(callee, argumentsValues);
}

export function transformPrimaryExpression(
  this: Transpiler,
  { astNode }: TransformPrimaryExpressionArgs,
): TransformPrimaryExpressionResult {
  switch (astNode.type) {
    case ExpressionNodeType.NumberLiteral: {
      return t.numericLiteral(astNode.value);
    }
    case ExpressionNodeType.StringLiteral: {
      return t.stringLiteral(astNode.value);
    }
    case ExpressionNodeType.FalseLiteral: {
      return t.booleanLiteral(false);
    }
    case ExpressionNodeType.TrueLiteral: {
      return t.booleanLiteral(true);
    }
    case ExpressionNodeType.NilLiteral: {
      return t.nullLiteral();
    }
    case ExpressionNodeType.Identifier: {
      return t.identifier(astNode.symbol);
    }
    default: {
      throw new Error(`Unsupported expression type: ${astNode}`);
    }
  }
}
