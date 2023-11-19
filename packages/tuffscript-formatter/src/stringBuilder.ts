interface AppendArgs {
  value: string;
}

export class StringBuilder {
  strings: string[];
  constructor() {
    this.strings = [];
  }

  append({ value }: AppendArgs): string[] {
    this.strings.push(value);
    return this.strings;
  }

  toString(): string {
    return this.strings.join('');
  }
}
