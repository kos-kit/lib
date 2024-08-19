import { GraphPattern, GraphPatternSubject } from "./GraphPattern.js";
import { labeledModelGraphPatterns } from "./labeledModelGraphPatterns.js";

export function conceptSchemeGraphPatterns(kwds: {
  subject: GraphPatternSubject;
  variablePrefix: string;
}): readonly GraphPattern[] {
  return labeledModelGraphPatterns(kwds);
}
