import { Literal, NamedNode } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import { Equatable } from "purify-ts-helpers";
import { Concept as IConcept } from "../Concept.js";
import { ConceptScheme as IConceptScheme } from "../ConceptScheme.js";
import { Identifier } from "../Identifier.js";
import { Label as ILabel } from "../Label.js";
import { Stub } from "../Stub.js";
import { StubSequence } from "../StubSequence.js";
import { Resource } from "./Resource.js";

export abstract class ConceptScheme<
    ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
    ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
    LabelT extends ILabel,
  >
  extends Resource<ConceptT, ConceptSchemeT, LabelT>
  implements IConceptScheme<ConceptT, LabelT>
{
  abstract readonly license: Maybe<Literal | NamedNode>;
  abstract readonly rights: Maybe<Literal>;
  abstract readonly rightsHolder: Maybe<Literal>;

  async concept(identifier: Identifier): Promise<Maybe<Stub<ConceptT>>> {
    for (const conceptStub of await this.kos.conceptsByQuery({
      limit: 1,
      offset: 0,
      query: {
        conceptIdentifier: identifier,
        conceptSchemeIdentifier: this.identifier,
        type: "InScheme",
      },
    })) {
      return Maybe.of(conceptStub);
    }
    this.logger.info(
      "concept %s is not part of concept scheme %s",
      Identifier.toString(identifier),
      Identifier.toString(this.identifier),
    );
    return Maybe.empty();
  }

  concepts(kwds?: {
    limit?: number;
    offset?: number;
  }): Promise<StubSequence<ConceptT>> {
    return this.kos.conceptsByQuery({
      limit: null,
      offset: 0,
      query: { conceptSchemeIdentifier: this.identifier, type: "InScheme" },
      ...kwds,
    });
  }

  conceptsCount(): Promise<number> {
    return this.kos.conceptsCountByQuery({
      conceptSchemeIdentifier: this.identifier,
      type: "InScheme",
    });
  }

  equals(other: ConceptSchemeT): Equatable.EqualsResult {
    // This is a method and not an assignment to the function so it can be overridden in subclasses
    return ConceptScheme.equals.bind(this)(other);
  }

  topConcepts(kwds?: {
    limit?: number;
    offset?: number;
  }): Promise<StubSequence<ConceptT>> {
    return this.kos.conceptsByQuery({
      limit: null,
      offset: 0,
      query: { conceptSchemeIdentifier: this.identifier, type: "TopConceptOf" },
      ...kwds,
    });
  }

  topConceptsCount(): Promise<number> {
    return this.kos.conceptsCountByQuery({
      conceptSchemeIdentifier: this.identifier,
      type: "TopConceptOf",
    });
  }
}

export namespace ConceptScheme {
  export function equals(
    this: IConceptScheme<any, any>,
    other: IConceptScheme<any, any>,
  ): Equatable.EqualsResult {
    return Resource.resourceEquals.bind(this)(other);
  }

  export type Parameters<
    ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
    ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
    LabelT extends ILabel,
  > = Resource.Parameters<ConceptT, ConceptSchemeT, LabelT>;
}
