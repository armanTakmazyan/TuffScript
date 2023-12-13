import * as t from '@babel/types';
import { Statement } from '@babel/types';
import * as parser from '@babel/parser';
import generate from '@babel/generator';
import { SymbolTable } from 'tuffscript/symbolTable';
import {
  BaseSymbolTable,
  SymbolTableScopeNames,
} from 'tuffscript/symbolTable/types';
import {
  AssignmentExpression,
  BinaryExpression,
  CallExpression,
  FalseLiteral,
  FunctionDeclaration,
  Identifier,
  IfExpression,
  MemberExpression,
  NilLiteral,
  NumberLiteral,
  ObjectLiteral,
  Program,
  StringLiteral,
  TrueLiteral,
  UnaryExpression,
} from 'tuffscript/ast/types';
import {
  transformVariableDeclaration,
  transformAssignmentExpression,
  transformBinaryExpression,
  transformCallExpression,
  transformFunctionDeclaration,
  transformIfExpression,
  transformMemberExpression,
  transformObjectLiteral,
  transformPrimaryExpression,
  transformUnaryExpression,
} from './visitors';
import {
  EnterScopeArgs,
  IdentifierTransformers,
  TuffScriptToJSTranspiler,
  TranspilerConstructorArgs,
} from './types';
import {
  TransformResult,
  IdentifierAssignment,
  TransformVariableDeclarationResult,
  TransformAssignmentExpressionResult,
  TransformBinaryExpressionResult,
  TransformCallExpressionResult,
  TransformFunctionDeclarationResult,
  TransformIfExpressionResult,
  TransformMemberExpressionResult,
  TransformObjectLiteralResult,
  TransformPrimaryExpressionResult,
  TransformUnaryExpressionResult,
} from './visitors/types';

export class Transpiler implements TuffScriptToJSTranspiler {
  program: Program;
  jsCode: string;
  currentScope: BaseSymbolTable;
  identifierTransformers: IdentifierTransformers;

  constructor({
    program,
    identifierTransformers = {},
  }: TranspilerConstructorArgs) {
    this.program = program;
    this.jsCode = '';
    this.identifierTransformers = identifierTransformers;
    this.currentScope = this.createGlobalScope();
  }

  createGlobalScope(): BaseSymbolTable {
    this.currentScope = new SymbolTable({
      scopeName: SymbolTableScopeNames.Global,
      scopeLevel: 0,
      references: [],
      symbols: new Map(),
      parentScope: undefined,
    });

    return this.currentScope;
  }

  resetGlobalScope(): BaseSymbolTable {
    this.jsCode = '';
    this.currentScope = this.createGlobalScope();
    return this.currentScope;
  }

  enterScope({ scopeName }: EnterScopeArgs): SymbolTable {
    const newScopeLevel = this.currentScope.scopeLevel + 1;
    const newScope = new SymbolTable({
      scopeName: `${scopeName}_${newScopeLevel}`,
      scopeLevel: newScopeLevel,
      references: [],
      symbols: new Map(),
      parentScope: this.currentScope,
    });
    this.currentScope = newScope;
    return this.currentScope;
  }

  exitScope(): SymbolTable {
    // Exit to parent scope if available, otherwise stay in the current (global) scope
    if (this.currentScope.parentScope) {
      this.currentScope = this.currentScope.parentScope;
    }

    return this.currentScope;
  }

  transpile(): string {
    this.resetGlobalScope();
    const body: Statement[] = [];

    this.program.body.forEach(expression => {
      const jsNode = expression.accept<TransformResult>(this);

      if (t.isExpression(jsNode)) {
        body.push(t.expressionStatement(jsNode));
      } else if (t.isStatement(jsNode)) {
        body.push(jsNode);
      } else {
        // Handle error or unexpected node type
      }
    });

    const ast = parser.parse(''); // Parsing empty string creates AST with File and Program nodes

    ast.program.body = body;

    this.jsCode = generate(ast).code;

    return this.jsCode;
  }

  visitFunctionDeclaration(
    node: FunctionDeclaration,
  ): TransformFunctionDeclarationResult {
    return transformFunctionDeclaration.call(this, { astNode: node });
  }

  visitVariableDeclaration(
    node: IdentifierAssignment,
  ): TransformVariableDeclarationResult {
    return transformVariableDeclaration.call(this, { astNode: node });
  }

  visitAssignmentExpression(
    node: AssignmentExpression,
  ): TransformAssignmentExpressionResult {
    return transformAssignmentExpression.call(this, { astNode: node });
  }

  visitIfExpression(node: IfExpression): TransformIfExpressionResult {
    return transformIfExpression.call(this, { astNode: node });
  }

  visitObjectLiteral(node: ObjectLiteral): TransformObjectLiteralResult {
    return transformObjectLiteral.call(this, { astNode: node });
  }

  visitBinaryExpression(
    node: BinaryExpression,
  ): TransformBinaryExpressionResult {
    return transformBinaryExpression.call(this, { astNode: node });
  }

  visitUnaryExpression(node: UnaryExpression): TransformUnaryExpressionResult {
    return transformUnaryExpression.call(this, { astNode: node });
  }

  visitMemberExpression(
    node: MemberExpression,
  ): TransformMemberExpressionResult {
    return transformMemberExpression.call(this, { astNode: node });
  }

  visitCallExpression(node: CallExpression): TransformCallExpressionResult {
    return transformCallExpression.call(this, { astNode: node });
  }

  visitIdentifier(node: Identifier): TransformPrimaryExpressionResult {
    return transformPrimaryExpression.call(this, { astNode: node });
  }

  visitNumberLiteral(node: NumberLiteral): TransformPrimaryExpressionResult {
    return transformPrimaryExpression.call(this, { astNode: node });
  }

  visitStringLiteral(node: StringLiteral): TransformPrimaryExpressionResult {
    return transformPrimaryExpression.call(this, { astNode: node });
  }

  visitTrueLiteral(node: TrueLiteral): TransformPrimaryExpressionResult {
    return transformPrimaryExpression.call(this, { astNode: node });
  }

  visitFalseLiteral(node: FalseLiteral): TransformPrimaryExpressionResult {
    return transformPrimaryExpression.call(this, { astNode: node });
  }

  visitNilLiteral(node: NilLiteral): TransformPrimaryExpressionResult {
    return transformPrimaryExpression.call(this, { astNode: node });
  }
}
