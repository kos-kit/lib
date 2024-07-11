import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { isInstanceOf } from "@kos-kit/rdf-utils";
import TermSet from "@rdfjs/term-set";
import { skos } from "@tpluscode/rdf-ns-builders";
import { LabeledModel } from "./LabeledModel.js";
import { countIterable } from "./countIterable.js";
import { paginateIterable } from "./paginateIterable.js";
import { Just, Maybe } from "purify-ts";

export class ConceptScheme<
    ConceptT extends IConcept,
    ConceptSchemeT extends IConceptScheme,
    LabelT extends ILabel,
  >
  extends LabeledModel<ConceptT, ConceptSchemeT, LabelT>
  implements IConceptScheme
{
  async *_concepts({ topOnly }: { topOnly: boolean }): AsyncIterable<ConceptT> {
    for await (const identifier of this._conceptIdentifiers({ topOnly })) {
      yield this.modelFactory.createConcept(
        new Resource({ dataset: this.dataset, identifier }),
      );
    }
  }

  _conceptsCount({ topOnly }: { topOnly: boolean }): Promise<number> {
    return new Promise((resolve) => {
      resolve(countIterable(this._conceptIdentifiers({ topOnly })));
    });
  }

  _conceptsPage({
    limit,
    offset,
    topOnly,
  }: {
    limit: number;
    offset: number;
    topOnly: boolean;
  }): Promise<readonly ConceptT[]> {
    return new Promise((resolve) => {
      const result: ConceptT[] = [];
      for (const identifier of paginateIterable(
        this._conceptIdentifiers({ topOnly }),
        {
          limit,
          offset,
        },
      )) {
        result.push(
          this.modelFactory.createConcept(
            new Resource({ dataset: this.dataset, identifier }),
          ),
        );
      }
      resolve(result);
    });
  }

  conceptByIdentifier(
    identifier: IConcept.Identifier,
  ): Promise<Maybe<ConceptT>> {
    return new Promise((resolve) => {
      // conceptScheme skos:hasTopConcept resource entails resource is a skos:Concept because of
      // the range of skos:hasTopConcept
      for (const _ of this.resource.dataset.match(
        this.identifier,
        skos.hasTopConcept,
        identifier,
      )) {
        resolve(
          Just(
            this.modelFactory.createConcept(
              new Resource({ dataset: this.dataset, identifier }),
            ),
          ),
        );
        return;
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
            isInstanceOf({
              class_: skos.Concept,
              dataset: this.dataset,
              instance: identifier,
            })
          ) {
            resolve(
              Just(
                this.modelFactory.createConcept(
                  new Resource({ dataset: this.dataset, identifier }),
                ),
              ),
            );
            return;
          }
        }
      }
    });
  }

  async *concepts(): AsyncIterable<ConceptT> {
    yield* this._concepts({ topOnly: false });
  }

  conceptsCount(): Promise<number> {
    return this._conceptsCount({ topOnly: false });
  }

  conceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly ConceptT[]> {
    return this._conceptsPage({ ...kwds, topOnly: false });
  }

  async *topConcepts(): AsyncIterable<ConceptT> {
    yield* this._concepts({ topOnly: true });
  }

  topConceptsCount(): Promise<number> {
    return this._conceptsCount({ topOnly: true });
  }

  topConceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly ConceptT[]> {
    return this._conceptsPage({ ...kwds, topOnly: true });
  }

  private *_conceptIdentifiers({
    topOnly,
  }: {
    topOnly: boolean;
  }): Iterable<IConcept.Identifier> {
    const conceptIdentifierSet = new TermSet<IConcept.Identifier>();

    // ConceptScheme -> Concept statement
    for (const conceptIdentifier of this.resource.values(
      skos.hasTopConcept,
      Resource.ValueMappers.iri,
    )) {
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
          !isInstanceOf({
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
}
