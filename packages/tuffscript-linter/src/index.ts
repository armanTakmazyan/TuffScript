import { globalFunctionNames } from 'tuffscript/runtime/constants';
import { GLOBAL_IMMUTABLE_SYMBOL_POSITION } from 'tuffscript/symbolTable/constants';
import { Symbol, SymbolTable } from 'tuffscript/symbolTable';
import {
  SymbolEntity,
  SymbolEntityTypes,
  BaseSymbolTable,
  References,
  SymbolTableScopeNames,
} from 'tuffscript/symbolTable/types';
import {
  FunctionDeclaration,
  AssignmentExpression,
  IfExpression,
  ObjectLiteral,
  BinaryExpression,
  UnaryExpression,
  MemberExpression,
  CallExpression,
  Identifier,
  NumberLiteral,
  StringLiteral,
  TrueLiteral,
  FalseLiteral,
  NilLiteral,
} from 'tuffscript/ast/types';
import {
  analyzeFunctionDeclaration,
  analyzeAssignmentExpression,
  analyzeIfExpression,
  analyzeObjectLiteral,
  analyzeBinaryExpression,
  analyzeUnaryExpression,
  analyzeMemberExpression,
  analyzeCallExpression,
  analyzePrimaryExpression,
} from './visitors';
import {
  setupFunctionScope,
  registerVariablesFromExpressions,
} from './visitors/helpers';
import {
  GlobalImmutableSymbols,
  EnterScopeArgs,
  LintProgramArgs,
  LinterVisitor,
  LinterVisitorArgs,
  LintProgramResult,
} from './type';

export class TuffScriptLinter implements LinterVisitor {
  globalImmutableSymbols: GlobalImmutableSymbols;
  currentScope: BaseSymbolTable;
  unusedSymbols: SymbolEntity[];
  unresolvedReferences: References;
  referencesBeforeAssignment: References;

  constructor({ globalImmutableSymbols = [] }: LinterVisitorArgs = {}) {
    this.globalImmutableSymbols = [
      ...globalImmutableSymbols,
      ...Object.values(globalFunctionNames),
    ];

    this.currentScope = this.createGlobalScope();
    this.unusedSymbols = [];
    this.unresolvedReferences = [];
    this.referencesBeforeAssignment = [];
  }

  createGlobalScope(): BaseSymbolTable {
    this.currentScope = new SymbolTable({
      scopeName: SymbolTableScopeNames.Global,
      scopeLevel: 0,
      references: [],
      symbols: new Map(),
      parentScope: undefined,
    });

    this.currentScope.symbols = this.globalImmutableSymbols.reduce(
      (result, globalSymbol) => {
        const newGlobalSymbol = new Symbol({
          name: globalSymbol,
          references: [],
          scope: this.currentScope,
          type: SymbolEntityTypes.Variable,
          position: GLOBAL_IMMUTABLE_SYMBOL_POSITION,
        });
        return result.set(globalSymbol, newGlobalSymbol);
      },
      new Map<string, SymbolEntity>(),
    );

    return this.currentScope;
  }

  resetGlobalScope(): BaseSymbolTable {
    this.currentScope = this.createGlobalScope();
    this.unusedSymbols = [];
    this.unresolvedReferences = [];
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
    // Identify and store unused variables
    this.currentScope.symbols.forEach(symbol => {
      if (
        !this.globalImmutableSymbols.includes(symbol.name) &&
        !symbol.references.length
      ) {
        this.unusedSymbols.push(symbol);
      }
    });
    // Filter unresolved references and track usage before assignment in current scope
    this.currentScope.references.forEach(reference => {
      if (!reference.resolved) {
        this.unresolvedReferences.push(reference);
      } else {
        if (
          reference.resolved.position.start !== -1 &&
          reference.position.start < reference.resolved.position.start
        ) {
          this.referencesBeforeAssignment.push(reference);
        }
      }
    });
    // Exit to parent scope if available, otherwise stay in the current (global) scope
    if (this.currentScope.parentScope) {
      this.currentScope = this.currentScope.parentScope;
    }

    return this.currentScope;
  }

  setupFunctionScope(node: FunctionDeclaration): void {
    setupFunctionScope.call(this, { astNode: node });
  }

  visitFunctionDeclaration(node: FunctionDeclaration): void {
    analyzeFunctionDeclaration.call(this, { astNode: node });
  }

  visitAssignmentExpression(node: AssignmentExpression): void {
    analyzeAssignmentExpression.call(this, { astNode: node });
  }

  visitIfExpression(node: IfExpression): void {
    analyzeIfExpression.call(this, { astNode: node });
  }

  visitObjectLiteral(node: ObjectLiteral): void {
    analyzeObjectLiteral.call(this, { astNode: node });
  }

  visitBinaryExpression(node: BinaryExpression): void {
    analyzeBinaryExpression.call(this, { astNode: node });
  }

  visitUnaryExpression(node: UnaryExpression): void {
    analyzeUnaryExpression.call(this, { astNode: node });
  }

  visitMemberExpression(node: MemberExpression): void {
    analyzeMemberExpression.call(this, { astNode: node });
  }

  visitCallExpression(node: CallExpression): void {
    analyzeCallExpression.call(this, { astNode: node });
  }

  visitIdentifier(node: Identifier): void {
    analyzePrimaryExpression.call(this, { astNode: node });
  }

  visitNumberLiteral(node: NumberLiteral): void {
    analyzePrimaryExpression.call(this, { astNode: node });
  }

  visitStringLiteral(node: StringLiteral): void {
    analyzePrimaryExpression.call(this, { astNode: node });
  }

  visitTrueLiteral(node: TrueLiteral): void {
    analyzePrimaryExpression.call(this, { astNode: node });
  }

  visitFalseLiteral(node: FalseLiteral): void {
    analyzePrimaryExpression.call(this, { astNode: node });
  }

  visitNilLiteral(node: NilLiteral): void {
    analyzePrimaryExpression.call(this, { astNode: node });
  }

  lintProgram({ program }: LintProgramArgs): LintProgramResult {
    this.resetGlobalScope();
    // TODO: Consider alternative invocation patterns for registerVariablesFromExpressions, possibly integrating into the visitor
    registerVariablesFromExpressions.call(this, {
      expressions: program.body,
    });
    program.body.forEach(expression => {
      expression.accept(this);
    });
    this.exitScope();

    return {
      unusedSymbols: this.unusedSymbols,
      unresolvedReferences: this.unresolvedReferences,
      referencesBeforeAssignment: this.referencesBeforeAssignment,
    };
  }
}
