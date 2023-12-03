import { Position } from 'tuffscript/token/types';
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
  InsertVariableSymbolUnlessExistsArgs,
} from './types';

export class Symbol implements SymbolEntity {
  name: string;
  type: SymbolEntityTypes;
  scope: BaseSymbolTable;
  references: References;
  position: Position;

  constructor({ name, type, scope, references, position }: SymbolEntity) {
    this.name = name;
    this.type = type;
    this.scope = scope;
    this.references = references;
    this.position = position;
  }
}

export class SymbolTable implements BaseSymbolTable {
  scopeName: string;
  scopeLevel: number;
  parentScope?: BaseSymbolTable;
  symbols: Map<string, SymbolEntity>;
  references: References;

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

  insertUnlessExists({ symbol }: InsertArgs): SymbolEntity {
    const existingSymbol = this.symbols.get(symbol.name);

    if (existingSymbol) {
      return existingSymbol;
    }

    return this.insert({ symbol });
  }

  insertVariableSymbolUnlessExists({
    name,
    position,
  }: InsertVariableSymbolUnlessExistsArgs): SymbolEntity {
    const newSymbol = new Symbol({
      name,
      type: SymbolEntityTypes.Variable,
      references: [],
      scope: this,
      position: position,
    });
    return this.insertUnlessExists({ symbol: newSymbol });
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
    position,
  }: ResolveReferenceArgs): ResolveReferenceResult {
    const reference: Reference = {
      identifier,
      from: this,
      position,
      resolved: undefined,
    };

    const lookupResult = this.lookup({ name: identifier });
    if (lookupResult) {
      reference.resolved = lookupResult.symbol;
      lookupResult.symbol.references.push(reference);
      this.references.push(reference);
      return reference;
    }
    this.references.push(reference);
    return reference;
  }
}
