import { dc11, dcterms, rdf } from "@tpluscode/rdf-ns-builders";
import { GraphPattern, GraphPatternSubject } from "./GraphPattern.js";

export function modelGraphPatterns({
  subject,
  variablePrefix,
}: {
  subject: GraphPatternSubject;
  variablePrefix: string;
}): readonly GraphPattern[] {
  return [
    {
      subject,
      predicate: rdf.type,
      object: {
        termType: "Variable",
        value: `${variablePrefix}Type`,
      },
      optional: true,
    },
    {
      subject,
      predicate: dcterms.license,
      object: {
        termType: "Variable",
        value: `${variablePrefix}License`,
      },
      optional: true,
    },
    {
      subject,
      predicate: dcterms.modified,
      object: { termType: "Variable", value: `${variablePrefix}Modified` },
      optional: true,
    },
    {
      subject,
      predicate: dc11.rights,
      object: {
        termType: "Variable",
        plainLiteral: true,
        value: `${variablePrefix}DcRights`,
      },
      optional: true,
    },
    {
      subject,
      predicate: dcterms.rights,
      object: {
        termType: "Variable",
        plainLiteral: true,
        value: `${variablePrefix}DctermsRights`,
      },
      optional: true,
    },
    {
      subject,
      predicate: dcterms.rightsHolder,
      object: {
        termType: "Variable",
        plainLiteral: true,
        value: `${variablePrefix}RightsHolder`,
      },
      optional: true,
    },
  ];
}
