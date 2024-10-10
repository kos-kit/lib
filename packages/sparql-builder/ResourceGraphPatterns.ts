import { BasicGraphPattern, GraphPattern } from "./GraphPattern.js";
import { GraphPatterns } from "./GraphPatterns.js";

export abstract class ResourceGraphPatterns extends GraphPatterns {
  readonly subject: ResourceGraphPatterns.Subject;
  protected readonly variablePrefix: string;

  constructor(subject: ResourceGraphPatterns.Subject) {
    super();
    this.subject = subject;
    if (subject.termType === "Variable") {
      this.variablePrefix = subject.value;
    } else {
      this.variablePrefix = subject.variablePrefix;
    }
  }

  abstract [Symbol.iterator](): Iterator<GraphPattern>;

  protected variable(suffix: string): BasicGraphPattern.Variable {
    return BasicGraphPattern.variable(this.variablePrefix + suffix);
  }
}

export namespace ResourceGraphPatterns {
  export type Subject =
    | BasicGraphPattern.Variable
    | ((BasicGraphPattern.BlankNode | BasicGraphPattern.NamedNode) & {
        variablePrefix: string;
      });
}
