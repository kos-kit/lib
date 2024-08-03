import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  Identifier,
  abc,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { DatasetCore, Literal, NamedNode } from "@rdfjs/types";
import { dc11, dcterms } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";

const rightsPredicates = [dcterms.rights, dc11.rights];

export abstract class ConceptScheme<
    ConceptT extends IConcept,
    ConceptSchemeT extends IConceptScheme,
    LabelT extends ILabel,
  >
  extends abc.ConceptScheme<ConceptT, ConceptSchemeT, LabelT>
  implements IConceptScheme
{
  protected resource: Resource<Identifier>;

  constructor({
    dataset,
    ...superParameters
  }: ConceptScheme.Parameters<ConceptT, ConceptSchemeT, LabelT>) {
    super(superParameters);
    this.resource = new Resource({ dataset, identifier: this.identifier });
  }

  protected get includeLanguageTags() {
    return this.kos.includeLanguageTags;
  }

  protected abstract override labelsByType(
    type: ILabel.Type,
  ): readonly ILabel[];

  get license(): Maybe<Literal | NamedNode> {
    const literals: Literal[] = [];

    for (const value of this.resource.values(dcterms.license)) {
      const iri = value.toIri();
      if (iri.isJust()) {
        return iri;
      }
      literals.push(...value.toLiteral().toList());
    }

    if (literals.length === 0) {
      return Maybe.empty();
    }
    const literal = literals[0];
    if (
      abc.matchLiteral(literal, {
        includeLanguageTags: this.includeLanguageTags,
      })
    ) {
      return Maybe.of(literal);
    }

    return Maybe.empty();
  }

  get modified(): Maybe<Literal> {
    return this.resource.value(dcterms.modified).toLiteral();
  }

  get rights(): Maybe<Literal> {
    for (const predicate of rightsPredicates) {
      const value = this.literalObject(predicate);
      if (value.isJust()) {
        return value;
      }
    }
    return Maybe.empty();
  }

  get rightsHolder(): Maybe<Literal> {
    return this.literalObject(dcterms.rightsHolder);
  }

  private literalObject(predicate: NamedNode): Maybe<Literal> {
    const literals: readonly Literal[] = [
      ...this.resource.values(predicate),
    ].flatMap((value) => value.toLiteral().toList());

    if (literals.length === 0) {
      return Maybe.empty();
    }
    const literal = literals[0];
    if (
      abc.matchLiteral(literal, {
        includeLanguageTags: this.includeLanguageTags,
      })
    ) {
      return Maybe.of(literal);
    }

    return Maybe.empty();
  }
}

export namespace ConceptScheme {
  export interface Parameters<
    ConceptT extends IConcept,
    ConceptSchemeT extends IConceptScheme,
    LabelT extends ILabel,
  > extends abc.ConceptScheme.Parameters<ConceptT, ConceptSchemeT, LabelT> {
    dataset: DatasetCore;
  }
}
