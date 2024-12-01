import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  Identifier,
  abc,
} from "@kos-kit/models";
import { Literal } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import * as rdfjsResource from "rdfjs-resource";
import { Label } from "./Label.js";
import { Resource } from "./Resource.js";

export class Concept<
  ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
  ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
  LabelT extends ILabel,
> extends abc.Concept<ConceptT, ConceptSchemeT, LabelT> {
  readonly labelConstructor: new (
    _: ConstructorParameters<typeof Label>[0],
  ) => LabelT;
  notes = Resource.notes;
  readonly resource: rdfjsResource.Resource<Identifier>;
  protected labelsByType = Resource.labelsByType;

  constructor({
    labelConstructor,
    resource,
    ...superParameters
  }: Concept.Parameters<ConceptT, ConceptSchemeT, LabelT>) {
    super(superParameters);
    this.labelConstructor = labelConstructor;
    this.resource = resource;
  }

  get identifier(): Identifier {
    return this.resource.identifier;
  }

  get modified(): Maybe<Literal> {
    return Resource.modified.bind(this)();
  }

  get notations(): readonly Literal[] {
    return Resource.notations.bind(this)();
  }
}

export namespace Concept {
  export interface Parameters<
    ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
    ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
    LabelT extends ILabel,
  > extends abc.Concept.Parameters<ConceptT, ConceptSchemeT, LabelT> {
    labelConstructor: new (
      parameters: ConstructorParameters<typeof Label>[0],
    ) => LabelT;
    resource: rdfjsResource.Resource<Identifier>;
  }
}
