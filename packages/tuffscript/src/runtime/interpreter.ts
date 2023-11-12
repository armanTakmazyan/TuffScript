import { Program } from '../frontend/ast/types';
import { createGlobalEnviornment } from './environment/helpers';
import { evaluateProgram } from './evaluators/statements';
import { RuntimeValue } from './values/types';

interface InterpreterArgs {
  program: Program;
}

export class Interpreter {
  program: Program;

  constructor({ program }: InterpreterArgs) {
    this.program = program;
  }

  evaluate(): RuntimeValue {
    const environment = createGlobalEnviornment();

    return evaluateProgram({
      environment,
      program: this.program,
    });
  }
}
