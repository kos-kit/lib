import { Literal } from "@rdfjs/types";
import { KosResource, NoteProperty, noteProperties } from "./index.js";

export function notes(
  kosResource: KosResource,
): readonly [NoteProperty, readonly Literal[]][] {
  const getNotePropertyLiterals = (
    noteProperty: NoteProperty,
  ): readonly Literal[] => {
    switch (noteProperty.identifier.value) {
      case "http://www.w3.org/2004/02/skos/core#changeNote":
        return kosResource.changeNote;
      case "http://www.w3.org/2004/02/skos/core#definition":
        return kosResource.definition;
      case "http://www.w3.org/2004/02/skos/core#editorialNote":
        return kosResource.editorialNote;
      case "http://www.w3.org/2004/02/skos/core#example":
        return kosResource.example;
      case "http://www.w3.org/2004/02/skos/core#historyNote":
        return kosResource.historyNote;
      case "http://www.w3.org/2004/02/skos/core#note":
        return kosResource.note;
      case "http://www.w3.org/2004/02/skos/core#scopeNote":
        return kosResource.scopeNote;
    }
  };

  return noteProperties.flatMap((noteProperty) => {
    const literals = getNotePropertyLiterals(noteProperty);
    if (literals.length > 0) {
      return [[noteProperty, literals]];
    }
    return [];
  });
}
