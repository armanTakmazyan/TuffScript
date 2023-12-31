import { ASTNodeVisitor, Program } from 'tuffscript/ast/types';
import { BaseSymbolTable } from 'tuffscript/symbolTable/types';
import { SymbolTable } from 'tuffscript/symbolTable';
import {
  TransformIdentifier,
  IdentifierAssignment,
  TransformVariableDeclarationResult,
} from './visitors/types';

export interface IdentifierTransformers {
  [key: string]: TransformIdentifier;
}

export interface TranspilerConstructorArgs {
  program: Program;
  identifierTransformers?: IdentifierTransformers;
}

export interface EnterScopeArgs {
  scopeName: string;
}

export interface TuffScriptToJSTranspiler extends ASTNodeVisitor {
  program: Program;
  currentScope: BaseSymbolTable;
  identifierTransformers: IdentifierTransformers;
  transpile: () => string;
  createGlobalScope: () => BaseSymbolTable;
  resetGlobalScope: () => BaseSymbolTable;
  enterScope: (args: EnterScopeArgs) => SymbolTable;
  exitScope: () => SymbolTable;
  visitVariableDeclaration: (
    node: IdentifierAssignment,
  ) => TransformVariableDeclarationResult;
}
