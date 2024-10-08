import { rdf, rdfs } from "@tpluscode/rdf-ns-builders";
import { BasicGraphPattern, GraphPattern } from "./GraphPattern";
import { GraphPatterns } from "./GraphPatterns";
import { PropertyPath } from "./PropertyPath";

/**
 * Graph patterns for the rdf:type of a subject resource.
 */
export class RdfTypeGraphPatterns extends GraphPatterns {
  constructor(
    readonly subject: BasicGraphPattern.Subject,
    readonly rdfType: BasicGraphPattern.NamedNode,
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
    );
  }

  override *[Symbol.iterator](): Iterator<GraphPattern> {
    yield this.constructGraphPattern;
    yield this.whereGraphPattern;
  }
}
