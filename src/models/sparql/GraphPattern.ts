import * as rdfjs from "@rdfjs/types";

type Literal = Omit<rdfjs.Literal, "equals">;
type NamedNode = Omit<rdfjs.NamedNode, "equals">;
type Variable = Omit<rdfjs.Variable, "equals">;

export interface GraphPattern {
  object: Literal | NamedNode | (Variable & { plainLiteral?: boolean });
  optional: boolean;
  predicate: NamedNode | Variable;
  subGraphPatterns?: readonly GraphPattern[]; // For ?label ?license ...
  subject: NamedNode | Variable;
}
