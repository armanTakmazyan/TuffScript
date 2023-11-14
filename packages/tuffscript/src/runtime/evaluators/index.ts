import { ExpressionNodeType } from '../../frontend/ast/types';
import { createNil } from '../values/factories';
import { RuntimeValue } from '../values/types';
import { evaluateFunctionDeclaration } from './evaluateFunctionDeclaration';
import { evaluateAssignment } from './evaluateAssignment';
import { evaluateIfExpression } from './evaluateIfExpression';
import { evaluateBinaryExpression } from './binaryExpressionsEvaluators';
import { evaluateObjectExpression } from './evaluateObjectExpression';
import { evaluateMemberExpression } from './evaluateMemberExpression';
import { evaluateCallExpression } from './evaluateCallExpression';
import { evaluateUnaryExpression } from './evaluateUnaryExpressions';
import {
  evaluateNil,
  evaluateFalseLiteral,
  evaluateTrueLiteral,
  evaluateNumber,
  evaluateString,
  evaluateIdentifier,
} from './primitiveTypesEvaluators';
import { EvaluateArgs, EvaluateProgramArgs } from './types';

export function evaluate({ astNode, environment }: EvaluateArgs): RuntimeValue {
  switch (astNode.type) {
    case ExpressionNodeType.AssignmentExpression: {
      return evaluateAssignment({ assignment: astNode, environment });
    }
    case ExpressionNodeType.IfExpression: {
      return evaluateIfExpression({
        environment,
        ifExpression: astNode,
      });
    }
    case ExpressionNodeType.FunctionDeclaration: {
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
  for (const expression of program.body) {
    lastEvaluated = evaluate({
      environment,
      astNode: expression,
    });
  }
  return lastEvaluated;
}
