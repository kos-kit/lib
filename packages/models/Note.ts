import { Literal, NamedNode } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";

export interface Note {
  readonly literalForm: Literal;
  readonly type: Note.Type;

  equals(other: Note): boolean;
}

export namespace Note {
  function equals(this: Note.Type, other: Note.Type): boolean {
    return this.skosProperty.equals(other.skosProperty);
  }

  export interface Type {
    readonly skosProperty: NamedNode;

    equals(other: Note.Type): boolean;
  }

  export namespace Type {
    export const CHANGE_NOTE: Type = {
      equals,
      skosProperty: skos.changeNote,
    };

    export const DEFINITION: Type = {
      equals,
      skosProperty: skos.definition,
    };

    export const EDITORIAL_NOTE: Type = {
      equals,
      skosProperty: skos.editorialNote,
    };

    export const EXAMPLE: Type = {
      equals,
      skosProperty: skos.example,
    };

    export const HISTORY_NOTE: Type = {
      equals,
      skosProperty: skos.historyNote,
    };

    export const NOTE: Type = {
      equals,
      skosProperty: skos.historyNote,
    };

    export const SCOPE_NOTE: Type = {
      equals,
      skosProperty: skos.scopeNote,
    };
  }

  export const Types: readonly Type[] = [
    Type.CHANGE_NOTE,
    Type.DEFINITION,
    Type.EDITORIAL_NOTE,
    Type.EXAMPLE,
    Type.HISTORY_NOTE,
    Type.NOTE,
    Type.SCOPE_NOTE,
  ];
}
