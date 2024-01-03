export interface TuffScriptErrorPosition {
  start: number;
  end?: number;
}

export interface TuffScriptErrorProperties {
  message: string;
  name?: string;
  errorCode?: number;
  position: TuffScriptErrorPosition;
}
