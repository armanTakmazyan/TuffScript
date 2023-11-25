import { globalFunctionNames } from 'tuffscript/runtime/constants';
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
import { Symbol, SymbolTable } from './SymbolTable';
import {
  SymbolEntity,
  SymbolEntityTypes,
  BaseSymbolTable,
  References,
  SymbolTableScopeNames,
} from './SymbolTable/types';
import {
  GlobalSymbols,
  EnterScopeArgs,
  LintProgramArgs,
  LinterVisitor,
  LinterVisitorArgs,
} from './type';

export class TuffScriptLinter implements LinterVisitor {
  globalSymbols: GlobalSymbols;
  currentScope: BaseSymbolTable;
  unusedSymbols: SymbolEntity[];
  unresolvedReferences: References;

  constructor({ globalSymbols = [] }: LinterVisitorArgs = {}) {
    this.globalSymbols = [
      ...globalSymbols,
      ...Object.values(globalFunctionNames),
    ];

    this.currentScope = new SymbolTable({
      scopeName: SymbolTableScopeNames.Global,
      scopeLevel: 0,
      references: new Map(),
      symbols: new Map(),
      parentScope: undefined,
    });

    this.currentScope.symbols = this.globalSymbols.reduce(
      (result, globalSymbol) => {
        const newGlobalSymbol = new Symbol({
          name: globalSymbol,
          references: [],
          scope: this.currentScope,
          type: SymbolEntityTypes.Variable,
        });
        return result.set(globalSymbol, newGlobalSymbol);
      },
      new Map<string, SymbolEntity>(),
    );

    this.unusedSymbols = [];
    this.unresolvedReferences = [];
  }

  enterScope({ scopeName }: EnterScopeArgs): SymbolTable {
    const newScopeLevel = this.currentScope.scopeLevel + 1;
    const newScope = new SymbolTable({
      scopeName: `${scopeName}_${newScopeLevel}`,
      scopeLevel: newScopeLevel,
      references: new Map(),
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
        !this.globalSymbols.includes(symbol.name) &&
        !symbol.references.length
      ) {
        this.unusedSymbols.push(symbol);
      }
    });
    // Collect unresolved references
    this.currentScope.references.forEach(reference => {
      if (!reference.resolved) {
        this.unresolvedReferences.push(reference);
      }
    });

    // TODO: think about this
    if (this.currentScope.parentScope) {
      this.currentScope = this.currentScope.parentScope;
    }

    return this.currentScope;
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

  lintProgram({ program }: LintProgramArgs): void {
    program.body.forEach(expression => {
      expression.accept(this);
    });
    this.exitScope();
  }
}
