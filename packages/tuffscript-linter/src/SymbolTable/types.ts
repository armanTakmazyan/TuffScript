import { SymbolTable } from '.';

export enum SymbolEntityTypes {
  Variable = 'Variable',
}

export interface SymbolEntity {
  name: string;
  type: SymbolEntityTypes;
  /**
   * Reference to the enclosing Scope
   * @type {BaseSymbolTable}
   */
  scope: BaseSymbolTable;
  /**
   * Contains all occurrences where this symbol is referenced throughout the code.
   * This includes all usages of the symbol, excluding the original declaration.
   * Each reference provides context about how and where the symbol is used.
   * @type {References}
   */
  references: References;
}

export type SymbolEntities = SymbolEntity[];

// TODO: Think about whether the identifier should be an AST node - Identifier.
// Also, think about using an array for references.
// Additionally, consider the read and write modes of these references.

/**
 * Represents a single occurrence of an identifier in code
 * @interface Reference
 */
export interface Reference {
  /**
   * Identifier string for the syntax node
   * @type {string}
   */
  identifier: string;

  /**
   * Reference to the enclosing SymbolTable
   * @type {SymbolTable}
   */
  from: SymbolTable;

  /**
   * The Symbol this reference is resolved with, if any
   * @type {SymbolEntity}
   */
  resolved?: SymbolEntity;

  /**
   * The read-write mode of the reference.
   * Values are one of Reference.READ, Reference.RW, Reference.WRITE
   * @type {number}
   */
  flag?: number;
}

export type References = Reference[];

export interface InsertArgs {
  symbol: SymbolEntity;
}

export interface LookupArgs {
  name: string;
  currentScopeOnly?: boolean;
}

export interface SymbolLookup {
  symbol: SymbolEntity;
  scope: SymbolTable;
}

export type LookupResult = SymbolLookup | undefined;

export interface ResolveReferenceArgs {
  identifier: string;
}

export type ResolveReferenceResult = Reference | undefined;

export enum SymbolTableScopeNames {
  Global = 'Global',
}

export interface BaseSymbolTableProperties {
  scopeName: string;
  scopeLevel: number;
  parentScope?: BaseSymbolTable;
  /**
   * A map storing all declared symbols within the current scope
   * @type {Map<string, SymbolEntity>}
   */
  symbols: Map<string, SymbolEntity>;

  /**
   * A map storing all references to identifiers
   * @type {Map<string, References>}
   */
  references: Map<string, Reference>;
}

export interface BaseSymbolTable extends BaseSymbolTableProperties {
  insert(args: InsertArgs): SymbolEntity;
  lookup(args: LookupArgs): LookupResult;
  resolveReference(args: ResolveReferenceArgs): ResolveReferenceResult;
}
