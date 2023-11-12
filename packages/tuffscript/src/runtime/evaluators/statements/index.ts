import {
  StatementNodeType,
  ExpressionNodeType,
} from '../../../frontend/ast/types';
import {
  Values,
  NilValue,
  RuntimeValue,
  FunctionValue,
} from '../../values/types';
import { createNil } from '../../values/factories';
import {
  evaluateNil,
  evaluateIdentifier,
  evaluateNumber,
  evaluateString,
  evaluateTrueLiteral,
  evaluateFalseLiteral,
  evaluateObjectExpression,
  evaluateMemberExpression,
  evaluateBinaryExpression,
  evaluateUnaryExpression,
  evaluateCallExpression,
} from '../expressions';
import {
  EvaluateArgs,
  EvaluateProgramArgs,
  EvaluateAssignmentArgs,
  EvaluateFunctionDeclarationArgs,
} from './types';

export function evaluateAssignment({
  environment,
  assignment,
}: EvaluateAssignmentArgs): RuntimeValue {
  return environment.assignVariable({
    name: assignment.assigne,
    value: evaluate({ environment, astNode: assignment.value }),
  });
}

export function evaluateFunctionDeclaration({
  declaration,
  environment,
}: EvaluateFunctionDeclarationArgs): FunctionValue {
  const newFunction: FunctionValue = {
    type: Values.Function,
    name: declaration.name,
    arguments: declaration.arguments,
    declarationEnvironment: environment,
    body: declaration.body,
  };

  environment.assignVariable({ name: newFunction.name, value: newFunction });

  return newFunction;
}

export function evaluateIfStatement(): NilValue {
  return createNil();
}

export function evaluate({ astNode, environment }: EvaluateArgs): RuntimeValue {
  switch (astNode.type) {
    case StatementNodeType.Assignment: {
      return evaluateAssignment({ assignment: astNode, environment });
    }
    case StatementNodeType.IfStatement: {
      return evaluateIfStatement();
    }
    case StatementNodeType.FunctionDeclaration: {
      return evaluateFunctionDeclaration({ declaration: astNode, environment });
    }
    case ExpressionNodeType.NilLiteral: {
      return evaluateNil();
    }
    case ExpressionNodeType.TrueLiteral: {
      return evaluateTrueLiteral();
    }
    case ExpressionNodeType.FalseLiteral: {
      return evaluateFalseLiteral();
    }
    case ExpressionNodeType.Identifier: {
      return evaluateIdentifier({
        environment,
        identifier: astNode,
      });
    }
    case ExpressionNodeType.NumberLiteral: {
      return evaluateNumber({
        numberLiteral: astNode,
      });
    }
    case ExpressionNodeType.StringLiteral: {
      return evaluateString({
        stringLiteral: astNode,
      });
    }
    case ExpressionNodeType.ObjectLiteral: {
      return evaluateObjectExpression({
        environment,
        objectLiteral: astNode,
      });
    }
    case ExpressionNodeType.BinaryExpression: {
      return evaluateBinaryExpression({
        environment,
        binaryExpression: astNode,
      });
    }
    case ExpressionNodeType.UnaryExpression: {
      return evaluateUnaryExpression({
        environment,
        unaryExpression: astNode,
      });
    }
    case ExpressionNodeType.CallExpression: {
      return evaluateCallExpression({
        environment,
        callExpression: astNode,
      });
    }
    case ExpressionNodeType.MemberExpression: {
      return evaluateMemberExpression({
        environment,
        memberExpression: astNode,
      });
    }
    default: {
      throw new Error(
        `This AST Node has not yet been setup for interpretation.\n ${astNode}`,
      );
    }
  }
}

export function evaluateProgram({
  program,
  environment,
}: EvaluateProgramArgs): RuntimeValue {
  let lastEvaluated: RuntimeValue = createNil();
  for (const statement of program.body) {
    lastEvaluated = evaluate({
      environment,
      astNode: statement,
    });
  }
  return lastEvaluated;
}
