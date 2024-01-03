import { TuffScriptErrorPosition, TuffScriptErrorProperties } from './types';

export class TuffScriptError extends Error {
  errorCode?: number;
  position: TuffScriptErrorPosition;

  constructor({
    name,
    message,
    position,
    errorCode,
  }: TuffScriptErrorProperties) {
    super(message);
    this.name = name ?? 'TuffScriptError';
    this.errorCode = errorCode; // Use a code to identify the type of error
    this.position = position;
  }
}
