import {
  createNil,
  createNumber,
  createNativeFunction,
} from '../values/factories';
import { globalFunctionNames } from '../constants/globalFunctionNames';
import { Environment } from './index';

/**
 * Creates and returns a global environment with predefined constants.
 * This environment includes built-in native functions like 'print' and 'time'.
 */
export const createGlobalEnviornment = (): Environment => {
  const env = new Environment();

  env.createConstant({
    name: globalFunctionNames.print,
    value: createNativeFunction((args: any) => {
      console.log(...args);
      return createNil();
    }),
  });

  env.createConstant({
    name: globalFunctionNames.time,
    value: createNativeFunction(() => createNumber(Date.now())),
  });

  return env;
};
