import { dc11, dcterms, rdf } from "@tpluscode/rdf-ns-builders";
import { GraphPattern } from "./GraphPattern.js";
import { ResourceGraphPatterns } from "./ResourceGraphPatterns.js";

export namespace Model {
  export class GraphPatterns extends ResourceGraphPatterns {
    *[Symbol.iterator](): Iterator<GraphPattern> {
      yield GraphPattern.optional(
        GraphPattern.basic(this.subject, rdf.type, this.variable("Type")),
      );

      yield GraphPattern.optional(
        GraphPattern.basic(
          this.subject,
          dcterms.license,
          this.variable("License"),
        ),
      );

      yield GraphPattern.optional(
        GraphPattern.basic(
          this.subject,
          dcterms.modified,
          this.variable("Modified"),
        ),
      );

      yield GraphPattern.optional(
        GraphPattern.basic(this.subject, dc11.rights, {
          ...this.variable("DcRights"),
          plainLiteral: true,
        }),
      );

      yield GraphPattern.optional(
        GraphPattern.basic(this.subject, dcterms.rights, {
          ...this.variable("DctermsRights"),
          plainLiteral: true,
        }),
      );

      yield GraphPattern.optional(
        GraphPattern.basic(this.subject, dcterms.rightsHolder, {
          ...this.variable("RightsHolder"),
          plainLiteral: true,
        }),
      );
    }
  }
}
