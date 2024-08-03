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
import { Label } from "./Label.js";

export class ConceptSchemeStub<
  ConceptT extends IConcept,
  ConceptSchemeT extends IConceptScheme,
  LabelT extends ILabel,
> extends abc.ConceptSchemeStub<ConceptT, ConceptSchemeT, LabelT> {
  private readonly dataset: DatasetCore;
  private readonly conceptSchemeConstructor: new (
    _: ConceptScheme.Parameters<ConceptT, ConceptSchemeT, LabelT>,
  ) => ConceptSchemeT;
  private readonly labelConstructor: new (
    _: Label.Parameters,
  ) => LabelT;

  constructor({
    conceptSchemeConstructor,
    dataset,
    labelConstructor,
    ...superParameters
  }: {
    conceptSchemeConstructor: new (
      _: ConceptScheme.Parameters<ConceptT, ConceptSchemeT, LabelT>,
    ) => ConceptSchemeT;
    dataset: DatasetCore;
    labelConstructor: new (_: Label.Parameters) => LabelT;
  } & abc.Stub.Parameters<ConceptT, ConceptSchemeT, LabelT>) {
    super(superParameters);
    this.dataset = dataset;
    this.conceptSchemeConstructor = conceptSchemeConstructor;
    this.labelConstructor = labelConstructor;
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
        new this.conceptSchemeConstructor({
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
