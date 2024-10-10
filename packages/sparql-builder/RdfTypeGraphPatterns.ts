import { NamedNode } from "@rdfjs/types";
import { rdf, rdfs } from "@tpluscode/rdf-ns-builders";
import { BasicGraphPattern, GraphPattern } from "./GraphPattern.js";
import { GraphPatterns } from "./GraphPatterns.js";
import { PropertyPath } from "./PropertyPath.js";

/**
 * Graph patterns for the rdf:type of a subject resource.
 */
export class RdfTypeGraphPatterns extends GraphPatterns {
  constructor(
    readonly subject: BasicGraphPattern.Subject,
    readonly rdfType: NamedNode,
  ) {
    super();
  }

  /**
   * CONSTRUCT ?subject rdf:type ?rdfType
   */
  get constructGraphPattern(): GraphPattern {
    return GraphPattern.basic(this.subject, rdf.type, this.rdfType).scoped(
      "CONSTRUCT",
    );
  }

  /**
   * WHERE ?subject rdf:type/rdfs:subClassOf* ?rdfType
   */
  get whereGraphPattern(): GraphPattern {
    return GraphPattern.basic(
      this.subject,
      {
        termType: "PropertyPath",
        value: PropertyPath.sequence(
          PropertyPath.predicate(rdf.type),
          PropertyPath.zeroOrMore(PropertyPath.predicate(rdfs.subClassOf)),
        ),
      },
      this.rdfType,
    ).scoped("WHERE");
  }

  override *[Symbol.iterator](): Iterator<GraphPattern> {
    yield this.constructGraphPattern;
    yield this.whereGraphPattern;
  }
}
