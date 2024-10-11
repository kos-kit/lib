import { NamedNode } from "@rdfjs/types";
import { rdf, rdfs } from "@tpluscode/rdf-ns-builders";
import { GraphPattern } from "./GraphPattern.js";
import { PropertyPath } from "./PropertyPath.js";
import { ResourceGraphPatterns } from "./ResourceGraphPatterns";

/**
 * Graph patterns for the rdf:type of a subject resource.
 */
export class RdfTypeGraphPatterns extends ResourceGraphPatterns {
  constructor(
    subject: ResourceGraphPatterns.SubjectParameter,
    readonly rdfType: NamedNode,
  ) {
    super(subject);
  }

  override *[Symbol.iterator](): Iterator<GraphPattern> {
    yield* this.constructGraphPatterns();
    yield* this.whereGraphPatterns();
  }

  /**
   * CONSTRUCT ?subject rdf:type ?rdfType
   */
  *constructGraphPatterns(): Iterable<GraphPattern> {
    yield GraphPattern.basic(
      this.subject,
      rdf.type,
      this.variable("RdfType"),
    ).scoped("CONSTRUCT");
  }

  /**
   * WHERE ?subject rdf:type/rdfs:subClassOf* ?rdfType
   */
  *whereGraphPatterns(): Iterable<GraphPattern> {
    // Match the expected rdf:type or a subClassOf it
    yield GraphPattern.basic(
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

    // Get the rdf:type in a variable for CONSTRUCT
    yield GraphPattern.basic(
      this.subject,
      rdf.type,
      this.variable("RdfType"),
    ).scoped("WHERE");
  }
}
