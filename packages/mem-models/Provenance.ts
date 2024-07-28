import {
  Identifier,
  ProvenanceMixin as IProvenanceMixin,
  LanguageTagSet,
} from "@kos-kit/models";
import { Literal, NamedNode } from "@rdfjs/types";
import { dc11, dcterms } from "@tpluscode/rdf-ns-builders";
import { matchLiteral } from "./matchLiteral.js";
import { Just, Maybe, Nothing } from "purify-ts";
import { Resource } from "@kos-kit/rdf-resource";
import { NamedModel } from "./NamedModel.js";

const rightsPredicates = [dcterms.rights, dc11.rights];

export class Provenance implements IProvenanceMixin {
  private readonly includeLanguageTags: LanguageTagSet;
  private readonly resource: Resource<Identifier>;

  constructor({ includeLanguageTags, resource }: NamedModel.Parameters) {
    this.includeLanguageTags = includeLanguageTags;
    this.resource = resource;
  }

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
      return Nothing;
    }
    const literal = literals[0];
    if (
      matchLiteral(literal, {
        includeLanguageTags: this.includeLanguageTags,
      })
    ) {
      return Just(literal);
    }

    return Nothing;
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
    return Nothing;
  }

  get rightsHolder(): Maybe<Literal> {
    return this.literalObject(dcterms.rightsHolder);
  }

  private literalObject(predicate: NamedNode): Maybe<Literal> {
    const literals: readonly Literal[] = [
      ...this.resource.values(predicate),
    ].flatMap((value) => value.toLiteral().toList());

    if (literals.length === 0) {
      return Nothing;
    }
    const literal = literals[0];
    if (
      matchLiteral(literal, {
        includeLanguageTags: this.includeLanguageTags,
      })
    ) {
      return Just(literal);
    }

    return Nothing;
  }
}
