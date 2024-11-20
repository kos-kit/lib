import { Literal } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import { Label } from "./Label.js";
import { LiteralLabel } from "./LiteralLabel.js";
import { Model } from "./Model.js";
import { Note } from "./Note.js";

export interface Resource<LabelT extends Label> extends Model {
  readonly displayLabel: string;
  readonly modified: Maybe<Literal>;
  readonly notations: readonly Literal[];

  labels(options?: { types?: readonly Label.Type[] }): readonly (
    | LiteralLabel
    | LabelT
  )[];

  notes(options?: { types?: readonly Note.Type[] }): readonly Note[];
}
