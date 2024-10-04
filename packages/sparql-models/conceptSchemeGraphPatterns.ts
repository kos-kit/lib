import { BasicGraphPattern, GraphPattern } from "./GraphPattern.js";
import { labeledModelGraphPatterns } from "./labeledModelGraphPatterns.js";

export function conceptSchemeGraphPatterns(kwds: {
  subject: BasicGraphPattern.Subject;
  variablePrefix: string;
}): readonly GraphPattern[] {
  return labeledModelGraphPatterns(kwds);
}
