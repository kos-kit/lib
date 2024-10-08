import { rdf } from "@tpluscode/rdf-ns-builders";
import { BasicGraphPattern, GraphPattern } from "./GraphPattern";
import { GraphPatterns } from "./GraphPatterns";
import { PropertyPath } from "./PropertyPath";
import { ResourceGraphPatterns } from "./ResourceGraphPatterns";

/**
 * Graph patterns for an RDF list
 * https://www.w3.org/TR/rdf-schema/#ch_collectionvocab
 */
export class RdfListGraphPatterns extends ResourceGraphPatterns {
  private readonly itemGraphPatterns?: (
    itemVariable: BasicGraphPattern.Variable,
  ) => GraphPatterns;

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

    // ?list rdf:rest* ?restN
    const restNVariable = this.variable("RestN");
    yield GraphPattern.basic(
      this.subject,
      {
        termType: "PropertyPath",
        value: PropertyPath.zeroOrMore(PropertyPath.predicate(rdf.rest)),
      },
      restNVariable,
    ).scoped("WHERE");

    // ?rest rdf:first ?itemN
    const itemNVariable = this.variable("ItemN");
    yield GraphPattern.basic(restNVariable, rdf.first, itemNVariable);
    if (this.itemGraphPatterns) {
      yield* this.itemGraphPatterns(itemNVariable);
    }

    // ?restN ?p ?o to get the rdf:first and rdf:rest statements in CONSTRUCT
    yield GraphPattern.basic(
      restNVariable,
      this.variable("RestP"),
      this.variable("RestO"),
    );
  }
}
