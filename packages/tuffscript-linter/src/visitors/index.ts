import { ExpressionNodeType } from 'tuffscript/ast/types';
import { Symbol } from '../SymbolTable';
import { SymbolEntityTypes } from '../SymbolTable/types';
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
  const functionSymbol = new Symbol({
    name: astNode.name.symbol,
    type: SymbolEntityTypes.Variable,
    references: [],
    scope: this.currentScope,
    position: astNode.position,
  });

  this.currentScope.symbols.set(functionSymbol.name, functionSymbol);

  this.enterScope({ scopeName: functionSymbol.name });

  astNode.arguments.forEach(argument => {
    const argumentSymbol = new Symbol({
      name: argument.symbol,
      type: SymbolEntityTypes.Variable,
      references: [],
      scope: this.currentScope,
      position: argument.position,
    });
    this.currentScope.symbols.set(argument.symbol, argumentSymbol);
  });
  astNode.body.forEach(expression => expression.accept(this));

  this.exitScope();
}

export function analyzeAssignmentExpression(
  this: LinterVisitor,
  { astNode }: AnalyzeAssignmentExpressionArgs,
): void {
  astNode.value.accept(this);
  const assigneSymbol = new Symbol({
    name: astNode.assigne.symbol,
    type: SymbolEntityTypes.Variable,
    references: [],
    scope: this.currentScope,
    position: astNode.position,
  });
  this.currentScope.insert({ symbol: assigneSymbol });
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
    }
    // Resolves references for shorthand notations
    this.currentScope.resolveReference({
      identifier: property.key,
      position: property.position,
    });
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
  // Skip further checks if 'property' is an Identifier, as it's part of the object structure, not a separate entity
  if (astNode.property.type !== ExpressionNodeType.Identifier) {
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
