import { skos } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";
import { SemanticRelationProperty } from "./SemanticRelationProperty.js";

export class MappingProperty extends SemanticRelationProperty {
  static readonly BROAD_MATCH = new MappingProperty({
    identifier: skos.broadMatch,
    inverseIdentifier: Maybe.of(skos.narrowMatch),
    label: "Broad match",
  });
  static readonly CLOSE_MATCH = new MappingProperty({
    identifier: skos.closeMatch,
    inverseIdentifier: Maybe.empty(),
    label: "Close match",
  });
  static readonly EXACT_MATCH = new MappingProperty({
    identifier: skos.exactMatch,
    inverseIdentifier: Maybe.empty(),
    label: "Exact match",
  });
  static readonly NARROW_MATCH = new MappingProperty({
    identifier: skos.narrowMatch,
    inverseIdentifier: Maybe.of(skos.broadMatch),
    label: "Narrow match",
  });
  static readonly RELATED_MATCH = new MappingProperty({
    identifier: skos.relatedMatch,
    inverseIdentifier: Maybe.empty(),
    label: "Related match",
  });
}
