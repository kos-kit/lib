import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  Identifier,
  abc,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { DatasetCore, NamedNode } from "@rdfjs/types";
import { Maybe } from "purify-ts";

export class Stub<
  ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
  ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
  LabelT extends ILabel,
  ModelT extends ConceptT | ConceptSchemeT,
> extends abc.Stub<ConceptT, ConceptSchemeT, LabelT, ModelT> {
  protected readonly dataset: DatasetCore;
  private readonly modelFactory: (identifier: Identifier) => ModelT;
  private readonly modelRdfType: NamedNode;

  constructor({
    dataset,
    modelFactory,
    modelRdfType,
    ...superParameters
  }: {
    dataset: DatasetCore;
    modelFactory: (identifier: Identifier) => ModelT;
    modelRdfType: NamedNode;
  } & abc.Stub.Parameters<ConceptT, ConceptSchemeT, LabelT>) {
    super(superParameters);
    this.dataset = dataset;
    this.modelFactory = modelFactory;
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
      return Maybe.of(this.modelFactory(this.identifier));
    }
    this.logger.warn(
      "%s is missing or not an instance of %s, unable to resolve",
      Identifier.toString(this.identifier),
      Identifier.toString(this.modelRdfType),
    );
    return Maybe.empty();
  }
}
