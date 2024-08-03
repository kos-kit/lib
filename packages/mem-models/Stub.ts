import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  abc,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { DatasetCore, NamedNode } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import { Concept } from "./Concept.js";
import { Label } from "./Label.js";

export class Stub<
  ConceptT extends IConcept,
  ConceptSchemeT extends IConceptScheme,
  LabelT extends ILabel,
  ModelT extends ConceptT | ConceptSchemeT,
> extends abc.Stub<ConceptT, ConceptSchemeT, LabelT, ModelT> {
  protected readonly dataset: DatasetCore;
  private readonly labelConstructor: new (
    _: Label.Parameters,
  ) => LabelT;
  private readonly modelConstructor: new (
    _: Concept.Parameters<ConceptT, ConceptSchemeT, LabelT>,
  ) => ModelT;
  private readonly modelRdfType: NamedNode;

  constructor({
    dataset,
    labelConstructor,
    modelConstructor,
    modelRdfType,
    ...superParameters
  }: {
    dataset: DatasetCore;
    labelConstructor: new (_: Label.Parameters) => LabelT;
    modelConstructor: new (
      _: Concept.Parameters<ConceptT, ConceptSchemeT, LabelT>,
    ) => ModelT;
    modelRdfType: NamedNode;
  } & abc.Stub.Parameters<ConceptT, ConceptSchemeT, LabelT>) {
    super(superParameters);
    this.dataset = dataset;
    this.labelConstructor = labelConstructor;
    this.modelConstructor = modelConstructor;
    this.modelRdfType = modelRdfType;
  }

  async resolve(): Promise<Maybe<ModelT>> {
    // If there's an rdf:type statement then consider that we have the concept.
    // TODO: fetch all required fields here
    if (
      new Resource({
        dataset: this.dataset,
        identifier: this.identifier,
      }).isInstanceOf(this.modelRdfType)
    ) {
      return Maybe.of(
        new this.modelConstructor({
          dataset: this.dataset,
          identifier: this.identifier,
          labelConstructor: this.labelConstructor,
          kos: this.kos,
        }),
      );
    }
    return Maybe.empty();
  }
}
