export interface SymbolEntity {
  name: string;
  type?: string;
  scopeLevel: number;
}

export interface InsertArgs {
  symbol: SymbolEntity;
}

export interface LookupArgs {
  name: string;
  currentScopeOnly?: boolean;
}

export interface SymbolTable {
  scopeName: string;
  scopeLevel: number;
  parentScope?: SymbolTable;
  symbols: Map<string, SymbolEntity>;
  insert(args: InsertArgs): SymbolEntity;
  lookup(args: LookupArgs): SymbolEntity | undefined;
}

export interface ScopedSymbolTableConstructorArgs {
  scopeName: string;
  scopeLevel: number;
  parentScope?: SymbolTable;
}
