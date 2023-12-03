import { ExpressionNodeType } from 'tuffscript/ast/types';
import { LinterVisitor } from '../type';
import {
  AnalyzeFuntionDeclarationArgs,
  RegisterVariablesFromExpressionsArgs,
} from './types';

export function registerVariablesFromExpressions(
  this: LinterVisitor,
  { expressions }: RegisterVariablesFromExpressionsArgs,
): void {
  expressions.forEach(expression => {
    switch (expression.type) {
      case ExpressionNodeType.AssignmentExpression: {
        if (expression.assignee.type === ExpressionNodeType.Identifier) {
          this.currentScope.insertVariableSymbolUnlessExists({
            name: expression.assignee.symbol,
            position: expression.assignee.position,
          });
        }
        // Other assignment types are not considered, as they don't introduce new variables in the current scope
        break;
      }
      case ExpressionNodeType.FunctionDeclaration: {
        this.currentScope.insertVariableSymbolUnlessExists({
          name: expression.name.symbol,
          position: expression.name.position,
        });
        break;
      }
      case ExpressionNodeType.IfExpression: {
        registerVariablesFromExpressions.call(this, {
          expressions: expression.thenBody,
        });
        registerVariablesFromExpressions.call(this, {
          expressions: expression.elseBody,
        });
        break;
      }
      default: {
        // Placeholder for handling other expression types, if needed in the future
      }
    }
  });
}

export function setupFunctionScope(
  this: LinterVisitor,
  { astNode }: AnalyzeFuntionDeclarationArgs,
): void {
  astNode.arguments.forEach(argument => {
    this.currentScope.insertVariableSymbolUnlessExists({
      name: argument.symbol,
      position: argument.position,
    });
  });

  registerVariablesFromExpressions.call(this, {
    expressions: astNode.body,
  });
}
