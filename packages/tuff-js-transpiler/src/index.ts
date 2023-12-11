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
  TuffScriptToJSTranspiler,
  TranspilerConstructorArgs,
} from './types';
import {
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
  TransformResult,
  TransformUnaryExpressionResult,
} from './visitors/types';

export class Transpiler implements TuffScriptToJSTranspiler {
  program: Program;
  jsCode: string;
  currentScope: BaseSymbolTable;

  constructor({ program }: TranspilerConstructorArgs) {
    this.program = program;
    this.jsCode = '';
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

import { Lexer, Parser as TuffScriptParser } from 'tuffscript';

const simpleFunction = `
տպել(5 փոքր է 5)
տպել(5 մեծ է 5)
տպել(5 հավասար է 5)
տպել(5 հավասար է 5)
տպել(ոչ 5 հավասար է 5)
տպել(5 հավասար է 5 և 5 մեծ է 4)
տպել(5 փոքր է 5 կամ 5 մեծ է 4)

տպել(5+5+5)
տպել(5-5+18)
տպել(5/5)
տպել(5*5)
տպել(5%5)   



պահել 9 ա ում
պահել -5 բ ում
տպել(ա - բ)

պահել սահմանված չէ ա ում

եթե ա կատարել
  3
հակառակ դեպքում 
  4
ավարտել

տպել(5)
տպել('myString')
տպել(ճշմարտություն)
տպել(կեղծիք)
տպել(սահմանված չէ)

պահել {բ: 'my_property'} ա ում
տպել(ա)
տպել(ա.բ)


ֆունկցիա իմՖունկցիա(ա, բ) կատարել
  տպել(ա, բ)
  ֆունկցիա իմՖունկցիաիմՖունկցիա(ա, բ) կատարել
  տպել(ա, բ)
  եթե ա կատարել
  3
հակառակ դեպքում 
  -ա.բ հավասար է 5
ավարտել
ավարտել
պահել սահմանված չէ աաաա ում
ավարտել

իմՖունկցիա(1,2)




`;

const lexer = new Lexer(simpleFunction);
const tokens = lexer.lexAnalysis();
const tuffscriptParser = new TuffScriptParser({ tokens });
const astTree = tuffscriptParser.produceAST();

const transpiler = new Transpiler({ program: astTree });

console.log(transpiler.transpile());
