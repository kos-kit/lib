import { BasicGraphPattern, GraphPattern } from "./GraphPattern.js";

export abstract class GraphPatterns implements Iterable<GraphPattern> {
  protected readonly subject: GraphPatterns.Subject;
  protected readonly variablePrefix: string;

  constructor(subject: GraphPatterns.Subject) {
    this.subject = subject;
    if (subject.termType === "Variable") {
      this.variablePrefix = subject.value;
    } else {
      this.variablePrefix = subject.variablePrefix;
    }
  }

  abstract [Symbol.iterator](): Iterator<GraphPattern>;
}

export namespace GraphPatterns {
  export type Subject =
    | BasicGraphPattern.Variable
    | ((BasicGraphPattern.BlankNode | BasicGraphPattern.NamedNode) & {
        variablePrefix: string;
      });
}
