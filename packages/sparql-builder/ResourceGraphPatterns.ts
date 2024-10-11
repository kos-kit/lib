import { BasicGraphPattern, GraphPattern } from "./GraphPattern.js";
import { GraphPatterns } from "./GraphPatterns.js";

export abstract class ResourceGraphPatterns extends GraphPatterns {
  readonly subject: ResourceGraphPatterns.Subject;
  private readonly variablePrefix: string;

  constructor(subject: ResourceGraphPatterns.SubjectParameter) {
    super();
    if (typeof subject === "string") {
      this.subject = GraphPattern.variable(subject);
      this.variablePrefix = subject;
    } else {
      this.subject = subject;
      if (subject.termType === "Variable") {
        this.variablePrefix = subject.value;
      } else {
        this.variablePrefix = subject.variablePrefix;
      }
    }
  }

  abstract [Symbol.iterator](): Iterator<GraphPattern>;

  protected variable(suffix: string): GraphPattern.Variable {
    return GraphPattern.variable(this.variablePrefix + suffix);
  }
}

export namespace ResourceGraphPatterns {
  export type Subject =
    | GraphPattern.Variable
    | ((BasicGraphPattern.BlankNode | BasicGraphPattern.NamedNode) & {
        variablePrefix: string;
      });

  export type SubjectParameter = Subject | string;
}
