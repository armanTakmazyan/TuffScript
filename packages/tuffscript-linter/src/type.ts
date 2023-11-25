import { ASTNodeVisitor, Program } from 'tuffscript/ast/types';
import { SymbolTable } from './SymbolTable';
import {
  References,
  SymbolEntities,
  BaseSymbolTable,
} from './SymbolTable/types';

export interface EnterScopeArgs {
  scopeName: string;
}

export type GlobalSymbols = string[];

export interface LintProgramArgs {
  program: Program;
}

export interface LintProgramResult {
  unusedSymbols: SymbolEntities;
  unresolvedReferences: References;
}

export interface LinterVisitorArgs {
  globalSymbols?: GlobalSymbols;
}

export interface LinterVisitor extends ASTNodeVisitor {
  globalSymbols: GlobalSymbols;
  currentScope: BaseSymbolTable;
  unusedSymbols: SymbolEntities;
  unresolvedReferences: References;
  enterScope(args: EnterScopeArgs): SymbolTable;
  exitScope(): SymbolTable;
}
