import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  Identifier,
  Note,
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

  get identifier(): Identifier {
    return this.resource.identifier;
  }

  get modified(): Maybe<Literal> {
    return this.resource
      .value(dcterms.modified)
      .chain((value) => value.toLiteral())
      .toMaybe();
  }

  get notations(): readonly Literal[] {
    return [
      ...this.resource
        .values(skos.notation)
        .flatMap((value) => value.toLiteral().toMaybe().toList()),
    ];
  }

  notes(options?: { types?: readonly Note.Type[] }): readonly Note[] {
    return (options?.types ?? Note.Types).flatMap((type) => [
      ...this.resource.values(type.skosProperty).flatMap((value) =>
        value
          .toLiteral()
          .toMaybe()
          .filter((literal) =>
            abc.matchLiteral(literal, {
              includeLanguageTags: this.kos.includeLanguageTags,
            }),
          )
          .map((literalForm) => new abc.Note({ literalForm, type }))
          .toList(),
      ),
    ]);
  }

  protected labelsByType(type: ILabel.Type): readonly ILabel[] {
    return labelsByType({
      includeLanguageTags: this.kos.includeLanguageTags,
      labelConstructor: this.labelConstructor,
      resource: this.resource,
      type,
    });
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
