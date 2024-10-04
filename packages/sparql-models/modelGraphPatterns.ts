import { dc11, dcterms, rdf } from "@tpluscode/rdf-ns-builders";
import { BasicGraphPattern, GraphPattern } from "./GraphPattern.js";

export function modelGraphPatterns({
  subject,
  variablePrefix,
}: {
  subject: BasicGraphPattern.Subject;
  variablePrefix: string;
}): readonly GraphPattern[] {
  return [
    GraphPattern.optional(
      GraphPattern.basic(subject, rdf.type, {
        termType: "Variable",
        value: `${variablePrefix}Type`,
      }),
    ),
    GraphPattern.optional(
      GraphPattern.basic(subject, dcterms.license, {
        termType: "Variable",
        value: `${variablePrefix}License`,
      }),
    ),
    GraphPattern.optional(
      GraphPattern.basic(subject, dcterms.modified, {
        termType: "Variable",
        value: `${variablePrefix}Modified`,
      }),
    ),
    GraphPattern.optional(
      GraphPattern.basic(subject, dc11.rights, {
        termType: "Variable",
        plainLiteral: true,
        value: `${variablePrefix}DcRights`,
      }),
    ),
    GraphPattern.optional(
      GraphPattern.basic(subject, dcterms.rights, {
        termType: "Variable",
        plainLiteral: true,
        value: `${variablePrefix}DctermsRights`,
      }),
    ),
    GraphPattern.optional(
      GraphPattern.basic(subject, dcterms.rightsHolder, {
        termType: "Variable",
        plainLiteral: true,
        value: `${variablePrefix}RightsHolder`,
      }),
    ),
  ];
}
