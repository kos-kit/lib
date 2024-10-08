import * as rdfjs from "@rdfjs/types";

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
  export type PropertyPath = { termType: "PropertyPath" } & (
    | {
        readonly propertyPathType: "PredicatePath";
        readonly value: NamedNode;
      }
    | {
        readonly propertyPathType: "SequencePath";
        readonly value: readonly PropertyPath[];
      }
    | {
        readonly propertyPathType: "ZeroOrMorePath";
        readonly value: PropertyPath;
      }
  );

  export type Object =
    | BlankNode
    | Literal
    | NamedNode
    | (Variable & {
        plainLiteral?: boolean;
      });
  export type Predicate = NamedNode | PropertyPath | Variable;
  export type Subject = BlankNode | NamedNode | Variable;
  export type Variable = Omit<rdfjs.Variable, "equals">;

  export function variable(value: string): Variable {
    return {
      termType: "Variable",
      value,
    };
  }
}
