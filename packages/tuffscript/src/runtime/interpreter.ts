import { Program } from '../frontend/ast/types';
import { createGlobalEnvironment } from './environment/helpers';
import { evaluateProgram } from './evaluators';
import { RuntimeValue } from './values/types';

interface InterpreterArgs {
  program: Program;
}

// TODO: Improve error messages
export class Interpreter {
  program: Program;

  constructor({ program }: InterpreterArgs) {
    this.program = program;
  }

  evaluate(): RuntimeValue {
    const environment = createGlobalEnvironment({ program: this.program });

    return evaluateProgram({
      environment,
      program: this.program,
    });
  }
}
