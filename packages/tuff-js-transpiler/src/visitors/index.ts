import * as t from '@babel/types';
import {
  Node as JSNode,
  Statement as JSStatement,
  Expression as JSExpression,
  Identifier as JSIdentifier,
  StringLiteral as JSStringLiteral,
  ObjectProperty as JSObjectProperty,
  MemberExpression as JSMemberExpression,
  OptionalMemberExpression as JSOptionalMemberExpression,
} from '@babel/types';
import { Symbol } from 'tuffscript/symbolTable';
import { SymbolEntityTypes } from 'tuffscript/symbolTable/types';
import { globalFunctionNames } from 'tuffscript/runtime/constants';
import { AssignmentExpression, ExpressionNodeType } from 'tuffscript/ast/types';
import {
  TransformResult,
  TransformFuntionDeclarationArgs,
  TransformFunctionDeclarationResult,
  TransformVariableDeclarationArgs,
  TransformVariableDeclarationResult,
  CreateAssignmentExpressionResult,
  TransformAssignmentExpressionArgs,
  TransformAssignmentExpressionResult,
  TransformBinaryExpressionArgs,
  TransformBinaryExpressionResult,
  TransformCallExpressionArgs,
  TransformCallExpressionResult,
  TransformIfExpressionArgs,
  TransformIfExpressionResult,
  TransformMemberExpressionArgs,
  TransformMemberExpressionResult,
  TransformObjectLiteralArgs,
  TransformObjectLiteralResult,
  TransformPrimaryExpressionArgs,
  TransformPrimaryExpressionResult,
  TransformUnaryExpressionArgs,
  TransformUnaryExpressionResult,
  TransformIdentifierArgs,
  TransformIdentifierResult,
} from './types';
import {
  isIdentifierAssignment,
  convertToJSUnaryOperator,
  convertToJSBinaryOperator,
  convertToJSLogicalOperator,
  createTransliteratedIdentifier,
} from './helpers';
import { Transpiler } from '../index';

export function createProcessExitExpression(): JSMemberExpression {
  const processId = t.identifier('process');
  const exitId = t.identifier('exit');
  return t.memberExpression(processId, exitId);
}

export function createConsoleLogExpression(): JSMemberExpression {
  const consoleId = t.identifier('console');
  const logId = t.identifier('log');
  return t.memberExpression(consoleId, logId);
}

export function createPromptIdentifier(): JSIdentifier {
  const promptSyncId = t.identifier('prompt');
  return promptSyncId;
}

export function createDateNowExpression(): JSMemberExpression {
  const dateId = t.identifier('Date');
  const nowId = t.identifier('now');
  return t.memberExpression(dateId, nowId);
}

export function createTakeIdentifier(): JSIdentifier {
  const takeId = t.identifier('take');
  return takeId;
}

export function createLenIdentifier(): JSIdentifier {
  const lenId = t.identifier('len');
  return lenId;
}

export function createTuffScriptSliceIdentifier(): JSIdentifier {
  const tuffScriptSliceId = t.identifier('tuffScriptSlice');
  return tuffScriptSliceId;
}

export function createTuffScriptCharCodeAtIdentifier(): JSIdentifier {
  const tuffScriptCharCodeId = t.identifier('tuffScriptCharCode');
  return tuffScriptCharCodeId;
}

export function createTuffScriptFromCharCodeExpression(): JSMemberExpression {
  const StringId = t.identifier('String');
  const fromCharCodeId = t.identifier('fromCharCode');
  return t.memberExpression(StringId, fromCharCodeId);
}

// In the assignment expression, we return the value
export function ensureLastExpressionIsReturned(statements: JSNode[]): void {
  if (statements.length <= 0) {
    return;
  }

  const lastNode = statements[statements.length - 1];

  switch (lastNode.type) {
    case 'ExpressionStatement': {
      statements[statements.length - 1] = t.returnStatement(
        lastNode.expression,
      );
      break;
    }
    case 'VariableDeclaration': {
      const lastDeclarator =
        lastNode.declarations[lastNode.declarations.length - 1];
      if (
        lastDeclarator &&
        t.isIdentifier(lastDeclarator.id) &&
        lastDeclarator.init
      ) {
        statements.push(t.returnStatement(t.cloneNode(lastDeclarator.id)));
      }
      break;
    }
    case 'FunctionDeclaration': {
      // Convert function declaration to function expression to return it
      const functionExpression = t.functionExpression(
        lastNode.id, // null for anonymous functions
        lastNode.params,
        lastNode.body,
        lastNode.generator,
        lastNode.async,
      );

      statements[statements.length - 1] = t.returnStatement(functionExpression);
      break;
    }
    case 'BlockStatement': {
      ensureLastExpressionIsReturned(lastNode.body);
      break;
    }
    case 'IfStatement': {
      ensureLastExpressionIsReturned([lastNode.consequent]);
      if (lastNode.alternate) {
        ensureLastExpressionIsReturned([lastNode.alternate]);
      }
      break;
    }
    default: {
      break;
    }
  }
}

export function transformFunctionDeclaration(
  this: Transpiler,
  { astNode }: TransformFuntionDeclarationArgs,
): TransformFunctionDeclarationResult {
  const functionName = createTransliteratedIdentifier(astNode.name.symbol);

  const functionSymbol = this.currentScope.insertVariableSymbolUnlessExists({
    name: astNode.name.symbol,
    position: astNode.position,
  });

  this.enterScope({ scopeName: functionSymbol.name });

  astNode.arguments.forEach(argument => {
    this.currentScope.insertVariableSymbolUnlessExists({
      name: argument.symbol,
      position: argument.position,
    });
  });

  const functionParams = astNode.arguments.map(argument => {
    return argument.accept<JSIdentifier>(this);
  });

  const functionBodyNodes = astNode.body.map(expression => {
    const jsNode = expression.accept<TransformResult>(this);
    if (t.isExpression(jsNode)) {
      return t.expressionStatement(jsNode);
    }
    return jsNode;
  });

  ensureLastExpressionIsReturned(functionBodyNodes);

  const functionBody = t.blockStatement(functionBodyNodes);

  this.exitScope();

  return t.functionDeclaration(functionName, functionParams, functionBody);
}

export function transformVariableDeclaration(
  this: Transpiler,
  { astNode }: TransformVariableDeclarationArgs,
): TransformVariableDeclarationResult {
  const variableName = createTransliteratedIdentifier(astNode.assignee.symbol);

  const variableValue = astNode.value.accept<JSExpression>(this);

  const declarator = t.variableDeclarator(variableName, variableValue);

  return t.variableDeclaration('var', [declarator]);
}

export function createAssignmentExpression(
  this: Transpiler,
  { assignee, value }: AssignmentExpression,
): CreateAssignmentExpressionResult {
  const leftNode = assignee.accept<JSOptionalMemberExpression>(this);
  const rightNode = value.accept<JSExpression>(this);
  const assignmentExpression = t.assignmentExpression('=', leftNode, rightNode);

  return t.expressionStatement(assignmentExpression);
}

export function transformAssignmentExpression(
  this: Transpiler,
  { astNode }: TransformAssignmentExpressionArgs,
): TransformAssignmentExpressionResult {
  if (isIdentifierAssignment(astNode)) {
    const identifier = this.currentScope.lookup({
      name: astNode.assignee.symbol,
      currentScopeOnly: true,
    });

    if (identifier) {
      return createAssignmentExpression.call(this, astNode);
    } else {
      const newSymbol = new Symbol({
        name: astNode.assignee.symbol,
        references: [],
        scope: this.currentScope,
        type: SymbolEntityTypes.Variable,
        position: astNode.assignee.position,
      });
      this.currentScope.insertUnlessExists({ symbol: newSymbol });
      return this.visitVariableDeclaration(astNode);
    }
  } else {
    return createAssignmentExpression.call(this, astNode);
  }
}

export function transformIfExpression(
  this: Transpiler,
  { astNode }: TransformIfExpressionArgs,
): TransformIfExpressionResult {
  const conditionNode = astNode.condition.accept<JSExpression>(this);

  const thenBodyStatements = t.blockStatement(
    astNode.thenBody.map<JSStatement>(expression => {
      const jsNode = expression.accept<TransformResult>(this);
      if (t.isExpression(jsNode)) {
        return t.expressionStatement(jsNode);
      }
      return jsNode;
    }),
  );
  const elseBodyStatements = t.blockStatement(
    astNode.elseBody.map<JSStatement>(expression => {
      const jsNode = expression.accept<TransformResult>(this);
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
    const keyNode = t.stringLiteral(prop.key);
    const transliteratedIdentifier = createTransliteratedIdentifier(prop.key);

    // If prop.value is undefined, use transliteratedIdentifier for value (shorthand property)
    const valueNode = prop.value
      ? prop.value?.accept<JSObjectProperty['value']>(this)
      : transliteratedIdentifier;

    const isComputed = false;
    const isShorthand = false;

    return t.objectProperty(keyNode, valueNode, isComputed, isShorthand);
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

  const transformedProperty: JSExpression = astNode.computed
    ? astNode.property.accept<JSExpression>(this)
    : t.stringLiteral(astNode.property.symbol);

  const isComputed = true;

  return t.memberExpression(transformedObject, transformedProperty, isComputed);
}

export function transformCallExpression(
  this: Transpiler,
  { astNode }: TransformCallExpressionArgs,
): TransformCallExpressionResult {
  const callee = astNode.caller.accept<JSStringLiteral>(this);
  const argumentsValues = astNode.arguments.map<JSExpression>(argument =>
    argument.accept(this),
  );

  return t.callExpression(callee, argumentsValues);
}

export function transformIdentifier(
  this: Transpiler,
  { astNode }: TransformIdentifierArgs,
): TransformIdentifierResult {
  if (this.identifierTransformers[astNode.symbol]) {
    return this.identifierTransformers[astNode.symbol].call(this, {
      astNode,
    });
  }

  if (astNode.symbol === globalFunctionNames.exit) {
    return createProcessExitExpression();
  }

  if (astNode.symbol === globalFunctionNames.print) {
    return createConsoleLogExpression();
  }

  if (astNode.symbol === globalFunctionNames.prompt) {
    return createPromptIdentifier();
  }

  if (astNode.symbol === globalFunctionNames.time) {
    return createDateNowExpression();
  }

  if (astNode.symbol === globalFunctionNames.take) {
    return createTakeIdentifier();
  }

  if (astNode.symbol === globalFunctionNames.len) {
    return createLenIdentifier();
  }

  if (astNode.symbol === globalFunctionNames.slice) {
    return createTuffScriptSliceIdentifier();
  }

  if (astNode.symbol === globalFunctionNames.charCodeAt) {
    return createTuffScriptCharCodeAtIdentifier();
  }

  if (astNode.symbol === globalFunctionNames.fromCharCode) {
    return createTuffScriptFromCharCodeExpression();
  }

  return createTransliteratedIdentifier(astNode.symbol);
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
      return transformIdentifier.call(this, { astNode });
    }
    default: {
      throw new Error(`Unsupported expression type: ${astNode}`);
    }
  }
}
