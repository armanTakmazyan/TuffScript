import { ASTNodeVisitor, Program } from 'tuffscript/ast/types';

export interface TranspilerConstructorArgs {
  program: Program;
}

export interface TuffScriptToJSTranspiler extends ASTNodeVisitor {
  program: Program;
  jsCode: string;
  transpile: () => string;
}
