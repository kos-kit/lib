import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  Identifier,
  NoteProperty,
  abc,
} from "@kos-kit/models";
import { Literal } from "@rdfjs/types";
import { dcterms, skos } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";
import { Resource } from "rdfjs-resource";
import { Label } from "./Label.js";
import { labelsByType } from "./labelsByType.js";

export class Concept<
  ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
  ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
  LabelT extends ILabel,
> extends abc.Concept<ConceptT, ConceptSchemeT, LabelT> {
  protected readonly resource: Resource<Identifier>;
  private readonly labelConstructor: new (
    _: Label.Parameters,
  ) => LabelT;

  constructor({
    labelConstructor,
    resource,
    ...superParameters
  }: Concept.Parameters<ConceptT, ConceptSchemeT, LabelT>) {
    super(superParameters);
    this.labelConstructor = labelConstructor;
    this.resource = resource;
  }

  protected labelsByType(type: ILabel.Type): readonly ILabel[] {
    return labelsByType({
      includeLanguageTags: this.kos.includeLanguageTags,
      labelConstructor: this.labelConstructor,
      resource: this.resource,
      type,
    });
  }

  get identifier(): Identifier {
    return this.resource.identifier;
  }

  get modified(): Maybe<Literal> {
    return this.resource
      .value(dcterms.modified)
      .chain((value) => value.toLiteral());
  }

  get notations(): readonly Literal[] {
    return [
      ...this.resource
        .values(skos.notation)
        .flatMap((value) => value.toLiteral().toList()),
    ];
  }

  notes(property: NoteProperty): readonly Literal[] {
    return [
      ...this.resource.values(property.identifier).flatMap((value) =>
        value
          .toLiteral()
          .filter((literal) =>
            abc.matchLiteral(literal, {
              includeLanguageTags: this.kos.includeLanguageTags,
            }),
          )
          .toList(),
      ),
    ];
  }
}

export namespace Concept {
  export interface Parameters<
    ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
    ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
    LabelT extends ILabel,
  > extends abc.Concept.Parameters<ConceptT, ConceptSchemeT, LabelT> {
    labelConstructor: new (parameters: Label.Parameters) => LabelT;
    resource: Resource<Identifier>;
  }
}
