import { NamedNode } from "@rdfjs/types";
import { Literal } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";
import { ConceptScheme } from "./ConceptScheme.js";
import { Label } from "./Label.js";
import { LabeledModel } from "./LabeledModel.js";
import { Note } from "./Note";
import { StubSequence } from "./StubSequence.js";

export interface Concept<
  ConceptT extends Concept<any, ConceptSchemeT, LabelT>,
  ConceptSchemeT extends ConceptScheme<ConceptT, LabelT>,
  LabelT extends Label,
> extends LabeledModel<LabelT> {
  readonly modified: Maybe<Literal>;
  readonly notations: readonly Literal[];

  equals(other: Concept<any, any, any>): boolean;
  inSchemes(): Promise<StubSequence<ConceptSchemeT>>;
  notes(options?: { types?: readonly Note.Type[] }): readonly Note[];
  semanticRelations(
    type: Concept.SemanticRelation.Type,
    options?: {
      includeInverse?: boolean;
    },
  ): Promise<StubSequence<ConceptT>>;
  topConceptOf(): Promise<StubSequence<ConceptSchemeT>>;
}

export namespace Concept {
  export namespace SemanticRelation {
    export class Type {
      private readonly inverseIdentifier: Maybe<NamedNode>;

      static readonly BROADER = new Type({
        inverseIdentifier: Maybe.of(skos.narrower),
        mapping: false,
        skosProperty: skos.broader,
      });
      static readonly BROADER_TRANSITIVE = new Type({
        inverseIdentifier: Maybe.of(skos.narrowerTransitive),
        mapping: false,
        skosProperty: skos.broaderTransitive,
      });
      static readonly BROAD_MATCH = new Type({
        inverseIdentifier: Maybe.of(skos.narrowMatch),
        mapping: true,
        skosProperty: skos.broadMatch,
      });
      static readonly CLOSE_MATCH = new Type({
        inverseIdentifier: Maybe.empty(),
        mapping: true,
        skosProperty: skos.closeMatch,
      });
      static readonly EXACT_MATCH = new Type({
        inverseIdentifier: Maybe.empty(),
        mapping: true,
        skosProperty: skos.exactMatch,
      });
      static readonly NARROWER = new Type({
        inverseIdentifier: Maybe.of(skos.broader),
        mapping: false,
        skosProperty: skos.narrower,
      });
      static readonly NARROWER_TRANSITIVE = new Type({
        inverseIdentifier: Maybe.of(skos.broaderTransitive),
        mapping: false,
        skosProperty: skos.narrowerTransitive,
      });
      static readonly NARROW_MATCH = new Type({
        inverseIdentifier: Maybe.of(skos.broadMatch),
        mapping: true,
        skosProperty: skos.narrowMatch,
      });
      static readonly RELATED = new Type({
        inverseIdentifier: Maybe.empty(),
        mapping: false,
        skosProperty: skos.related,
      });
      static readonly RELATED_MATCH = new Type({
        inverseIdentifier: Maybe.empty(),
        mapping: true,
        skosProperty: skos.relatedMatch,
      });

      readonly property: NamedNode;
      readonly mapping: boolean;

      private constructor({
        inverseIdentifier,
        mapping,
        skosProperty,
      }: {
        skosProperty: NamedNode;
        inverseIdentifier: Maybe<NamedNode>;
        mapping: boolean;
      }) {
        this.property = skosProperty;
        this.inverseIdentifier = inverseIdentifier;
        this.mapping = mapping;
      }

      equals(other: SemanticRelation.Type): boolean {
        return this.property.equals(other.property);
      }

      get inverse(): Maybe<Type> {
        return this.inverseIdentifier.map(
          (inverseIdentifier) =>
            Types.find((type) => type.property.equals(inverseIdentifier))!,
        );
      }
    }

    // https://www.w3.org/TR/skos-reference/#L4160
    export const Types: readonly Type[] = [
      Type.BROADER,
      Type.BROADER_TRANSITIVE,
      Type.BROAD_MATCH,
      Type.CLOSE_MATCH,
      Type.EXACT_MATCH,
      Type.NARROWER,
      Type.NARROWER_TRANSITIVE,
      Type.NARROW_MATCH,
      Type.RELATED,
      Type.RELATED_MATCH,
    ];
  }
}
