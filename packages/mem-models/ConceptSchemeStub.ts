import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  abc,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { DatasetCore } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";
import { ConceptScheme } from "./ConceptScheme.js";

export class ConceptSchemeStub<
  ConceptT extends IConcept,
  ConceptSchemeT extends IConceptScheme,
  LabelT extends ILabel,
> extends abc.ConceptSchemeStub<ConceptT, ConceptSchemeT, LabelT> {
  private readonly dataset: DatasetCore;
  private readonly modelConstructor: new (
    _: ConceptScheme.Parameters<ConceptT, ConceptSchemeT, LabelT>,
  ) => ConceptSchemeT;

  constructor({
    dataset,
    modelConstructor,
    ...superParameters
  }: {
    dataset: DatasetCore;
    modelConstructor: new (
      _: ConceptScheme.Parameters<ConceptT, ConceptSchemeT, LabelT>,
    ) => ConceptSchemeT;
  } & abc.Stub.Parameters<ConceptT, ConceptSchemeT, LabelT>) {
    super(superParameters);
    this.dataset = dataset;
    this.modelConstructor = modelConstructor;
  }

  async resolve(): Promise<Maybe<ConceptSchemeT>> {
    // If there's an rdf:type statement then consider that we have the concept.
    // TODO: fetch all required fields here
    const resource = new Resource({
      dataset: this.dataset,
      identifier: this.identifier,
    });
    if (resource.isInstanceOf(skos.ConceptScheme)) {
      return Maybe.of(
        new this.modelConstructor({
          dataset: this.dataset,
          identifier: this.identifier,
          kos: this.kos,
        }),
      );
    }
    return Maybe.empty();
  }
}
