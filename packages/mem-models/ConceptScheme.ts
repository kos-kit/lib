import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { isRdfInstanceOf } from "@kos-kit/rdf-utils";
import TermSet from "@rdfjs/term-set";
import { skos } from "@tpluscode/rdf-ns-builders";
import { LabeledModel } from "./LabeledModel.js";
import { countIterable } from "./countIterable.js";
import { paginateIterable } from "./paginateIterable.js";
import { Maybe, Nothing } from "purify-ts";
import { StubConcept } from "./StubConcept.js";

export class ConceptScheme<
    ConceptT extends IConcept,
    ConceptSchemeT extends IConceptScheme,
    LabelT extends ILabel,
  >
  extends LabeledModel<ConceptT, ConceptSchemeT, LabelT>
  implements IConceptScheme
{
  async *_concepts({
    topOnly,
  }: {
    topOnly: boolean;
  }): AsyncIterable<StubConcept<ConceptT, ConceptSchemeT, LabelT>> {
    for await (const identifier of this._conceptIdentifiers({ topOnly })) {
      yield new StubConcept({
        modelFactory: this.modelFactory,
        resource: new Resource({ dataset: this.dataset, identifier }),
      });
    }
  }

  async _conceptsCount({ topOnly }: { topOnly: boolean }): Promise<number> {
    return countIterable(this._conceptIdentifiers({ topOnly }));
  }

  async conceptByIdentifier(
    identifier: IConcept.Identifier,
  ): Promise<Maybe<ConceptT>> {
    // conceptScheme skos:hasTopConcept resource entails resource is a skos:Concept because of
    // the range of skos:hasTopConcept
    for (const _ of this.resource.dataset.match(
      this.identifier,
      skos.hasTopConcept,
      identifier,
    )) {
      return new StubConcept({
        modelFactory: this.modelFactory,
        resource: new Resource({ dataset: this.dataset, identifier }),
      }).resolve();
    }

    // resource skos:topConceptOf conceptScheme entails resource is a skos:Concept because of the
    // domain of skos:topConceptOf
    // resource skos:inScheme conceptScheme does not entail resource is a skos:Concept, since
    // skos:inScheme has an open domain
    for (const predicate of [skos.inScheme, skos.topConceptOf]) {
      for (const _ of this.resource.dataset.match(
        identifier,
        predicate,
        this.identifier,
      )) {
        if (
          predicate.equals(skos.topConceptOf) ||
          isRdfInstanceOf({
            class_: skos.Concept,
            dataset: this.dataset,
            instance: identifier,
          })
        ) {
          return new StubConcept({
            modelFactory: this.modelFactory,
            resource: new Resource({ dataset: this.dataset, identifier }),
          }).resolve();
        }
      }
    }

    return Nothing;
  }

  async *concepts(): AsyncIterable<
    StubConcept<ConceptT, ConceptSchemeT, LabelT>
  > {
    yield* this._concepts({ topOnly: false });
  }

  conceptsCount(): Promise<number> {
    return this._conceptsCount({ topOnly: false });
  }

  conceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly StubConcept<ConceptT, ConceptSchemeT, LabelT>[]> {
    return this._conceptsPage({ ...kwds, topOnly: false });
  }

  async *topConcepts(): AsyncIterable<
    StubConcept<ConceptT, ConceptSchemeT, LabelT>
  > {
    yield* this._concepts({ topOnly: true });
  }

  topConceptsCount(): Promise<number> {
    return this._conceptsCount({ topOnly: true });
  }

  topConceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly StubConcept<ConceptT, ConceptSchemeT, LabelT>[]> {
    return this._conceptsPage({ ...kwds, topOnly: true });
  }

  private *_conceptIdentifiers({
    topOnly,
  }: {
    topOnly: boolean;
  }): Iterable<IConcept.Identifier> {
    const conceptIdentifierSet = new TermSet<IConcept.Identifier>();

    // ConceptScheme -> Concept statement
    for (const conceptIdentifier of [
      ...this.resource.values(skos.hasTopConcept),
    ].flatMap((value) => value.toIri().toList())) {
      if (!conceptIdentifierSet.has(conceptIdentifier)) {
        yield conceptIdentifier;
        conceptIdentifierSet.add(conceptIdentifier);
      }
    }

    // Concept -> ConceptScheme statement
    for (const predicate of topOnly
      ? [skos.topConceptOf]
      : [skos.inScheme, skos.topConceptOf])
      for (const quad of this.resource.dataset.match(
        null,
        predicate,
        this.identifier,
      )) {
        if (quad.subject.termType !== "NamedNode") {
          continue;
        }
        const conceptIdentifier = quad.subject;

        // See note in conceptByIdentifier about skos:inScheme
        if (
          predicate.equals(skos.inScheme) &&
          !isRdfInstanceOf({
            class_: skos.Concept,
            dataset: this.dataset,
            instance: conceptIdentifier,
          })
        ) {
          continue;
        }

        if (conceptIdentifierSet.has(conceptIdentifier)) {
          continue;
        }

        yield conceptIdentifier;
        conceptIdentifierSet.add(conceptIdentifier);
      }
  }

  private async _conceptsPage({
    limit,
    offset,
    topOnly,
  }: {
    limit: number;
    offset: number;
    topOnly: boolean;
  }): Promise<readonly StubConcept<ConceptT, ConceptSchemeT, LabelT>[]> {
    const result: StubConcept<ConceptT, ConceptSchemeT, LabelT>[] = [];
    for (const identifier of paginateIterable(
      this._conceptIdentifiers({ topOnly }),
      {
        limit,
        offset,
      },
    )) {
      result.push(
        new StubConcept({
          modelFactory: this.modelFactory,
          resource: new Resource({ dataset: this.dataset, identifier }),
        }),
      );
    }
    return result;
  }
}
