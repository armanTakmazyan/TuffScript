import promptSyncConfig from 'prompt-sync';
import {
  createUnassigned,
  createNil,
  createNumber,
  createString,
  createNativeFunction,
} from '../factories';
import { ExpressionNodeType } from '../../frontend/ast/types';
import { globalFunctionNames } from '../constants/globalFunctionNames';
import { RuntimeValue, Values } from '../values/types';
import { SetupExecutionContext, CreateGlobalEnvironmentArgs } from './types';
import { Environment } from './index';

const promptSync = promptSyncConfig();

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
    name: globalFunctionNames.exit,
    value: createNativeFunction({
      execute: ([exitNumber]) => {
        const exitNumberValue =
          !exitNumber || exitNumber.type !== Values.Number
            ? 0
            : exitNumber.value;

        return process.exit(exitNumberValue);
      },
    }),
  });

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
    name: globalFunctionNames.prompt,
    value: createNativeFunction({
      execute: ([option]) => {
        if (option.type === Values.String) {
          const result = promptSync(option.value);
          return createString({ stringValue: result });
        }
        throw new Error(
          `Invalid argument type for "${globalFunctionNames.prompt}" function: Expected a string, received ${option.type}`,
        );
      },
    }),
  });

  globalEnvironment.createConstant({
    name: globalFunctionNames.time,
    value: createNativeFunction({
      execute: () => createNumber({ numberValue: Date.now() }),
    }),
  });

  globalEnvironment.createConstant({
    name: globalFunctionNames.take,
    value: createNativeFunction({
      execute: ([list, number]) => {
        if (list.type === Values.String && number.type === Values.Number) {
          return createString({ stringValue: list.value[number.value] });
        }
        throw new Error(
          `Invalid argument types: "${globalFunctionNames.take}" function expects a number and a string. Received ${number.type} and ${list.type} instead`,
        );
      },
    }),
  });

  globalEnvironment.createConstant({
    name: globalFunctionNames.len,
    value: createNativeFunction({
      execute: ([element]) => {
        if (element.type == Values.String) {
          return createNumber({ numberValue: element.value.length });
        }

        if (element.type === Values.Object) {
          createNumber({ numberValue: element.properties.size });
        }

        throw new Error(
          `Invalid argument type: ${globalFunctionNames.len} function expects a string or an object. Received ${element.type} instead`,
        );
      },
    }),
  });

  globalEnvironment.createConstant({
    name: globalFunctionNames.slice,
    value: createNativeFunction({
      execute: ([string, start, end]) => {
        if (
          string.type === Values.String &&
          start.type === Values.Number &&
          (!end || end.type === Values.Number)
        ) {
          return createString({
            stringValue: string.value.slice(
              start.value,
              end ? end.value : undefined,
            ),
          });
        }

        throw new Error(
          `Invalid argument types for ${
            globalFunctionNames.slice
          } function: Expected (string, number, number), received (${
            string.type
          }, ${start.type}, ${end ? end.type : 'Nil'})`,
        );
      },
    }),
  });

  globalEnvironment.createConstant({
    name: globalFunctionNames.charCodeAt,
    value: createNativeFunction({
      execute: ([character, index]) => {
        if (character.type === Values.String) {
          return createNumber({
            numberValue: character.value.charCodeAt(
              index.type === Values.Number ? index.value : 0,
            ),
          });
        }

        throw new Error(
          `Invalid argument type for "${globalFunctionNames.charCodeAt}" function: Expected a string, received ${character.type}`,
        );
      },
    }),
  });

  globalEnvironment.createConstant({
    name: globalFunctionNames.fromCharCode,
    value: createNativeFunction({
      execute: ([code]) =>
        createString({
          stringValue: String.fromCharCode(
            code.type === Values.Number ? code.value : +code,
          ),
        }),
    }),
  });

  setupExecutionContext({
    environment: globalEnvironment,
    expressions: program.body,
  });

  return globalEnvironment;
};
