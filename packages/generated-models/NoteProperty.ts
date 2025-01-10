import { NamedNode } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import { iriToTranslationKey } from "./iriToTranslationKey.js";

export class NoteProperty {
  static readonly CHANGE_NOTE = new NoteProperty(skos.changeNote);
  static readonly DEFINITION = new NoteProperty(skos.definition);
  static readonly EDITORIAL_NOTE = new NoteProperty(skos.editorialNote);
  static readonly EXAMPLE = new NoteProperty(skos.example);
  static readonly HISTORY_NOTE = new NoteProperty(skos.historyNote);
  static readonly NOTE = new NoteProperty(skos.note);
  static readonly SCOPE_NOTE = new NoteProperty(skos.scopeNote);

  private constructor(
    readonly identifier: NamedNode<
      | "http://www.w3.org/2004/02/skos/core#changeNote"
      | "http://www.w3.org/2004/02/skos/core#definition"
      | "http://www.w3.org/2004/02/skos/core#editorialNote"
      | "http://www.w3.org/2004/02/skos/core#example"
      | "http://www.w3.org/2004/02/skos/core#historyNote"
      | "http://www.w3.org/2004/02/skos/core#note"
      | "http://www.w3.org/2004/02/skos/core#scopeNote"
    >,
  ) {}

  get translationKey(): string {
    return iriToTranslationKey(this.identifier);
  }
}

export const noteProperties: readonly NoteProperty[] = [
  NoteProperty.CHANGE_NOTE,
  NoteProperty.DEFINITION,
  NoteProperty.EDITORIAL_NOTE,
  NoteProperty.EXAMPLE,
  NoteProperty.HISTORY_NOTE,
  NoteProperty.NOTE,
  NoteProperty.SCOPE_NOTE,
];