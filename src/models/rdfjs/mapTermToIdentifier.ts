import { Term } from "@rdfjs/types";
import { Identifier } from "../Identifier";

export const mapTermToIdentifier = (term: Term): Identifier | null => {
  switch (term.termType) {
    case "BlankNode":
    case "NamedNode":
      return term;
    default:
      return null;
  }
};
