import * as rdfjs from "@rdfjs/types";
import { PropertyPath } from "./PropertyPath";

type GraphPatternOptions = {
  excludeFromConstruct?: boolean;
  excludeFromWhere?: boolean;
};

export type BasicGraphPattern = {
  // https://www.w3.org/TR/sparql11-query/#BasicGraphPatterns
  // ?s ?p ?o
  readonly object: BasicGraphPattern.Object;
  readonly predicate: BasicGraphPattern.Predicate;
  readonly subject: BasicGraphPattern.Subject;
  readonly type: "Basic";
} & GraphPatternOptions;

export namespace BasicGraphPattern {
  // Omit .equals from RDF/JS types for easier construction.
  export type BlankNode = Omit<rdfjs.BlankNode, "equals">;
  export type Literal = Omit<rdfjs.Literal, "equals">;
  export type NamedNode = Omit<rdfjs.NamedNode, "equals">;

  export type Object =
    | BlankNode
    | Literal
    | NamedNode
    | (Variable & {
        plainLiteral?: boolean;
      });
  export type Predicate =
    | NamedNode
    | { termType: "PropertyPath"; value: PropertyPath }
    | Variable;
  export type Subject = BlankNode | NamedNode | Variable;
  export type Variable = Omit<rdfjs.Variable, "equals">;

  export function variable(value: string): Variable {
    return {
      termType: "Variable",
      value,
    };
  }
}
