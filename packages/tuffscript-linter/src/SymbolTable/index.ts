import {
  SymbolEntity,
  SymbolEntityTypes,
  References,
  InsertArgs,
  LookupArgs,
  LookupResult,
  Reference,
  ResolveReferenceArgs,
  ResolveReferenceResult,
  BaseSymbolTableProperties,
  BaseSymbolTable,
} from './types';

export class Symbol implements SymbolEntity {
  name: string;
  type: SymbolEntityTypes;
  scope: BaseSymbolTable;
  references: References;

  constructor({ name, type, scope, references }: SymbolEntity) {
    this.name = name;
    this.type = type;
    this.scope = scope;
    this.references = references;
  }
}

export class SymbolTable implements BaseSymbolTable {
  scopeName: string;
  scopeLevel: number;
  parentScope?: BaseSymbolTable;
  symbols: Map<string, SymbolEntity>;
  references: Map<string, Reference>;

  constructor({
    scopeName,
    scopeLevel,
    parentScope,
    symbols,
    references,
  }: BaseSymbolTableProperties) {
    this.scopeName = scopeName;
    this.scopeLevel = scopeLevel;
    this.parentScope = parentScope;
    this.symbols = symbols;
    this.references = references;
  }

  insert({ symbol }: InsertArgs): SymbolEntity {
    this.symbols.set(symbol.name, symbol);
    return symbol;
  }

  lookup({ name, currentScopeOnly = false }: LookupArgs): LookupResult {
    const symbol = this.symbols.get(name);

    if (symbol)
      return {
        symbol,
        scope: this,
      };

    if (currentScopeOnly) return;

    if (this.parentScope) {
      return this.parentScope.lookup({ name });
    }
  }

  resolveReference({
    identifier,
  }: ResolveReferenceArgs): ResolveReferenceResult {
    const reference: Reference = {
      identifier,
      from: this,
      resolved: undefined,
    };

    const lookupResult = this.lookup({ name: identifier });
    if (lookupResult) {
      reference.resolved = lookupResult.symbol;
      lookupResult.symbol.references.push(reference);
      this.references.set(identifier, reference);
      return reference;
    }
    this.references.set(identifier, reference);
    return reference;
  }
}
