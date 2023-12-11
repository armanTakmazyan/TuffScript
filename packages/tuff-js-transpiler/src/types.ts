import { ASTNodeVisitor, Program } from 'tuffscript/ast/types';
import { BaseSymbolTable } from 'tuffscript/symbolTable/types';
import { SymbolTable } from 'tuffscript/symbolTable';
import {
  IdentifierAssignment,
  TransformVariableDeclarationResult,
} from './visitors/types';

export interface TranspilerConstructorArgs {
  program: Program;
}

export interface EnterScopeArgs {
  scopeName: string;
}

export interface TuffScriptToJSTranspiler extends ASTNodeVisitor {
  jsCode: string;
  program: Program;
  currentScope: BaseSymbolTable;
  transpile: () => string;
  createGlobalScope: () => BaseSymbolTable;
  resetGlobalScope: () => BaseSymbolTable;
  enterScope: (args: EnterScopeArgs) => SymbolTable;
  exitScope: () => SymbolTable;
  visitVariableDeclaration: (
    node: IdentifierAssignment,
  ) => TransformVariableDeclarationResult;
}
