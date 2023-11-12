import {
  Program,
  Assignment,
  FunctionDeclaration,
  StatementOrExpression,
} from '../../../frontend/ast/types';
import { Environment } from '../../environment';

export interface EvaluateProgramArgs {
  program: Program;
  environment: Environment;
}

export interface EvaluateAssignmentArgs {
  assignment: Assignment;
  environment: Environment;
}

export interface EvaluateFunctionDeclarationArgs {
  environment: Environment;
  declaration: FunctionDeclaration;
}

export interface EvaluateArgs {
  environment: Environment;
  astNode: StatementOrExpression;
}
