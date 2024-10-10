import { rdf } from "@tpluscode/rdf-ns-builders";
import { GraphPattern } from "./GraphPattern";
import { PropertyPath } from "./PropertyPath";
import { ResourceGraphPatterns } from "./ResourceGraphPatterns";

/**
 * Graph patterns for an RDF list
 * https://www.w3.org/TR/rdf-schema/#ch_collectionvocab
 */
export class RdfListGraphPatterns extends ResourceGraphPatterns {
  private readonly itemGraphPatterns?: (
    itemVariable: GraphPattern.Variable,
  ) => Iterable<GraphPattern>;

  constructor({
    itemGraphPatterns,
    rdfList,
  }: {
    itemGraphPatterns?: RdfListGraphPatterns["itemGraphPatterns"];
    rdfList: ResourceGraphPatterns.Subject;
  }) {
    super(rdfList);
    this.itemGraphPatterns = itemGraphPatterns;
  }

  override *[Symbol.iterator](): Iterator<GraphPattern> {
    // ?list rdf:first ?item0
    const item0Variable = this.variable("Item0");
    yield GraphPattern.basic(this.subject, rdf.first, item0Variable);
    if (this.itemGraphPatterns) {
      yield* this.itemGraphPatterns(item0Variable);
    }

    // ?list rdf:rest ?rest0
    yield GraphPattern.basic(this.subject, rdf.rest, this.variable("Rest0"));

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
    if (this.itemGraphPatterns) {
      optionalGraphPatterns.push(...this.itemGraphPatterns(itemNVariable));
    }

    // ?restN rdf:rest ?restNBasic to get the rdf:rest statement in the CONSTRUCT
    optionalGraphPatterns.push(
      GraphPattern.basic(restNVariable, rdf.rest, this.variable("RestNBasic")),
    );

    yield GraphPattern.optional(GraphPattern.group(optionalGraphPatterns));
  }
}
