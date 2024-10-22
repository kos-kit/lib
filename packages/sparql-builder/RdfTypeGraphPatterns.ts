import { NamedNode } from "@rdfjs/types";
import { rdf, rdfs } from "@tpluscode/rdf-ns-builders";
import { GraphPattern } from "./GraphPattern.js";
import { PropertyPath } from "./PropertyPath.js";
import { ResourceGraphPatterns } from "./ResourceGraphPatterns.js";

/**
 * Graph patterns for the rdf:type of a subject resource.
 */
export class RdfTypeGraphPatterns extends ResourceGraphPatterns {
  readonly constructGraphPatterns: readonly GraphPattern[];
  readonly whereGraphPatterns: readonly GraphPattern[];

  constructor(
    subject: ResourceGraphPatterns.SubjectParameter,
    readonly rdfType: NamedNode,
  ) {
    super(subject);

    // CONSTRUCT ?subject rdf:type ?rdfType
    this.constructGraphPatterns = [
      GraphPattern.basic(
        this.subject,
        rdf.type,
        this.variable("RdfType"),
      ).scoped("CONSTRUCT"),
    ];
    this.add(...this.constructGraphPatterns);

    this.whereGraphPatterns = [
      GraphPattern.basic(
        this.subject,
        {
          termType: "PropertyPath",
          value: PropertyPath.sequence(
            PropertyPath.predicate(rdf.type),
            PropertyPath.zeroOrMore(PropertyPath.predicate(rdfs.subClassOf)),
          ),
        },
        this.rdfType,
      ).scoped("WHERE"),
      // Get the rdf:type in a variable for CONSTRUCT
      GraphPattern.basic(
        this.subject,
        rdf.type,
        this.variable("RdfType"),
      ).scoped("WHERE"),
    ];
    this.add(...this.whereGraphPatterns);
  }

  override toArray(): readonly GraphPattern[] {
    return this.constructGraphPatterns.concat(this.whereGraphPatterns);
  }
}
