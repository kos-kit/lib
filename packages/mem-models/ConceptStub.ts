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
import { Label } from "./Label.js";

export class ConceptStub<
  ConceptT extends IConcept,
  ConceptSchemeT extends IConceptScheme,
  LabelT extends ILabel,
> extends abc.ConceptStub<ConceptT, ConceptSchemeT, LabelT> {
  private readonly conceptConstructor: new (
    _: Concept.Parameters<ConceptT, ConceptSchemeT, LabelT>,
  ) => ConceptT;
  private readonly dataset: DatasetCore;
  private readonly labelConstructor: new (
    _: Label.Parameters,
  ) => LabelT;

  constructor({
    conceptConstructor,
    dataset,
    labelConstructor,
    ...superParameters
  }: {
    conceptConstructor: new (
      _: Concept.Parameters<ConceptT, ConceptSchemeT, LabelT>,
    ) => ConceptT;
    dataset: DatasetCore;
    labelConstructor: new (_: Label.Parameters) => LabelT;
  } & abc.Stub.Parameters<ConceptT, ConceptSchemeT, LabelT>) {
    super(superParameters);
    this.dataset = dataset;
    this.conceptConstructor = conceptConstructor;
    this.labelConstructor = labelConstructor;
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
        new this.conceptConstructor({
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
