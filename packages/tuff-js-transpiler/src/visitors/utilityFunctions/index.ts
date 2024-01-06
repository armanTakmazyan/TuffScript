import { createPromptSyncFunction } from './prompt';
import { createTakeFunction } from './take';
import { createLenFunction } from './len';
import { createTuffScriptSliceFunction } from './tuffScriptSlice';
import { createTuffScriptCharCodeFunction } from './tuffScriptCharCode';

const mainUtilities = [
  createTakeFunction(),
  createLenFunction(),
  createTuffScriptSliceFunction(),
  createTuffScriptCharCodeFunction(),
];

export const utilityFunctions = {
  web: [...mainUtilities],
  node: [createPromptSyncFunction(), ...mainUtilities],
};
