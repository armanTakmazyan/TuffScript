import {
  createNil,
  createBoolean,
  createNumber,
  createNativeFunction,
} from '../values/factories';
import { Environment } from './index';

export const createGlobalEnviornment = (): Environment => {
  const env = new Environment();
  // Create Default Global Enviornment
  env.createConstant({ name: 'true', value: createBoolean(true) });
  env.createConstant({ name: 'false', value: createBoolean(false) });
  env.createConstant({ name: 'null', value: createNil() });

  // Define a native builtin method
  env.createConstant({
    name: 'print',
    value: createNativeFunction((args: any) => {
      console.log(...args);
      return createNil();
    }),
  });

  function timeFunction() {
    return createNumber(Date.now());
  }

  env.createConstant({
    name: 'time',
    value: createNativeFunction(timeFunction),
  });

  return env;
};
