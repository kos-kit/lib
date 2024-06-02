import { Literal, NamedNode, Variable } from "@rdfjs/types";

export interface GraphPattern {
  object: Literal | NamedNode | Variable;
  objectOptions?: { plainLiteral?: boolean };
  optional: boolean;
  predicate: NamedNode | Variable;
  subject: NamedNode | Variable;
  subGraphPatterns?: readonly GraphPattern[]; // For ?label ?license ...
}
