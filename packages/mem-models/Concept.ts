import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  Identifier,
  NoteProperty,
  abc,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { DatasetCore, Literal } from "@rdfjs/types";
import { dcterms, skos } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";

export abstract class Concept<
  ConceptT extends IConcept,
  ConceptSchemeT extends IConceptScheme,
  LabelT extends ILabel,
> extends abc.Concept<ConceptT, ConceptSchemeT, LabelT> {
  protected resource: Resource<Identifier>;

  constructor({
    dataset,
    ...superParameters
  }: Concept.Parameters<ConceptT, ConceptSchemeT, LabelT>) {
    super(superParameters);
    this.resource = new Resource({ dataset, identifier: this.identifier });
  }

  protected get includeLanguageTags() {
    return this.kos.includeLanguageTags;
  }

  protected abstract override labelsByType(
    type: ILabel.Type,
  ): readonly ILabel[];

  get modified(): Maybe<Literal> {
    return this.resource.value(dcterms.modified).toLiteral();
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
    ConceptT extends IConcept,
    ConceptSchemeT extends IConceptScheme,
    LabelT extends ILabel,
  > extends abc.Concept.Parameters<ConceptT, ConceptSchemeT, LabelT> {
    dataset: DatasetCore;
  }
}
