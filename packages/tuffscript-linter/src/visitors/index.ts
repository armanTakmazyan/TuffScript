import { ExpressionNodeType } from 'tuffscript/ast/types';
import { LinterVisitor } from '../type';
import {
  AnalyzeFuntionDeclarationArgs,
  AnalyzeAssignmentExpressionArgs,
  AnalyzeIfExpressionArgs,
  AnalyzeObjectLiteralArgs,
  AnalyzeBinaryExpressionArgs,
  AnalyzeUnaryExpressionArgs,
  AnalyzeMemberExpressionArgs,
  AnalyzeCallExpressionArgs,
  AnalyzePrimaryExpressionArgs,
} from './types';

export function analyzeFunctionDeclaration(
  this: LinterVisitor,
  { astNode }: AnalyzeFuntionDeclarationArgs,
): void {
  const functionSymbol = this.currentScope.insertVariableSymbolUnlessExists({
    name: astNode.name.symbol,
    position: astNode.position,
  });

  this.enterScope({ scopeName: functionSymbol.name });

  this.setupFunctionScope(astNode);

  astNode.body.forEach(expression => expression.accept(this));

  this.exitScope();
}

export function analyzeAssignmentExpression(
  this: LinterVisitor,
  { astNode }: AnalyzeAssignmentExpressionArgs,
): void {
  astNode.value.accept(this);
  if (astNode.assignee.type === ExpressionNodeType.Identifier) {
    // TODO: Currently, this only saves the first occurrence of each assignment expression
    this.currentScope.insertVariableSymbolUnlessExists({
      name: astNode.assignee.symbol,
      position: astNode.position,
    });
  } else {
    astNode.assignee.accept(this);
  }
}

export function analyzeIfExpression(
  this: LinterVisitor,
  { astNode }: AnalyzeIfExpressionArgs,
): void {
  astNode.condition.accept(this);
  astNode.thenBody.forEach(expression => expression.accept(this));
  astNode.elseBody.forEach(expression => expression.accept(this));
}

export function analyzeObjectLiteral(
  this: LinterVisitor,
  { astNode }: AnalyzeObjectLiteralArgs,
): void {
  astNode.properties.forEach(property => {
    if (property.value) {
      property.value.accept(this);
    } else {
      // Resolves references for shorthand notations
      this.currentScope.resolveReference({
        identifier: property.key,
        position: property.position,
      });
    }
  });
}

export function analyzeBinaryExpression(
  this: LinterVisitor,
  { astNode }: AnalyzeBinaryExpressionArgs,
): void {
  astNode.left.accept(this);
  astNode.right.accept(this);
}

export function analyzeUnaryExpression(
  this: LinterVisitor,
  { astNode }: AnalyzeUnaryExpressionArgs,
): void {
  astNode.argument.accept(this);
}

export function analyzeMemberExpression(
  this: LinterVisitor,
  { astNode }: AnalyzeMemberExpressionArgs,
): void {
  astNode.object.accept(this);
  // Analyze the property if it is a computed property
  if (astNode.computed) {
    astNode.property.accept(this);
  }
}

export function analyzeCallExpression(
  this: LinterVisitor,
  { astNode }: AnalyzeCallExpressionArgs,
): void {
  astNode.caller.accept(this);
  astNode.arguments.forEach(argument => argument.accept(this));
}

export function analyzePrimaryExpression(
  this: LinterVisitor,
  { astNode }: AnalyzePrimaryExpressionArgs,
): void {
  switch (astNode.type) {
    case ExpressionNodeType.NumberLiteral:
    case ExpressionNodeType.StringLiteral:
    case ExpressionNodeType.FalseLiteral:
    case ExpressionNodeType.TrueLiteral:
    case ExpressionNodeType.NilLiteral: {
      break;
    }
    case ExpressionNodeType.Identifier: {
      this.currentScope.resolveReference({
        identifier: astNode.symbol,
        position: astNode.position,
      });
      break;
    }
    default: {
      throw new Error(`Unsupported expression type: ${astNode}`);
    }
  }
}
