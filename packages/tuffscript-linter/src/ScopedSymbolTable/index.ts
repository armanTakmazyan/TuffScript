import {
  SymbolEntity,
  SymbolTable,
  LookupArgs,
  InsertArgs,
  ScopedSymbolTableConstructorArgs,
} from './types';

export class Symbol implements SymbolEntity {
  name: string;
  type?: string;
  scopeLevel: number;

  constructor({
    name,
    type,
    scopeLevel = 0,
  }: {
    name: string;
    type?: string;
    scopeLevel?: number;
  }) {
    this.name = name;
    this.type = type;
    this.scopeLevel = scopeLevel;
  }
}

export class ScopedSymbolTable implements SymbolTable {
  scopeName: string;
  scopeLevel: number;
  parentScope?: SymbolTable;
  symbols: Map<string, SymbolEntity>;

  constructor({
    scopeName,
    scopeLevel,
    parentScope,
  }: ScopedSymbolTableConstructorArgs) {
    this.scopeName = scopeName;
    this.scopeLevel = scopeLevel;
    this.parentScope = parentScope;
    this.symbols = new Map<string, SymbolEntity>();
  }

  insert({ symbol }: InsertArgs): SymbolEntity {
    symbol.scopeLevel = this.scopeLevel;
    this.symbols.set(symbol.name, symbol);
    return symbol;
  }

  lookup({
    name,
    currentScopeOnly = false,
  }: LookupArgs): SymbolEntity | undefined {
    const symbol = this.symbols.get(name);

    if (symbol) return symbol;

    if (currentScopeOnly) return;

    if (this.parentScope) {
      return this.parentScope.lookup({ name });
    }
  }
}
