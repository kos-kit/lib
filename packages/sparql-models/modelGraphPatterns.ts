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
      graphPattern: {
        subject,
        predicate: rdf.type,
        object: {
          termType: "Variable",
          value: `${variablePrefix}Type`,
        },
        type: "Basic",
      },
      type: "Optional",
    },
    {
      graphPattern: {
        subject,
        predicate: dcterms.license,
        object: {
          termType: "Variable",
          value: `${variablePrefix}License`,
        },
        type: "Basic",
      },
      type: "Optional",
    },
    {
      graphPattern: {
        subject,
        predicate: dcterms.modified,
        object: { termType: "Variable", value: `${variablePrefix}Modified` },
        type: "Basic",
      },
      type: "Optional",
    },
    {
      graphPattern: {
        subject,
        predicate: dc11.rights,
        object: {
          termType: "Variable",
          plainLiteral: true,
          value: `${variablePrefix}DcRights`,
        },
        type: "Basic",
      },
      type: "Optional",
    },
    {
      graphPattern: {
        subject,
        predicate: dcterms.rights,
        object: {
          termType: "Variable",
          plainLiteral: true,
          value: `${variablePrefix}DctermsRights`,
        },
        type: "Basic",
      },
      type: "Optional",
    },
    {
      graphPattern: {
        subject,
        predicate: dcterms.rightsHolder,
        object: {
          termType: "Variable",
          plainLiteral: true,
          value: `${variablePrefix}RightsHolder`,
        },
        type: "Basic",
      },
      type: "Optional",
    },
  ];
}
