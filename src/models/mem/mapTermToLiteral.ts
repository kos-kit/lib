import { Literal, Term } from "@rdfjs/types";

export const mapTermToLiteral = (term: Term): Literal | null =>
  term.termType === "Literal" ? term : null;
