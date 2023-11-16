import { createNil, createNumber, createNativeFunction } from '../factories';
import { globalFunctionNames } from '../constants/globalFunctionNames';
import { RuntimeValue } from '../values/types';
import { Environment } from './index';

// Initializes a global environment with built-in constants and native functions such
export const createGlobalEnviornment = (): Environment => {
  const env = new Environment();

  env.createConstant({
    name: globalFunctionNames.print,
    value: createNativeFunction({
      execute: (args: RuntimeValue[]) => {
        console.log(...args);
        return createNil();
      },
    }),
  });

  env.createConstant({
    name: globalFunctionNames.time,
    value: createNativeFunction({
      execute: () => createNumber({ numberValue: Date.now() }),
    }),
  });

  return env;
};
