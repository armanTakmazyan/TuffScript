import {
  Program,
  ASTNodeVisitor,
  FunctionDeclaration,
} from 'tuffscript/ast/types';
import { SymbolTable } from 'tuffscript/symbolTable';
import {
  References,
  SymbolEntities,
  BaseSymbolTable,
} from 'tuffscript/symbolTable/types';

export interface EnterScopeArgs {
  scopeName: string;
}

export type GlobalImmutableSymbols = string[];

export interface LintProgramArgs {
  program: Program;
}

export interface LintProgramResult {
  unusedSymbols: SymbolEntities;
  unresolvedReferences: References;
  referencesBeforeAssignment: References;
}

export interface LinterVisitorArgs {
  globalImmutableSymbols?: GlobalImmutableSymbols;
}

export interface LinterVisitor extends ASTNodeVisitor {
  globalImmutableSymbols: GlobalImmutableSymbols;
  currentScope: BaseSymbolTable;
  unusedSymbols: SymbolEntities;
  unresolvedReferences: References;
  referencesBeforeAssignment: References;
  enterScope(args: EnterScopeArgs): SymbolTable;
  exitScope(): SymbolTable;
  setupFunctionScope(node: FunctionDeclaration): void;
}
