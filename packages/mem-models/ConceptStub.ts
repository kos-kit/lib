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
import { Concept } from "./Concept.js";

export class ConceptStub<
  ConceptT extends IConcept,
  ConceptSchemeT extends IConceptScheme,
  LabelT extends ILabel,
> extends abc.ConceptStub<ConceptT, ConceptSchemeT, LabelT> {
  private readonly dataset: DatasetCore;
  private readonly modelConstructor: new (
    _: Concept.Parameters<ConceptT, ConceptSchemeT, LabelT>,
  ) => ConceptT;

  constructor({
    dataset,
    modelConstructor,
    ...superParameters
  }: {
    dataset: DatasetCore;
    modelConstructor: new (
      _: Concept.Parameters<ConceptT, ConceptSchemeT, LabelT>,
    ) => ConceptT;
  } & abc.Stub.Parameters<ConceptT, ConceptSchemeT, LabelT>) {
    super(superParameters);
    this.dataset = dataset;
    this.modelConstructor = modelConstructor;
  }

  async resolve(): Promise<Maybe<ConceptT>> {
    // If there's an rdf:type statement then consider that we have the concept.
    // TODO: fetch all required fields here
    const resource = new Resource({
      dataset: this.dataset,
      identifier: this.identifier,
    });
    if (resource.isInstanceOf(skos.Concept)) {
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
