import { rdf } from "@tpluscode/rdf-ns-builders";
import { GraphPattern } from "./GraphPattern.js";
import { PropertyPath } from "./PropertyPath.js";
import { ResourceGraphPatterns } from "./ResourceGraphPatterns.js";

/**
 * Graph patterns for an RDF list
 * https://www.w3.org/TR/rdf-schema/#ch_collectionvocab
 */
export class RdfListGraphPatterns extends ResourceGraphPatterns {
  constructor({
    itemGraphPatterns,
    rdfList,
  }: {
    itemGraphPatterns?: (
      itemVariable: GraphPattern.Variable,
    ) => Iterable<GraphPattern>;
    rdfList: ResourceGraphPatterns.Subject;
  }) {
    super(rdfList);

    // ?list rdf:first ?item0
    const item0Variable = this.variable("Item0");
    this.add(GraphPattern.basic(this.subject, rdf.first, item0Variable));
    if (itemGraphPatterns) {
      this.add(...itemGraphPatterns(item0Variable));
    }

    // ?list rdf:rest ?rest0
    this.add(
      GraphPattern.basic(this.subject, rdf.rest, this.variable("Rest0")),
    );

    const optionalGraphPatterns: GraphPattern[] = [];
    // ?list rdf:rest+ ?restN
    const restNVariable = this.variable("RestN");
    optionalGraphPatterns.push(
      GraphPattern.basic(
        this.subject,
        {
          termType: "PropertyPath",
          value: PropertyPath.oneOrMore(PropertyPath.predicate(rdf.rest)),
        },
        restNVariable,
      ).scoped("WHERE"),
    );

    // ?rest rdf:first ?itemN
    const itemNVariable = this.variable("ItemN");
    optionalGraphPatterns.push(
      GraphPattern.basic(restNVariable, rdf.first, itemNVariable),
    );
    if (itemGraphPatterns) {
      optionalGraphPatterns.push(...itemGraphPatterns(itemNVariable));
    }

    // ?restN rdf:rest ?restNBasic to get the rdf:rest statement in the CONSTRUCT
    optionalGraphPatterns.push(
      GraphPattern.basic(restNVariable, rdf.rest, this.variable("RestNBasic")),
    );

    this.add(GraphPattern.optional(GraphPattern.group(optionalGraphPatterns)));
  }

  override *[Symbol.iterator](): Iterator<GraphPattern> {}
}
