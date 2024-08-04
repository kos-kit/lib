import { NamedNode } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";

export class SemanticRelationProperty {
  static readonly BROADER = new SemanticRelationProperty({
    identifier: skos.broader,
    inverseIdentifier: Maybe.of(skos.narrower),
    label: "Broader",
  });
  static readonly BROADER_TRANSITIVE = new SemanticRelationProperty({
    identifier: skos.broaderTransitive,
    inverseIdentifier: Maybe.of(skos.narrowerTransitive),
    label: "Broader (transitive)",
  });
  static readonly NARROWER = new SemanticRelationProperty({
    identifier: skos.narrower,
    inverseIdentifier: Maybe.of(skos.broader),
    label: "Narrower",
  });
  static readonly NARROWER_TRANSITIVE = new SemanticRelationProperty({
    identifier: skos.narrowerTransitive,
    inverseIdentifier: Maybe.of(skos.broaderTransitive),
    label: "Narrower (transitive)",
  });

  static readonly RELATED = new SemanticRelationProperty({
    identifier: skos.related,
    inverseIdentifier: Maybe.empty(),
    label: "Related",
  });

  readonly identifier: NamedNode;
  readonly inverseIdentifier: Maybe<NamedNode>;
  readonly label: string;
  readonly name: string;

  protected constructor({
    identifier,
    inverseIdentifier,
    label,
  }: {
    identifier: NamedNode;
    inverseIdentifier: Maybe<NamedNode>;
    label: string;
  }) {
    this.identifier = identifier;
    this.inverseIdentifier = inverseIdentifier;
    this.label = label;
    this.name = identifier.value.substring(skos[""].value.length);
  }
}
