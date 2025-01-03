import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  Identifier,
  abc,
} from "@kos-kit/models";
import { Literal, NamedNode } from "@rdfjs/types";
import { dc11, dcterms } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";
import * as rdfjsResource from "rdfjs-resource";
import { Concept } from "./Concept.js";
import { Label } from "./Label.js";
import { Resource } from "./Resource.js";

const rightsPredicates = [dcterms.rights, dc11.rights];

export class ConceptScheme<
  ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
  ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
  LabelT extends ILabel,
> extends abc.ConceptScheme<ConceptT, ConceptSchemeT, LabelT> {
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

  get license(): Maybe<Literal | NamedNode> {
    const literals: Literal[] = [];

    for (const value of this.resource.values(dcterms.license)) {
      const iri = value.toIri().toMaybe();
      if (iri.isJust()) {
        return iri;
      }
      literals.push(...value.toLiteral().toMaybe().toList());
    }

    if (literals.length === 0) {
      return Maybe.empty();
    }
    const literal = literals[0];
    if (
      abc.matchLiteral(literal, {
        includeLanguageTags: this.kos.includeLanguageTags,
      })
    ) {
      return Maybe.of(literal);
    }

    return Maybe.empty();
  }

  get modified(): Maybe<Literal> {
    return Resource.modified.bind(this)();
  }

  get notations(): readonly Literal[] {
    return Resource.notations.bind(this)();
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
    ].flatMap((value) => value.toLiteral().toMaybe().toList());

    if (literals.length === 0) {
      return Maybe.empty();
    }
    const literal = literals[0];
    if (
      abc.matchLiteral(literal, {
        includeLanguageTags: this.kos.includeLanguageTags,
      })
    ) {
      return Maybe.of(literal);
    }

    return Maybe.empty();
  }
}

export namespace ConceptScheme {
  export interface Parameters<
    ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
    ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
    LabelT extends ILabel,
  > extends abc.ConceptScheme.Parameters<ConceptT, ConceptSchemeT, LabelT> {
    labelConstructor: new (
      parameters: ConstructorParameters<typeof Label>[0],
    ) => LabelT;
    resource: rdfjsResource.Resource<Identifier>;
  }
}
