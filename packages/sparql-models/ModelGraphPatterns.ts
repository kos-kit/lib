import { dc11, dcterms, rdf } from "@tpluscode/rdf-ns-builders";
import { GraphPattern } from "./GraphPattern.js";
import { GraphPatterns } from "./GraphPatterns.js";

export class ModelGraphPatterns extends GraphPatterns {
  *[Symbol.iterator](): Iterator<GraphPattern> {
    yield GraphPattern.optional(
      GraphPattern.basic(this.subject, rdf.type, {
        termType: "Variable",
        value: `${this.variablePrefix}Type`,
      }),
    );

    yield GraphPattern.optional(
      GraphPattern.basic(this.subject, dcterms.license, {
        termType: "Variable",
        value: `${this.variablePrefix}License`,
      }),
    );

    yield GraphPattern.optional(
      GraphPattern.basic(this.subject, dcterms.modified, {
        termType: "Variable",
        value: `${this.variablePrefix}Modified`,
      }),
    );

    yield GraphPattern.optional(
      GraphPattern.basic(this.subject, dc11.rights, {
        termType: "Variable",
        plainLiteral: true,
        value: `${this.variablePrefix}DcRights`,
      }),
    );

    yield GraphPattern.optional(
      GraphPattern.basic(this.subject, dcterms.rights, {
        termType: "Variable",
        plainLiteral: true,
        value: `${this.variablePrefix}DctermsRights`,
      }),
    );

    yield GraphPattern.optional(
      GraphPattern.basic(this.subject, dcterms.rightsHolder, {
        termType: "Variable",
        plainLiteral: true,
        value: `${this.variablePrefix}RightsHolder`,
      }),
    );
  }
}
