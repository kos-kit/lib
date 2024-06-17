import TermSet from "@rdfjs/term-set";
import { LabeledModel } from "./LabeledModel";
import { Concept } from "./Concept";
import { Resource } from "@kos-kit/rdf-resource";
import { ConceptScheme as IConceptScheme } from "@kos-kit/models";
import { skos } from "@tpluscode/rdf-ns-builders";
import { BlankNode, NamedNode } from "@rdfjs/types";
import { paginateIterable } from "./paginateIterable";
import { countIterable } from "./countIterable";

export class ConceptScheme extends LabeledModel implements IConceptScheme {
  private *topConceptIdentifiers(): Iterable<Resource.Identifier> {
    const conceptIdentifierSet = new TermSet<Resource.Identifier>();

    // ConceptScheme -> Concept statement
    for (const conceptIdentifier of this.resource.values(
      skos.hasTopConcept,
      Resource.ValueMappers.identifier,
    )) {
      if (!conceptIdentifierSet.has(conceptIdentifier)) {
        yield conceptIdentifier;
        conceptIdentifierSet.add(conceptIdentifier);
      }
    }

    // Concept -> ConceptScheme statement
    for (const quad of this.resource.dataset.match(
      null,
      skos.topConceptOf,
      this.identifier,
    )) {
      const conceptIdentifier = Resource.ValueMappers.identifier(
        quad.subject as BlankNode | NamedNode,
      );
      if (
        conceptIdentifier !== null &&
        !conceptIdentifierSet.has(conceptIdentifier)
      ) {
        yield conceptIdentifier;
        conceptIdentifierSet.add(conceptIdentifier);
      }
    }
  }

  async *topConcepts(): AsyncGenerator<Concept> {
    for await (const identifier of this.topConceptIdentifiers()) {
      yield new Concept({
        kos: this.kos,
        resource: new Resource({ dataset: this.resource.dataset, identifier }),
      });
    }
  }

  topConceptsPage({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]> {
    return new Promise((resolve) => {
      const result: Concept[] = [];
      for (const identifier of paginateIterable(this.topConceptIdentifiers(), {
        limit,
        offset,
      })) {
        result.push(
          new Concept({
            kos: this.kos,
            resource: new Resource({
              dataset: this.resource.dataset,
              identifier,
            }),
          }),
        );
      }
      resolve(result);
    });
  }

  topConceptsCount(): Promise<number> {
    return new Promise((resolve) =>
      resolve(countIterable(this.topConceptIdentifiers())),
    );
  }
}
