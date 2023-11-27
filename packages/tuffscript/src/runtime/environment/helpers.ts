import {
  createUnassigned,
  createNil,
  createNumber,
  createNativeFunction,
} from '../factories';
import { ExpressionNodeType } from '../../frontend/ast/types';
import { globalFunctionNames } from '../constants/globalFunctionNames';
import { RuntimeValue } from '../values/types';
import { SetupExecutionContext, CreateGlobalEnvironmentArgs } from './types';
import { Environment } from './index';

export const setupExecutionContext: SetupExecutionContext = ({
  environment,
  expressions,
}) => {
  expressions.forEach(expression => {
    switch (expression.type) {
      case ExpressionNodeType.AssignmentExpression: {
        if (expression.assignee.type === ExpressionNodeType.Identifier) {
          environment.setVariableValue({
            name: expression.assignee.symbol,
            value: createUnassigned(),
          });
        }
        // Other assignment types are not considered, as they don't introduce new variables in the current scope
        break;
      }
      case ExpressionNodeType.FunctionDeclaration: {
        environment.setVariableValue({
          name: expression.name.symbol,
          value: createUnassigned(),
        });
        break;
      }
      case ExpressionNodeType.IfExpression: {
        setupExecutionContext({
          environment,
          expressions: expression.thenBody,
        });
        setupExecutionContext({
          environment,
          expressions: expression.elseBody,
        });
        break;
      }
      default: {
        // Placeholder for handling other expression types, if needed in the future
      }
    }
  });

  return environment;
};

// Initializes a global environment with built-in constants and native functions
export const createGlobalEnvironment = ({
  program,
}: CreateGlobalEnvironmentArgs): Environment => {
  const globalEnvironment = new Environment();

  globalEnvironment.createConstant({
    name: globalFunctionNames.print,
    value: createNativeFunction({
      execute: (args: RuntimeValue[]) => {
        console.log(...args);
        return createNil();
      },
    }),
  });

  globalEnvironment.createConstant({
    name: globalFunctionNames.time,
    value: createNativeFunction({
      execute: () => createNumber({ numberValue: Date.now() }),
    }),
  });

  setupExecutionContext({
    environment: globalEnvironment,
    expressions: program.body,
  });

  return globalEnvironment;
};
