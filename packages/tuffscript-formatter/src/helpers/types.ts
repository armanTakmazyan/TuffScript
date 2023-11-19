export interface CreateIndentationArgs {
  indentationLevel: number;
}

export type CreateIndentation = (args: CreateIndentationArgs) => string;
