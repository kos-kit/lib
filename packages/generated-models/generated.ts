import * as sparqlBuilder from "@kos-kit/sparql-builder";
import type * as rdfjs from "@rdfjs/types";
import { sha256 } from "js-sha256";
import { DataFactory as dataFactory } from "n3";
import * as purify from "purify-ts";
import * as purifyHelpers from "purify-ts-helpers";
import * as rdfLiteral from "rdf-literal";
import * as rdfjsResource from "rdfjs-resource";
abstract class Resource {
  readonly altLabel: readonly rdfjs.Literal[];
  readonly altLabelXl: readonly LabelStub[];
  readonly changeNote: readonly rdfjs.Literal[];
  readonly definition: readonly rdfjs.Literal[];
  readonly editorialNote: readonly rdfjs.Literal[];
  readonly example: readonly rdfjs.Literal[];
  readonly hiddenLabel: readonly rdfjs.Literal[];
  readonly hiddenLabelXl: readonly LabelStub[];
  readonly historyNote: readonly rdfjs.Literal[];
  abstract readonly identifier: rdfjs.NamedNode;
  readonly modified: purify.Maybe<Date>;
  readonly notation: readonly rdfjs.Literal[];
  readonly note: readonly rdfjs.Literal[];
  readonly prefLabel: readonly rdfjs.Literal[];
  readonly prefLabelXl: readonly LabelStub[];
  readonly scopeNote: readonly rdfjs.Literal[];
  abstract readonly type: "Concept" | "ConceptScheme";

  constructor(parameters: {
    readonly altLabel?: readonly rdfjs.Literal[];
    readonly altLabelXl?: readonly LabelStub[];
    readonly changeNote?: readonly rdfjs.Literal[];
    readonly definition?: readonly rdfjs.Literal[];
    readonly editorialNote?: readonly rdfjs.Literal[];
    readonly example?: readonly rdfjs.Literal[];
    readonly hiddenLabel?: readonly rdfjs.Literal[];
    readonly hiddenLabelXl?: readonly LabelStub[];
    readonly historyNote?: readonly rdfjs.Literal[];
    readonly modified?: Date | purify.Maybe<Date>;
    readonly notation?: readonly rdfjs.Literal[];
    readonly note?: readonly rdfjs.Literal[];
    readonly prefLabel?: readonly rdfjs.Literal[];
    readonly prefLabelXl?: readonly LabelStub[];
    readonly scopeNote?: readonly rdfjs.Literal[];
  }) {
    if (Array.isArray(parameters.altLabel)) {
      this.altLabel = parameters.altLabel;
    } else if (typeof parameters.altLabel === "undefined") {
      this.altLabel = [];
    } else {
      this.altLabel = parameters.altLabel; // never
    }

    if (Array.isArray(parameters.altLabelXl)) {
      this.altLabelXl = parameters.altLabelXl;
    } else if (typeof parameters.altLabelXl === "undefined") {
      this.altLabelXl = [];
    } else {
      this.altLabelXl = parameters.altLabelXl; // never
    }

    if (Array.isArray(parameters.changeNote)) {
      this.changeNote = parameters.changeNote;
    } else if (typeof parameters.changeNote === "undefined") {
      this.changeNote = [];
    } else {
      this.changeNote = parameters.changeNote; // never
    }

    if (Array.isArray(parameters.definition)) {
      this.definition = parameters.definition;
    } else if (typeof parameters.definition === "undefined") {
      this.definition = [];
    } else {
      this.definition = parameters.definition; // never
    }

    if (Array.isArray(parameters.editorialNote)) {
      this.editorialNote = parameters.editorialNote;
    } else if (typeof parameters.editorialNote === "undefined") {
      this.editorialNote = [];
    } else {
      this.editorialNote = parameters.editorialNote; // never
    }

    if (Array.isArray(parameters.example)) {
      this.example = parameters.example;
    } else if (typeof parameters.example === "undefined") {
      this.example = [];
    } else {
      this.example = parameters.example; // never
    }

    if (Array.isArray(parameters.hiddenLabel)) {
      this.hiddenLabel = parameters.hiddenLabel;
    } else if (typeof parameters.hiddenLabel === "undefined") {
      this.hiddenLabel = [];
    } else {
      this.hiddenLabel = parameters.hiddenLabel; // never
    }

    if (Array.isArray(parameters.hiddenLabelXl)) {
      this.hiddenLabelXl = parameters.hiddenLabelXl;
    } else if (typeof parameters.hiddenLabelXl === "undefined") {
      this.hiddenLabelXl = [];
    } else {
      this.hiddenLabelXl = parameters.hiddenLabelXl; // never
    }

    if (Array.isArray(parameters.historyNote)) {
      this.historyNote = parameters.historyNote;
    } else if (typeof parameters.historyNote === "undefined") {
      this.historyNote = [];
    } else {
      this.historyNote = parameters.historyNote; // never
    }

    if (purify.Maybe.isMaybe(parameters.modified)) {
      this.modified = parameters.modified;
    } else if (
      typeof parameters.modified === "object" &&
      parameters.modified instanceof Date
    ) {
      this.modified = purify.Maybe.of(parameters.modified);
    } else if (typeof parameters.modified === "undefined") {
      this.modified = purify.Maybe.empty();
    } else {
      this.modified = parameters.modified; // never
    }

    if (Array.isArray(parameters.notation)) {
      this.notation = parameters.notation;
    } else if (typeof parameters.notation === "undefined") {
      this.notation = [];
    } else {
      this.notation = parameters.notation; // never
    }

    if (Array.isArray(parameters.note)) {
      this.note = parameters.note;
    } else if (typeof parameters.note === "undefined") {
      this.note = [];
    } else {
      this.note = parameters.note; // never
    }

    if (Array.isArray(parameters.prefLabel)) {
      this.prefLabel = parameters.prefLabel;
    } else if (typeof parameters.prefLabel === "undefined") {
      this.prefLabel = [];
    } else {
      this.prefLabel = parameters.prefLabel; // never
    }

    if (Array.isArray(parameters.prefLabelXl)) {
      this.prefLabelXl = parameters.prefLabelXl;
    } else if (typeof parameters.prefLabelXl === "undefined") {
      this.prefLabelXl = [];
    } else {
      this.prefLabelXl = parameters.prefLabelXl; // never
    }

    if (Array.isArray(parameters.scopeNote)) {
      this.scopeNote = parameters.scopeNote;
    } else if (typeof parameters.scopeNote === "undefined") {
      this.scopeNote = [];
    } else {
      this.scopeNote = parameters.scopeNote; // never
    }
  }

  equals(other: Resource): purifyHelpers.Equatable.EqualsResult {
    return ((left, right) =>
      purifyHelpers.Arrays.equals(
        left,
        right,
        purifyHelpers.Equatable.booleanEquals,
      ))(this.altLabel, other.altLabel)
      .mapLeft((propertyValuesUnequal) => ({
        left: this,
        right: other,
        propertyName: "altLabel",
        propertyValuesUnequal,
        type: "Property" as const,
      }))
      .chain(() =>
        purifyHelpers.Equatable.arrayEquals(
          this.altLabelXl,
          other.altLabelXl,
        ).mapLeft((propertyValuesUnequal) => ({
          left: this,
          right: other,
          propertyName: "altLabelXl",
          propertyValuesUnequal,
          type: "Property" as const,
        })),
      )
      .chain(() =>
        ((left, right) =>
          purifyHelpers.Arrays.equals(
            left,
            right,
            purifyHelpers.Equatable.booleanEquals,
          ))(this.changeNote, other.changeNote).mapLeft(
          (propertyValuesUnequal) => ({
            left: this,
            right: other,
            propertyName: "changeNote",
            propertyValuesUnequal,
            type: "Property" as const,
          }),
        ),
      )
      .chain(() =>
        ((left, right) =>
          purifyHelpers.Arrays.equals(
            left,
            right,
            purifyHelpers.Equatable.booleanEquals,
          ))(this.definition, other.definition).mapLeft(
          (propertyValuesUnequal) => ({
            left: this,
            right: other,
            propertyName: "definition",
            propertyValuesUnequal,
            type: "Property" as const,
          }),
        ),
      )
      .chain(() =>
        ((left, right) =>
          purifyHelpers.Arrays.equals(
            left,
            right,
            purifyHelpers.Equatable.booleanEquals,
          ))(this.editorialNote, other.editorialNote).mapLeft(
          (propertyValuesUnequal) => ({
            left: this,
            right: other,
            propertyName: "editorialNote",
            propertyValuesUnequal,
            type: "Property" as const,
          }),
        ),
      )
      .chain(() =>
        ((left, right) =>
          purifyHelpers.Arrays.equals(
            left,
            right,
            purifyHelpers.Equatable.booleanEquals,
          ))(this.example, other.example).mapLeft((propertyValuesUnequal) => ({
          left: this,
          right: other,
          propertyName: "example",
          propertyValuesUnequal,
          type: "Property" as const,
        })),
      )
      .chain(() =>
        ((left, right) =>
          purifyHelpers.Arrays.equals(
            left,
            right,
            purifyHelpers.Equatable.booleanEquals,
          ))(this.hiddenLabel, other.hiddenLabel).mapLeft(
          (propertyValuesUnequal) => ({
            left: this,
            right: other,
            propertyName: "hiddenLabel",
            propertyValuesUnequal,
            type: "Property" as const,
          }),
        ),
      )
      .chain(() =>
        purifyHelpers.Equatable.arrayEquals(
          this.hiddenLabelXl,
          other.hiddenLabelXl,
        ).mapLeft((propertyValuesUnequal) => ({
          left: this,
          right: other,
          propertyName: "hiddenLabelXl",
          propertyValuesUnequal,
          type: "Property" as const,
        })),
      )
      .chain(() =>
        ((left, right) =>
          purifyHelpers.Arrays.equals(
            left,
            right,
            purifyHelpers.Equatable.booleanEquals,
          ))(this.historyNote, other.historyNote).mapLeft(
          (propertyValuesUnequal) => ({
            left: this,
            right: other,
            propertyName: "historyNote",
            propertyValuesUnequal,
            type: "Property" as const,
          }),
        ),
      )
      .chain(() =>
        purifyHelpers.Equatable.booleanEquals(
          this.identifier,
          other.identifier,
        ).mapLeft((propertyValuesUnequal) => ({
          left: this,
          right: other,
          propertyName: "identifier",
          propertyValuesUnequal,
          type: "Property" as const,
        })),
      )
      .chain(() =>
        ((left, right) =>
          purifyHelpers.Maybes.equals(left, right, (left, right) =>
            purifyHelpers.Equatable.EqualsResult.fromBooleanEqualsResult(
              left,
              right,
              left.getTime() === right.getTime(),
            ),
          ))(this.modified, other.modified).mapLeft(
          (propertyValuesUnequal) => ({
            left: this,
            right: other,
            propertyName: "modified",
            propertyValuesUnequal,
            type: "Property" as const,
          }),
        ),
      )
      .chain(() =>
        ((left, right) =>
          purifyHelpers.Arrays.equals(
            left,
            right,
            purifyHelpers.Equatable.booleanEquals,
          ))(this.notation, other.notation).mapLeft(
          (propertyValuesUnequal) => ({
            left: this,
            right: other,
            propertyName: "notation",
            propertyValuesUnequal,
            type: "Property" as const,
          }),
        ),
      )
      .chain(() =>
        ((left, right) =>
          purifyHelpers.Arrays.equals(
            left,
            right,
            purifyHelpers.Equatable.booleanEquals,
          ))(this.note, other.note).mapLeft((propertyValuesUnequal) => ({
          left: this,
          right: other,
          propertyName: "note",
          propertyValuesUnequal,
          type: "Property" as const,
        })),
      )
      .chain(() =>
        ((left, right) =>
          purifyHelpers.Arrays.equals(
            left,
            right,
            purifyHelpers.Equatable.booleanEquals,
          ))(this.prefLabel, other.prefLabel).mapLeft(
          (propertyValuesUnequal) => ({
            left: this,
            right: other,
            propertyName: "prefLabel",
            propertyValuesUnequal,
            type: "Property" as const,
          }),
        ),
      )
      .chain(() =>
        purifyHelpers.Equatable.arrayEquals(
          this.prefLabelXl,
          other.prefLabelXl,
        ).mapLeft((propertyValuesUnequal) => ({
          left: this,
          right: other,
          propertyName: "prefLabelXl",
          propertyValuesUnequal,
          type: "Property" as const,
        })),
      )
      .chain(() =>
        ((left, right) =>
          purifyHelpers.Arrays.equals(
            left,
            right,
            purifyHelpers.Equatable.booleanEquals,
          ))(this.scopeNote, other.scopeNote).mapLeft(
          (propertyValuesUnequal) => ({
            left: this,
            right: other,
            propertyName: "scopeNote",
            propertyValuesUnequal,
            type: "Property" as const,
          }),
        ),
      )
      .chain(() =>
        purifyHelpers.Equatable.strictEquals(this.type, other.type).mapLeft(
          (propertyValuesUnequal) => ({
            left: this,
            right: other,
            propertyName: "type",
            propertyValuesUnequal,
            type: "Property" as const,
          }),
        ),
      );
  }

  hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(_hasher: HasherT): HasherT {
    for (const _element0 of this.altLabel) {
      _hasher.update(_element0.value);
    }

    for (const _element0 of this.altLabelXl) {
      _element0.hash(_hasher);
    }

    for (const _element0 of this.changeNote) {
      _hasher.update(_element0.value);
    }

    for (const _element0 of this.definition) {
      _hasher.update(_element0.value);
    }

    for (const _element0 of this.editorialNote) {
      _hasher.update(_element0.value);
    }

    for (const _element0 of this.example) {
      _hasher.update(_element0.value);
    }

    for (const _element0 of this.hiddenLabel) {
      _hasher.update(_element0.value);
    }

    for (const _element0 of this.hiddenLabelXl) {
      _element0.hash(_hasher);
    }

    for (const _element0 of this.historyNote) {
      _hasher.update(_element0.value);
    }

    this.modified.ifJust((_value0) => {
      _hasher.update(_value0.toISOString());
    });
    for (const _element0 of this.notation) {
      _hasher.update(_element0.value);
    }

    for (const _element0 of this.note) {
      _hasher.update(_element0.value);
    }

    for (const _element0 of this.prefLabel) {
      _hasher.update(_element0.value);
    }

    for (const _element0 of this.prefLabelXl) {
      _element0.hash(_hasher);
    }

    for (const _element0 of this.scopeNote) {
      _hasher.update(_element0.value);
    }

    return _hasher;
  }

  toJson(): {
    readonly altLabel: readonly (
      | string
      | {
          "@language": string | undefined;
          "@type": string | undefined;
          "@value": string;
        }
    )[];
    readonly altLabelXl: readonly ReturnType<LabelStub["toJson"]>[];
    readonly changeNote: readonly (
      | string
      | {
          "@language": string | undefined;
          "@type": string | undefined;
          "@value": string;
        }
    )[];
    readonly definition: readonly (
      | string
      | {
          "@language": string | undefined;
          "@type": string | undefined;
          "@value": string;
        }
    )[];
    readonly editorialNote: readonly (
      | string
      | {
          "@language": string | undefined;
          "@type": string | undefined;
          "@value": string;
        }
    )[];
    readonly example: readonly (
      | string
      | {
          "@language": string | undefined;
          "@type": string | undefined;
          "@value": string;
        }
    )[];
    readonly hiddenLabel: readonly (
      | string
      | {
          "@language": string | undefined;
          "@type": string | undefined;
          "@value": string;
        }
    )[];
    readonly hiddenLabelXl: readonly ReturnType<LabelStub["toJson"]>[];
    readonly historyNote: readonly (
      | string
      | {
          "@language": string | undefined;
          "@type": string | undefined;
          "@value": string;
        }
    )[];
    readonly "@id": string;
    readonly modified: string | undefined;
    readonly notation: readonly (
      | string
      | {
          "@language": string | undefined;
          "@type": string | undefined;
          "@value": string;
        }
    )[];
    readonly note: readonly (
      | string
      | {
          "@language": string | undefined;
          "@type": string | undefined;
          "@value": string;
        }
    )[];
    readonly prefLabel: readonly (
      | string
      | {
          "@language": string | undefined;
          "@type": string | undefined;
          "@value": string;
        }
    )[];
    readonly prefLabelXl: readonly ReturnType<LabelStub["toJson"]>[];
    readonly scopeNote: readonly (
      | string
      | {
          "@language": string | undefined;
          "@type": string | undefined;
          "@value": string;
        }
    )[];
    readonly type: string;
  } {
    return JSON.parse(
      JSON.stringify({
        altLabel: this.altLabel.map((_item) =>
          _item.datatype.value === "http://www.w3.org/2001/XMLSchema#string" &&
          _item.language.length === 0
            ? _item.value
            : {
                "@language":
                  _item.language.length > 0 ? _item.language : undefined,
                "@type":
                  _item.datatype.value !==
                  "http://www.w3.org/2001/XMLSchema#string"
                    ? _item.datatype.value
                    : undefined,
                "@value": _item.value,
              },
        ),
        altLabelXl: this.altLabelXl.map((_item) => _item.toJson()),
        changeNote: this.changeNote.map((_item) =>
          _item.datatype.value === "http://www.w3.org/2001/XMLSchema#string" &&
          _item.language.length === 0
            ? _item.value
            : {
                "@language":
                  _item.language.length > 0 ? _item.language : undefined,
                "@type":
                  _item.datatype.value !==
                  "http://www.w3.org/2001/XMLSchema#string"
                    ? _item.datatype.value
                    : undefined,
                "@value": _item.value,
              },
        ),
        definition: this.definition.map((_item) =>
          _item.datatype.value === "http://www.w3.org/2001/XMLSchema#string" &&
          _item.language.length === 0
            ? _item.value
            : {
                "@language":
                  _item.language.length > 0 ? _item.language : undefined,
                "@type":
                  _item.datatype.value !==
                  "http://www.w3.org/2001/XMLSchema#string"
                    ? _item.datatype.value
                    : undefined,
                "@value": _item.value,
              },
        ),
        editorialNote: this.editorialNote.map((_item) =>
          _item.datatype.value === "http://www.w3.org/2001/XMLSchema#string" &&
          _item.language.length === 0
            ? _item.value
            : {
                "@language":
                  _item.language.length > 0 ? _item.language : undefined,
                "@type":
                  _item.datatype.value !==
                  "http://www.w3.org/2001/XMLSchema#string"
                    ? _item.datatype.value
                    : undefined,
                "@value": _item.value,
              },
        ),
        example: this.example.map((_item) =>
          _item.datatype.value === "http://www.w3.org/2001/XMLSchema#string" &&
          _item.language.length === 0
            ? _item.value
            : {
                "@language":
                  _item.language.length > 0 ? _item.language : undefined,
                "@type":
                  _item.datatype.value !==
                  "http://www.w3.org/2001/XMLSchema#string"
                    ? _item.datatype.value
                    : undefined,
                "@value": _item.value,
              },
        ),
        hiddenLabel: this.hiddenLabel.map((_item) =>
          _item.datatype.value === "http://www.w3.org/2001/XMLSchema#string" &&
          _item.language.length === 0
            ? _item.value
            : {
                "@language":
                  _item.language.length > 0 ? _item.language : undefined,
                "@type":
                  _item.datatype.value !==
                  "http://www.w3.org/2001/XMLSchema#string"
                    ? _item.datatype.value
                    : undefined,
                "@value": _item.value,
              },
        ),
        hiddenLabelXl: this.hiddenLabelXl.map((_item) => _item.toJson()),
        historyNote: this.historyNote.map((_item) =>
          _item.datatype.value === "http://www.w3.org/2001/XMLSchema#string" &&
          _item.language.length === 0
            ? _item.value
            : {
                "@language":
                  _item.language.length > 0 ? _item.language : undefined,
                "@type":
                  _item.datatype.value !==
                  "http://www.w3.org/2001/XMLSchema#string"
                    ? _item.datatype.value
                    : undefined,
                "@value": _item.value,
              },
        ),
        "@id": this.identifier.value,
        modified: this.modified.map((_item) => _item.toISOString()).extract(),
        notation: this.notation.map((_item) =>
          _item.datatype.value === "http://www.w3.org/2001/XMLSchema#string" &&
          _item.language.length === 0
            ? _item.value
            : {
                "@language":
                  _item.language.length > 0 ? _item.language : undefined,
                "@type":
                  _item.datatype.value !==
                  "http://www.w3.org/2001/XMLSchema#string"
                    ? _item.datatype.value
                    : undefined,
                "@value": _item.value,
              },
        ),
        note: this.note.map((_item) =>
          _item.datatype.value === "http://www.w3.org/2001/XMLSchema#string" &&
          _item.language.length === 0
            ? _item.value
            : {
                "@language":
                  _item.language.length > 0 ? _item.language : undefined,
                "@type":
                  _item.datatype.value !==
                  "http://www.w3.org/2001/XMLSchema#string"
                    ? _item.datatype.value
                    : undefined,
                "@value": _item.value,
              },
        ),
        prefLabel: this.prefLabel.map((_item) =>
          _item.datatype.value === "http://www.w3.org/2001/XMLSchema#string" &&
          _item.language.length === 0
            ? _item.value
            : {
                "@language":
                  _item.language.length > 0 ? _item.language : undefined,
                "@type":
                  _item.datatype.value !==
                  "http://www.w3.org/2001/XMLSchema#string"
                    ? _item.datatype.value
                    : undefined,
                "@value": _item.value,
              },
        ),
        prefLabelXl: this.prefLabelXl.map((_item) => _item.toJson()),
        scopeNote: this.scopeNote.map((_item) =>
          _item.datatype.value === "http://www.w3.org/2001/XMLSchema#string" &&
          _item.language.length === 0
            ? _item.value
            : {
                "@language":
                  _item.language.length > 0 ? _item.language : undefined,
                "@type":
                  _item.datatype.value !==
                  "http://www.w3.org/2001/XMLSchema#string"
                    ? _item.datatype.value
                    : undefined,
                "@value": _item.value,
              },
        ),
        type: this.type,
      } satisfies ReturnType<Resource["toJson"]>),
    );
  }

  toRdf({
    mutateGraph,
    resourceSet,
  }: {
    ignoreRdfType?: boolean;
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource<rdfjs.NamedNode> {
    const _resource = resourceSet.mutableNamedResource({
      identifier: this.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#altLabel"),
      this.altLabel,
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#altLabel"),
      this.altLabelXl.map((_value) =>
        _value.toRdf({ mutateGraph: mutateGraph, resourceSet: resourceSet }),
      ),
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#changeNote"),
      this.changeNote,
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#definition"),
      this.definition,
    );
    _resource.add(
      dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#editorialNote",
      ),
      this.editorialNote,
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#example"),
      this.example,
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#hiddenLabel"),
      this.hiddenLabel,
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#hiddenLabel"),
      this.hiddenLabelXl.map((_value) =>
        _value.toRdf({ mutateGraph: mutateGraph, resourceSet: resourceSet }),
      ),
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#historyNote"),
      this.historyNote,
    );
    _resource.add(
      dataFactory.namedNode("http://purl.org/dc/terms/modified"),
      this.modified,
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#notation"),
      this.notation,
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#notation"),
      this.note,
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#prefLabel"),
      this.prefLabel,
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#prefLabel"),
      this.prefLabelXl.map((_value) =>
        _value.toRdf({ mutateGraph: mutateGraph, resourceSet: resourceSet }),
      ),
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#scopeNote"),
      this.scopeNote,
    );
    return _resource;
  }

  toString(): string {
    return JSON.stringify(this.toJson());
  }
}

namespace Resource {
  export function interfaceFromRdf({
    ignoreRdfType: _ignoreRdfType,
    languageIn: _languageIn,
    resource: _resource,
    // @ts-ignore
    ..._context
  }: {
    [_index: string]: any;
    ignoreRdfType?: boolean;
    languageIn?: readonly string[];
    resource: rdfjsResource.Resource<rdfjs.NamedNode>;
  }): purify.Either<
    rdfjsResource.Resource.ValueError,
    {
      altLabel: readonly rdfjs.Literal[];
      altLabelXl: readonly LabelStub[];
      changeNote: readonly rdfjs.Literal[];
      definition: readonly rdfjs.Literal[];
      editorialNote: readonly rdfjs.Literal[];
      example: readonly rdfjs.Literal[];
      hiddenLabel: readonly rdfjs.Literal[];
      hiddenLabelXl: readonly LabelStub[];
      historyNote: readonly rdfjs.Literal[];
      identifier: rdfjs.NamedNode;
      modified: purify.Maybe<Date>;
      notation: readonly rdfjs.Literal[];
      note: readonly rdfjs.Literal[];
      prefLabel: readonly rdfjs.Literal[];
      prefLabelXl: readonly LabelStub[];
      scopeNote: readonly rdfjs.Literal[];
    }
  > {
    const _altLabelEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ..._resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#altLabel"),
          { unique: true },
        )
        .flatMap((_value) =>
          _value
            .toValues()
            .filter((_value) => {
              const _languageInOrDefault = _languageIn ?? [];
              if (_languageInOrDefault.length === 0) {
                return true;
              }
              const _valueLiteral = _value.toLiteral().toMaybe().extract();
              if (typeof _valueLiteral === "undefined") {
                return false;
              }
              return _languageInOrDefault.some(
                (_languageIn) => _languageIn === _valueLiteral.language,
              );
            })
            .head()
            .chain((_value) => _value.toLiteral())
            .toMaybe()
            .toList(),
        ),
    ]);
    if (_altLabelEither.isLeft()) {
      return _altLabelEither;
    }

    const altLabel = _altLabelEither.unsafeCoerce();
    const _altLabelXlEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly LabelStub[]
    > = purify.Either.of([
      ..._resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#altLabel"),
          { unique: true },
        )
        .flatMap((_value) =>
          _value
            .toValues()
            .head()
            .chain((value) => value.toResource())
            .chain((_resource) =>
              LabelStub.fromRdf({
                ..._context,
                languageIn: _languageIn,
                resource: _resource,
              }),
            )
            .toMaybe()
            .toList(),
        ),
    ]);
    if (_altLabelXlEither.isLeft()) {
      return _altLabelXlEither;
    }

    const altLabelXl = _altLabelXlEither.unsafeCoerce();
    const _changeNoteEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ..._resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#changeNote",
          ),
          { unique: true },
        )
        .flatMap((_value) =>
          _value
            .toValues()
            .filter((_value) => {
              const _languageInOrDefault = _languageIn ?? [];
              if (_languageInOrDefault.length === 0) {
                return true;
              }
              const _valueLiteral = _value.toLiteral().toMaybe().extract();
              if (typeof _valueLiteral === "undefined") {
                return false;
              }
              return _languageInOrDefault.some(
                (_languageIn) => _languageIn === _valueLiteral.language,
              );
            })
            .head()
            .chain((_value) => _value.toLiteral())
            .toMaybe()
            .toList(),
        ),
    ]);
    if (_changeNoteEither.isLeft()) {
      return _changeNoteEither;
    }

    const changeNote = _changeNoteEither.unsafeCoerce();
    const _definitionEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ..._resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#definition",
          ),
          { unique: true },
        )
        .flatMap((_value) =>
          _value
            .toValues()
            .filter((_value) => {
              const _languageInOrDefault = _languageIn ?? [];
              if (_languageInOrDefault.length === 0) {
                return true;
              }
              const _valueLiteral = _value.toLiteral().toMaybe().extract();
              if (typeof _valueLiteral === "undefined") {
                return false;
              }
              return _languageInOrDefault.some(
                (_languageIn) => _languageIn === _valueLiteral.language,
              );
            })
            .head()
            .chain((_value) => _value.toLiteral())
            .toMaybe()
            .toList(),
        ),
    ]);
    if (_definitionEither.isLeft()) {
      return _definitionEither;
    }

    const definition = _definitionEither.unsafeCoerce();
    const _editorialNoteEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ..._resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#editorialNote",
          ),
          { unique: true },
        )
        .flatMap((_value) =>
          _value
            .toValues()
            .filter((_value) => {
              const _languageInOrDefault = _languageIn ?? [];
              if (_languageInOrDefault.length === 0) {
                return true;
              }
              const _valueLiteral = _value.toLiteral().toMaybe().extract();
              if (typeof _valueLiteral === "undefined") {
                return false;
              }
              return _languageInOrDefault.some(
                (_languageIn) => _languageIn === _valueLiteral.language,
              );
            })
            .head()
            .chain((_value) => _value.toLiteral())
            .toMaybe()
            .toList(),
        ),
    ]);
    if (_editorialNoteEither.isLeft()) {
      return _editorialNoteEither;
    }

    const editorialNote = _editorialNoteEither.unsafeCoerce();
    const _exampleEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ..._resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#example"),
          { unique: true },
        )
        .flatMap((_value) =>
          _value
            .toValues()
            .filter((_value) => {
              const _languageInOrDefault = _languageIn ?? [];
              if (_languageInOrDefault.length === 0) {
                return true;
              }
              const _valueLiteral = _value.toLiteral().toMaybe().extract();
              if (typeof _valueLiteral === "undefined") {
                return false;
              }
              return _languageInOrDefault.some(
                (_languageIn) => _languageIn === _valueLiteral.language,
              );
            })
            .head()
            .chain((_value) => _value.toLiteral())
            .toMaybe()
            .toList(),
        ),
    ]);
    if (_exampleEither.isLeft()) {
      return _exampleEither;
    }

    const example = _exampleEither.unsafeCoerce();
    const _hiddenLabelEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ..._resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#hiddenLabel",
          ),
          { unique: true },
        )
        .flatMap((_value) =>
          _value
            .toValues()
            .filter((_value) => {
              const _languageInOrDefault = _languageIn ?? [];
              if (_languageInOrDefault.length === 0) {
                return true;
              }
              const _valueLiteral = _value.toLiteral().toMaybe().extract();
              if (typeof _valueLiteral === "undefined") {
                return false;
              }
              return _languageInOrDefault.some(
                (_languageIn) => _languageIn === _valueLiteral.language,
              );
            })
            .head()
            .chain((_value) => _value.toLiteral())
            .toMaybe()
            .toList(),
        ),
    ]);
    if (_hiddenLabelEither.isLeft()) {
      return _hiddenLabelEither;
    }

    const hiddenLabel = _hiddenLabelEither.unsafeCoerce();
    const _hiddenLabelXlEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly LabelStub[]
    > = purify.Either.of([
      ..._resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2008/05/skos-xl#hiddenLabel",
          ),
          { unique: true },
        )
        .flatMap((_value) =>
          _value
            .toValues()
            .head()
            .chain((value) => value.toResource())
            .chain((_resource) =>
              LabelStub.fromRdf({
                ..._context,
                languageIn: _languageIn,
                resource: _resource,
              }),
            )
            .toMaybe()
            .toList(),
        ),
    ]);
    if (_hiddenLabelXlEither.isLeft()) {
      return _hiddenLabelXlEither;
    }

    const hiddenLabelXl = _hiddenLabelXlEither.unsafeCoerce();
    const _historyNoteEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ..._resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#historyNote",
          ),
          { unique: true },
        )
        .flatMap((_value) =>
          _value
            .toValues()
            .filter((_value) => {
              const _languageInOrDefault = _languageIn ?? [];
              if (_languageInOrDefault.length === 0) {
                return true;
              }
              const _valueLiteral = _value.toLiteral().toMaybe().extract();
              if (typeof _valueLiteral === "undefined") {
                return false;
              }
              return _languageInOrDefault.some(
                (_languageIn) => _languageIn === _valueLiteral.language,
              );
            })
            .head()
            .chain((_value) => _value.toLiteral())
            .toMaybe()
            .toList(),
        ),
    ]);
    if (_historyNoteEither.isLeft()) {
      return _historyNoteEither;
    }

    const historyNote = _historyNoteEither.unsafeCoerce();
    const identifier = _resource.identifier;
    const _modifiedEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      purify.Maybe<Date>
    > = purify.Either.of(
      _resource
        .values(dataFactory.namedNode("http://purl.org/dc/terms/modified"), {
          unique: true,
        })
        .head()
        .chain((_value) => _value.toDate())
        .toMaybe(),
    );
    if (_modifiedEither.isLeft()) {
      return _modifiedEither;
    }

    const modified = _modifiedEither.unsafeCoerce();
    const _notationEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ..._resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#notation"),
          { unique: true },
        )
        .flatMap((_value) =>
          _value
            .toValues()
            .filter((_value) => {
              const _languageInOrDefault = _languageIn ?? [];
              if (_languageInOrDefault.length === 0) {
                return true;
              }
              const _valueLiteral = _value.toLiteral().toMaybe().extract();
              if (typeof _valueLiteral === "undefined") {
                return false;
              }
              return _languageInOrDefault.some(
                (_languageIn) => _languageIn === _valueLiteral.language,
              );
            })
            .head()
            .chain((_value) => _value.toLiteral())
            .toMaybe()
            .toList(),
        ),
    ]);
    if (_notationEither.isLeft()) {
      return _notationEither;
    }

    const notation = _notationEither.unsafeCoerce();
    const _noteEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ..._resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#notation"),
          { unique: true },
        )
        .flatMap((_value) =>
          _value
            .toValues()
            .filter((_value) => {
              const _languageInOrDefault = _languageIn ?? [];
              if (_languageInOrDefault.length === 0) {
                return true;
              }
              const _valueLiteral = _value.toLiteral().toMaybe().extract();
              if (typeof _valueLiteral === "undefined") {
                return false;
              }
              return _languageInOrDefault.some(
                (_languageIn) => _languageIn === _valueLiteral.language,
              );
            })
            .head()
            .chain((_value) => _value.toLiteral())
            .toMaybe()
            .toList(),
        ),
    ]);
    if (_noteEither.isLeft()) {
      return _noteEither;
    }

    const note = _noteEither.unsafeCoerce();
    const _prefLabelEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ..._resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#prefLabel",
          ),
          { unique: true },
        )
        .flatMap((_value) =>
          _value
            .toValues()
            .filter((_value) => {
              const _languageInOrDefault = _languageIn ?? [];
              if (_languageInOrDefault.length === 0) {
                return true;
              }
              const _valueLiteral = _value.toLiteral().toMaybe().extract();
              if (typeof _valueLiteral === "undefined") {
                return false;
              }
              return _languageInOrDefault.some(
                (_languageIn) => _languageIn === _valueLiteral.language,
              );
            })
            .head()
            .chain((_value) => _value.toLiteral())
            .toMaybe()
            .toList(),
        ),
    ]);
    if (_prefLabelEither.isLeft()) {
      return _prefLabelEither;
    }

    const prefLabel = _prefLabelEither.unsafeCoerce();
    const _prefLabelXlEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly LabelStub[]
    > = purify.Either.of([
      ..._resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#prefLabel"),
          { unique: true },
        )
        .flatMap((_value) =>
          _value
            .toValues()
            .head()
            .chain((value) => value.toResource())
            .chain((_resource) =>
              LabelStub.fromRdf({
                ..._context,
                languageIn: _languageIn,
                resource: _resource,
              }),
            )
            .toMaybe()
            .toList(),
        ),
    ]);
    if (_prefLabelXlEither.isLeft()) {
      return _prefLabelXlEither;
    }

    const prefLabelXl = _prefLabelXlEither.unsafeCoerce();
    const _scopeNoteEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ..._resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#scopeNote",
          ),
          { unique: true },
        )
        .flatMap((_value) =>
          _value
            .toValues()
            .filter((_value) => {
              const _languageInOrDefault = _languageIn ?? [];
              if (_languageInOrDefault.length === 0) {
                return true;
              }
              const _valueLiteral = _value.toLiteral().toMaybe().extract();
              if (typeof _valueLiteral === "undefined") {
                return false;
              }
              return _languageInOrDefault.some(
                (_languageIn) => _languageIn === _valueLiteral.language,
              );
            })
            .head()
            .chain((_value) => _value.toLiteral())
            .toMaybe()
            .toList(),
        ),
    ]);
    if (_scopeNoteEither.isLeft()) {
      return _scopeNoteEither;
    }

    const scopeNote = _scopeNoteEither.unsafeCoerce();
    return purify.Either.of({
      altLabel,
      altLabelXl,
      changeNote,
      definition,
      editorialNote,
      example,
      hiddenLabel,
      hiddenLabelXl,
      historyNote,
      identifier,
      modified,
      notation,
      note,
      prefLabel,
      prefLabelXl,
      scopeNote,
    });
  }

  export class SparqlGraphPatterns extends sparqlBuilder.ResourceGraphPatterns {
    constructor(
      subject: sparqlBuilder.ResourceGraphPatterns.SubjectParameter,
      _options?: { ignoreRdfType?: boolean },
    ) {
      super(subject);
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#altLabel",
            ),
            this.variable("AltLabel"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.group(
            sparqlBuilder.GraphPattern.basic(
              this.subject,
              dataFactory.namedNode(
                "http://www.w3.org/2008/05/skos-xl#altLabel",
              ),
              this.variable("AltLabelXl"),
            ).chainObject(
              (_object) => new LabelStub.SparqlGraphPatterns(_object),
            ),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#changeNote",
            ),
            this.variable("ChangeNote"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#definition",
            ),
            this.variable("Definition"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#editorialNote",
            ),
            this.variable("EditorialNote"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#example",
            ),
            this.variable("Example"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#hiddenLabel",
            ),
            this.variable("HiddenLabel"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.group(
            sparqlBuilder.GraphPattern.basic(
              this.subject,
              dataFactory.namedNode(
                "http://www.w3.org/2008/05/skos-xl#hiddenLabel",
              ),
              this.variable("HiddenLabelXl"),
            ).chainObject(
              (_object) => new LabelStub.SparqlGraphPatterns(_object),
            ),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#historyNote",
            ),
            this.variable("HistoryNote"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode("http://purl.org/dc/terms/modified"),
            this.variable("Modified"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#notation",
            ),
            this.variable("Notation"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#notation",
            ),
            this.variable("Note"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#prefLabel",
            ),
            this.variable("PrefLabel"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.group(
            sparqlBuilder.GraphPattern.basic(
              this.subject,
              dataFactory.namedNode(
                "http://www.w3.org/2008/05/skos-xl#prefLabel",
              ),
              this.variable("PrefLabelXl"),
            ).chainObject(
              (_object) => new LabelStub.SparqlGraphPatterns(_object),
            ),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#scopeNote",
            ),
            this.variable("ScopeNote"),
          ),
        ),
      );
    }
  }
}
export class Label {
  private _identifier: rdfjs.BlankNode | rdfjs.NamedNode | undefined;
  readonly literalForm: readonly rdfjs.Literal[];
  readonly type = "Label";

  constructor(parameters: {
    readonly identifier?: rdfjs.BlankNode | rdfjs.NamedNode;
    readonly literalForm: readonly rdfjs.Literal[];
  }) {
    this._identifier = parameters.identifier;
    this.literalForm = parameters.literalForm;
  }

  get identifier(): rdfjs.BlankNode | rdfjs.NamedNode {
    if (typeof this._identifier === "undefined") {
      this._identifier = dataFactory.namedNode(
        `urn:shaclmate:object:${this.type}:${this.hash(sha256.create())}`,
      );
    }
    return this._identifier;
  }

  equals(other: Label): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.booleanEquals(
      this.identifier,
      other.identifier,
    )
      .mapLeft((propertyValuesUnequal) => ({
        left: this,
        right: other,
        propertyName: "identifier",
        propertyValuesUnequal,
        type: "Property" as const,
      }))
      .chain(() =>
        ((left, right) =>
          purifyHelpers.Arrays.equals(
            left,
            right,
            purifyHelpers.Equatable.booleanEquals,
          ))(this.literalForm, other.literalForm).mapLeft(
          (propertyValuesUnequal) => ({
            left: this,
            right: other,
            propertyName: "literalForm",
            propertyValuesUnequal,
            type: "Property" as const,
          }),
        ),
      )
      .chain(() =>
        purifyHelpers.Equatable.strictEquals(this.type, other.type).mapLeft(
          (propertyValuesUnequal) => ({
            left: this,
            right: other,
            propertyName: "type",
            propertyValuesUnequal,
            type: "Property" as const,
          }),
        ),
      );
  }

  hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(_hasher: HasherT): HasherT {
    for (const _element0 of this.literalForm) {
      _hasher.update(_element0.value);
    }

    return _hasher;
  }

  toJson(): {
    readonly "@id": string;
    readonly literalForm: readonly (
      | string
      | {
          "@language": string | undefined;
          "@type": string | undefined;
          "@value": string;
        }
    )[];
    readonly type: string;
  } {
    return JSON.parse(
      JSON.stringify({
        "@id": this.identifier.value,
        literalForm: this.literalForm.map((_item) =>
          _item.datatype.value === "http://www.w3.org/2001/XMLSchema#string" &&
          _item.language.length === 0
            ? _item.value
            : {
                "@language":
                  _item.language.length > 0 ? _item.language : undefined,
                "@type":
                  _item.datatype.value !==
                  "http://www.w3.org/2001/XMLSchema#string"
                    ? _item.datatype.value
                    : undefined,
                "@value": _item.value,
              },
        ),
        type: this.type,
      } satisfies ReturnType<Label["toJson"]>),
    );
  }

  toRdf({
    ignoreRdfType,
    mutateGraph,
    resourceSet,
  }: {
    ignoreRdfType?: boolean;
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: this.identifier,
      mutateGraph,
    });
    if (!ignoreRdfType) {
      _resource.add(
        _resource.dataFactory.namedNode(
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        ),
        _resource.dataFactory.namedNode(
          "http://www.w3.org/2008/05/skos-xl#Label",
        ),
      );
    }

    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#literalForm"),
      this.literalForm,
    );
    return _resource;
  }

  toString(): string {
    return JSON.stringify(this.toJson());
  }
}

export namespace Label {
  export function fromRdf({
    ignoreRdfType: _ignoreRdfType,
    languageIn: _languageIn,
    resource: _resource,
    // @ts-ignore
    ..._context
  }: {
    [_index: string]: any;
    ignoreRdfType?: boolean;
    languageIn?: readonly string[];
    resource: rdfjsResource.Resource;
  }): purify.Either<rdfjsResource.Resource.ValueError, Label> {
    if (
      !_ignoreRdfType &&
      !_resource.isInstanceOf(
        dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#Label"),
      )
    ) {
      return purify.Left(
        new rdfjsResource.Resource.ValueError({
          focusResource: _resource,
          message: `${rdfjsResource.Resource.Identifier.toString(_resource.identifier)} has unexpected RDF type`,
          predicate: dataFactory.namedNode(
            "http://www.w3.org/2008/05/skos-xl#Label",
          ),
        }),
      );
    }

    const identifier = _resource.identifier;
    const _literalFormEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ..._resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2008/05/skos-xl#literalForm",
          ),
          { unique: true },
        )
        .flatMap((_value) =>
          _value
            .toValues()
            .filter((_value) => {
              const _languageInOrDefault = _languageIn ?? [];
              if (_languageInOrDefault.length === 0) {
                return true;
              }
              const _valueLiteral = _value.toLiteral().toMaybe().extract();
              if (typeof _valueLiteral === "undefined") {
                return false;
              }
              return _languageInOrDefault.some(
                (_languageIn) => _languageIn === _valueLiteral.language,
              );
            })
            .head()
            .chain((_value) => _value.toLiteral())
            .toMaybe()
            .toList(),
        ),
    ]);
    if (_literalFormEither.isLeft()) {
      return _literalFormEither;
    }

    const literalForm = _literalFormEither.unsafeCoerce();
    return purify.Either.of(new Label({ identifier, literalForm }));
  }

  export class SparqlGraphPatterns extends sparqlBuilder.ResourceGraphPatterns {
    constructor(
      subject: sparqlBuilder.ResourceGraphPatterns.SubjectParameter,
      _options?: { ignoreRdfType?: boolean },
    ) {
      super(subject);
      if (!_options?.ignoreRdfType) {
        this.add(
          ...new sparqlBuilder.RdfTypeGraphPatterns(
            this.subject,
            dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#Label"),
          ),
        );
      }

      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode(
            "http://www.w3.org/2008/05/skos-xl#literalForm",
          ),
          this.variable("LiteralForm"),
        ),
      );
    }
  }
}
export class LabelStub {
  private _identifier: rdfjs.BlankNode | rdfjs.NamedNode | undefined;
  readonly literalForm: purify.Maybe<rdfjs.Literal>;
  readonly type = "LabelStub";

  constructor(parameters: {
    readonly identifier?: rdfjs.BlankNode | rdfjs.NamedNode;
    readonly literalForm?:
      | Date
      | boolean
      | number
      | purify.Maybe<rdfjs.Literal>
      | rdfjs.Literal
      | string;
  }) {
    this._identifier = parameters.identifier;
    if (purify.Maybe.isMaybe(parameters.literalForm)) {
      this.literalForm = parameters.literalForm;
    } else if (typeof parameters.literalForm === "boolean") {
      this.literalForm = purify.Maybe.of(
        rdfLiteral.toRdf(parameters.literalForm),
      );
    } else if (
      typeof parameters.literalForm === "object" &&
      parameters.literalForm instanceof Date
    ) {
      this.literalForm = purify.Maybe.of(
        rdfLiteral.toRdf(parameters.literalForm),
      );
    } else if (typeof parameters.literalForm === "number") {
      this.literalForm = purify.Maybe.of(
        rdfLiteral.toRdf(parameters.literalForm),
      );
    } else if (typeof parameters.literalForm === "string") {
      this.literalForm = purify.Maybe.of(
        dataFactory.literal(parameters.literalForm),
      );
    } else if (typeof parameters.literalForm === "object") {
      this.literalForm = purify.Maybe.of(parameters.literalForm);
    } else if (typeof parameters.literalForm === "undefined") {
      this.literalForm = purify.Maybe.empty();
    } else {
      this.literalForm = parameters.literalForm; // never
    }
  }

  get identifier(): rdfjs.BlankNode | rdfjs.NamedNode {
    if (typeof this._identifier === "undefined") {
      this._identifier = dataFactory.namedNode(
        `urn:shaclmate:object:${this.type}:${this.hash(sha256.create())}`,
      );
    }
    return this._identifier;
  }

  equals(other: LabelStub): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.booleanEquals(
      this.identifier,
      other.identifier,
    )
      .mapLeft((propertyValuesUnequal) => ({
        left: this,
        right: other,
        propertyName: "identifier",
        propertyValuesUnequal,
        type: "Property" as const,
      }))
      .chain(() =>
        ((left, right) =>
          purifyHelpers.Maybes.equals(
            left,
            right,
            purifyHelpers.Equatable.booleanEquals,
          ))(this.literalForm, other.literalForm).mapLeft(
          (propertyValuesUnequal) => ({
            left: this,
            right: other,
            propertyName: "literalForm",
            propertyValuesUnequal,
            type: "Property" as const,
          }),
        ),
      )
      .chain(() =>
        purifyHelpers.Equatable.strictEquals(this.type, other.type).mapLeft(
          (propertyValuesUnequal) => ({
            left: this,
            right: other,
            propertyName: "type",
            propertyValuesUnequal,
            type: "Property" as const,
          }),
        ),
      );
  }

  hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(_hasher: HasherT): HasherT {
    this.literalForm.ifJust((_value0) => {
      _hasher.update(_value0.value);
    });
    return _hasher;
  }

  toJson(): {
    readonly "@id": string;
    readonly literalForm:
      | (
          | string
          | {
              "@language": string | undefined;
              "@type": string | undefined;
              "@value": string;
            }
        )
      | undefined;
    readonly type: string;
  } {
    return JSON.parse(
      JSON.stringify({
        "@id": this.identifier.value,
        literalForm: this.literalForm
          .map((_item) =>
            _item.datatype.value ===
              "http://www.w3.org/2001/XMLSchema#string" &&
            _item.language.length === 0
              ? _item.value
              : {
                  "@language":
                    _item.language.length > 0 ? _item.language : undefined,
                  "@type":
                    _item.datatype.value !==
                    "http://www.w3.org/2001/XMLSchema#string"
                      ? _item.datatype.value
                      : undefined,
                  "@value": _item.value,
                },
          )
          .extract(),
        type: this.type,
      } satisfies ReturnType<LabelStub["toJson"]>),
    );
  }

  toRdf({
    ignoreRdfType,
    mutateGraph,
    resourceSet,
  }: {
    ignoreRdfType?: boolean;
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: this.identifier,
      mutateGraph,
    });
    if (!ignoreRdfType) {
      _resource.add(
        _resource.dataFactory.namedNode(
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        ),
        _resource.dataFactory.namedNode(
          "http://www.w3.org/2008/05/skos-xl#Label",
        ),
      );
    }

    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#literalForm"),
      this.literalForm,
    );
    return _resource;
  }

  toString(): string {
    return JSON.stringify(this.toJson());
  }
}

export namespace LabelStub {
  export function fromRdf({
    ignoreRdfType: _ignoreRdfType,
    languageIn: _languageIn,
    resource: _resource,
    // @ts-ignore
    ..._context
  }: {
    [_index: string]: any;
    ignoreRdfType?: boolean;
    languageIn?: readonly string[];
    resource: rdfjsResource.Resource;
  }): purify.Either<rdfjsResource.Resource.ValueError, LabelStub> {
    if (
      !_ignoreRdfType &&
      !_resource.isInstanceOf(
        dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#Label"),
      )
    ) {
      return purify.Left(
        new rdfjsResource.Resource.ValueError({
          focusResource: _resource,
          message: `${rdfjsResource.Resource.Identifier.toString(_resource.identifier)} has unexpected RDF type`,
          predicate: dataFactory.namedNode(
            "http://www.w3.org/2008/05/skos-xl#Label",
          ),
        }),
      );
    }

    const identifier = _resource.identifier;
    const _literalFormEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      purify.Maybe<rdfjs.Literal>
    > = purify.Either.of(
      _resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2008/05/skos-xl#literalForm",
          ),
          { unique: true },
        )
        .filter((_value) => {
          const _languageInOrDefault = _languageIn ?? [];
          if (_languageInOrDefault.length === 0) {
            return true;
          }
          const _valueLiteral = _value.toLiteral().toMaybe().extract();
          if (typeof _valueLiteral === "undefined") {
            return false;
          }
          return _languageInOrDefault.some(
            (_languageIn) => _languageIn === _valueLiteral.language,
          );
        })
        .head()
        .chain((_value) => _value.toLiteral())
        .toMaybe(),
    );
    if (_literalFormEither.isLeft()) {
      return _literalFormEither;
    }

    const literalForm = _literalFormEither.unsafeCoerce();
    return purify.Either.of(new LabelStub({ identifier, literalForm }));
  }

  export class SparqlGraphPatterns extends sparqlBuilder.ResourceGraphPatterns {
    constructor(
      subject: sparqlBuilder.ResourceGraphPatterns.SubjectParameter,
      _options?: { ignoreRdfType?: boolean },
    ) {
      super(subject);
      if (!_options?.ignoreRdfType) {
        this.add(
          ...new sparqlBuilder.RdfTypeGraphPatterns(
            this.subject,
            dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#Label"),
          ),
        );
      }

      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2008/05/skos-xl#literalForm",
            ),
            this.variable("LiteralForm"),
          ),
        ),
      );
    }
  }
}
export class Concept extends Resource {
  readonly broader: readonly ConceptStub[];
  readonly broaderTransitive: readonly ConceptStub[];
  readonly broadMatch: readonly ConceptStub[];
  readonly closeMatch: readonly ConceptStub[];
  readonly exactMatch: readonly ConceptStub[];
  private _identifier: rdfjs.NamedNode | undefined;
  readonly inScheme: readonly ConceptSchemeStub[];
  readonly mappingRelation: readonly ConceptStub[];
  readonly narrower: readonly ConceptStub[];
  readonly narrowerTransitive: readonly ConceptStub[];
  readonly narrowMatch: readonly ConceptStub[];
  readonly related: readonly ConceptStub[];
  readonly relatedMatch: readonly ConceptStub[];
  readonly semanticRelation: readonly ConceptStub[];
  readonly topConceptOf: readonly ConceptSchemeStub[];
  override readonly type = "Concept";

  constructor(
    parameters: {
      readonly broader?: readonly ConceptStub[];
      readonly broaderTransitive?: readonly ConceptStub[];
      readonly broadMatch?: readonly ConceptStub[];
      readonly closeMatch?: readonly ConceptStub[];
      readonly exactMatch?: readonly ConceptStub[];
      readonly identifier?: rdfjs.NamedNode;
      readonly inScheme?: readonly ConceptSchemeStub[];
      readonly mappingRelation?: readonly ConceptStub[];
      readonly narrower?: readonly ConceptStub[];
      readonly narrowerTransitive?: readonly ConceptStub[];
      readonly narrowMatch?: readonly ConceptStub[];
      readonly related?: readonly ConceptStub[];
      readonly relatedMatch?: readonly ConceptStub[];
      readonly semanticRelation?: readonly ConceptStub[];
      readonly topConceptOf?: readonly ConceptSchemeStub[];
    } & ConstructorParameters<typeof Resource>[0],
  ) {
    super(parameters);
    if (Array.isArray(parameters.broader)) {
      this.broader = parameters.broader;
    } else if (typeof parameters.broader === "undefined") {
      this.broader = [];
    } else {
      this.broader = parameters.broader; // never
    }

    if (Array.isArray(parameters.broaderTransitive)) {
      this.broaderTransitive = parameters.broaderTransitive;
    } else if (typeof parameters.broaderTransitive === "undefined") {
      this.broaderTransitive = [];
    } else {
      this.broaderTransitive = parameters.broaderTransitive; // never
    }

    if (Array.isArray(parameters.broadMatch)) {
      this.broadMatch = parameters.broadMatch;
    } else if (typeof parameters.broadMatch === "undefined") {
      this.broadMatch = [];
    } else {
      this.broadMatch = parameters.broadMatch; // never
    }

    if (Array.isArray(parameters.closeMatch)) {
      this.closeMatch = parameters.closeMatch;
    } else if (typeof parameters.closeMatch === "undefined") {
      this.closeMatch = [];
    } else {
      this.closeMatch = parameters.closeMatch; // never
    }

    if (Array.isArray(parameters.exactMatch)) {
      this.exactMatch = parameters.exactMatch;
    } else if (typeof parameters.exactMatch === "undefined") {
      this.exactMatch = [];
    } else {
      this.exactMatch = parameters.exactMatch; // never
    }

    this._identifier = parameters.identifier;
    if (Array.isArray(parameters.inScheme)) {
      this.inScheme = parameters.inScheme;
    } else if (typeof parameters.inScheme === "undefined") {
      this.inScheme = [];
    } else {
      this.inScheme = parameters.inScheme; // never
    }

    if (Array.isArray(parameters.mappingRelation)) {
      this.mappingRelation = parameters.mappingRelation;
    } else if (typeof parameters.mappingRelation === "undefined") {
      this.mappingRelation = [];
    } else {
      this.mappingRelation = parameters.mappingRelation; // never
    }

    if (Array.isArray(parameters.narrower)) {
      this.narrower = parameters.narrower;
    } else if (typeof parameters.narrower === "undefined") {
      this.narrower = [];
    } else {
      this.narrower = parameters.narrower; // never
    }

    if (Array.isArray(parameters.narrowerTransitive)) {
      this.narrowerTransitive = parameters.narrowerTransitive;
    } else if (typeof parameters.narrowerTransitive === "undefined") {
      this.narrowerTransitive = [];
    } else {
      this.narrowerTransitive = parameters.narrowerTransitive; // never
    }

    if (Array.isArray(parameters.narrowMatch)) {
      this.narrowMatch = parameters.narrowMatch;
    } else if (typeof parameters.narrowMatch === "undefined") {
      this.narrowMatch = [];
    } else {
      this.narrowMatch = parameters.narrowMatch; // never
    }

    if (Array.isArray(parameters.related)) {
      this.related = parameters.related;
    } else if (typeof parameters.related === "undefined") {
      this.related = [];
    } else {
      this.related = parameters.related; // never
    }

    if (Array.isArray(parameters.relatedMatch)) {
      this.relatedMatch = parameters.relatedMatch;
    } else if (typeof parameters.relatedMatch === "undefined") {
      this.relatedMatch = [];
    } else {
      this.relatedMatch = parameters.relatedMatch; // never
    }

    if (Array.isArray(parameters.semanticRelation)) {
      this.semanticRelation = parameters.semanticRelation;
    } else if (typeof parameters.semanticRelation === "undefined") {
      this.semanticRelation = [];
    } else {
      this.semanticRelation = parameters.semanticRelation; // never
    }

    if (Array.isArray(parameters.topConceptOf)) {
      this.topConceptOf = parameters.topConceptOf;
    } else if (typeof parameters.topConceptOf === "undefined") {
      this.topConceptOf = [];
    } else {
      this.topConceptOf = parameters.topConceptOf; // never
    }
  }

  override get identifier(): rdfjs.NamedNode {
    if (typeof this._identifier === "undefined") {
      this._identifier = dataFactory.namedNode(
        `urn:shaclmate:object:${this.type}:${this.hash(sha256.create())}`,
      );
    }
    return this._identifier;
  }

  override equals(other: Concept): purifyHelpers.Equatable.EqualsResult {
    return super
      .equals(other)
      .chain(() =>
        purifyHelpers.Equatable.arrayEquals(
          this.broader,
          other.broader,
        ).mapLeft((propertyValuesUnequal) => ({
          left: this,
          right: other,
          propertyName: "broader",
          propertyValuesUnequal,
          type: "Property" as const,
        })),
      )
      .chain(() =>
        purifyHelpers.Equatable.arrayEquals(
          this.broaderTransitive,
          other.broaderTransitive,
        ).mapLeft((propertyValuesUnequal) => ({
          left: this,
          right: other,
          propertyName: "broaderTransitive",
          propertyValuesUnequal,
          type: "Property" as const,
        })),
      )
      .chain(() =>
        purifyHelpers.Equatable.arrayEquals(
          this.broadMatch,
          other.broadMatch,
        ).mapLeft((propertyValuesUnequal) => ({
          left: this,
          right: other,
          propertyName: "broadMatch",
          propertyValuesUnequal,
          type: "Property" as const,
        })),
      )
      .chain(() =>
        purifyHelpers.Equatable.arrayEquals(
          this.closeMatch,
          other.closeMatch,
        ).mapLeft((propertyValuesUnequal) => ({
          left: this,
          right: other,
          propertyName: "closeMatch",
          propertyValuesUnequal,
          type: "Property" as const,
        })),
      )
      .chain(() =>
        purifyHelpers.Equatable.arrayEquals(
          this.exactMatch,
          other.exactMatch,
        ).mapLeft((propertyValuesUnequal) => ({
          left: this,
          right: other,
          propertyName: "exactMatch",
          propertyValuesUnequal,
          type: "Property" as const,
        })),
      )
      .chain(() =>
        purifyHelpers.Equatable.arrayEquals(
          this.inScheme,
          other.inScheme,
        ).mapLeft((propertyValuesUnequal) => ({
          left: this,
          right: other,
          propertyName: "inScheme",
          propertyValuesUnequal,
          type: "Property" as const,
        })),
      )
      .chain(() =>
        purifyHelpers.Equatable.arrayEquals(
          this.mappingRelation,
          other.mappingRelation,
        ).mapLeft((propertyValuesUnequal) => ({
          left: this,
          right: other,
          propertyName: "mappingRelation",
          propertyValuesUnequal,
          type: "Property" as const,
        })),
      )
      .chain(() =>
        purifyHelpers.Equatable.arrayEquals(
          this.narrower,
          other.narrower,
        ).mapLeft((propertyValuesUnequal) => ({
          left: this,
          right: other,
          propertyName: "narrower",
          propertyValuesUnequal,
          type: "Property" as const,
        })),
      )
      .chain(() =>
        purifyHelpers.Equatable.arrayEquals(
          this.narrowerTransitive,
          other.narrowerTransitive,
        ).mapLeft((propertyValuesUnequal) => ({
          left: this,
          right: other,
          propertyName: "narrowerTransitive",
          propertyValuesUnequal,
          type: "Property" as const,
        })),
      )
      .chain(() =>
        purifyHelpers.Equatable.arrayEquals(
          this.narrowMatch,
          other.narrowMatch,
        ).mapLeft((propertyValuesUnequal) => ({
          left: this,
          right: other,
          propertyName: "narrowMatch",
          propertyValuesUnequal,
          type: "Property" as const,
        })),
      )
      .chain(() =>
        purifyHelpers.Equatable.arrayEquals(
          this.related,
          other.related,
        ).mapLeft((propertyValuesUnequal) => ({
          left: this,
          right: other,
          propertyName: "related",
          propertyValuesUnequal,
          type: "Property" as const,
        })),
      )
      .chain(() =>
        purifyHelpers.Equatable.arrayEquals(
          this.relatedMatch,
          other.relatedMatch,
        ).mapLeft((propertyValuesUnequal) => ({
          left: this,
          right: other,
          propertyName: "relatedMatch",
          propertyValuesUnequal,
          type: "Property" as const,
        })),
      )
      .chain(() =>
        purifyHelpers.Equatable.arrayEquals(
          this.semanticRelation,
          other.semanticRelation,
        ).mapLeft((propertyValuesUnequal) => ({
          left: this,
          right: other,
          propertyName: "semanticRelation",
          propertyValuesUnequal,
          type: "Property" as const,
        })),
      )
      .chain(() =>
        purifyHelpers.Equatable.arrayEquals(
          this.topConceptOf,
          other.topConceptOf,
        ).mapLeft((propertyValuesUnequal) => ({
          left: this,
          right: other,
          propertyName: "topConceptOf",
          propertyValuesUnequal,
          type: "Property" as const,
        })),
      );
  }

  override hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(_hasher: HasherT): HasherT {
    super.hash(_hasher);
    for (const _element0 of this.broader) {
      _element0.hash(_hasher);
    }

    for (const _element0 of this.broaderTransitive) {
      _element0.hash(_hasher);
    }

    for (const _element0 of this.broadMatch) {
      _element0.hash(_hasher);
    }

    for (const _element0 of this.closeMatch) {
      _element0.hash(_hasher);
    }

    for (const _element0 of this.exactMatch) {
      _element0.hash(_hasher);
    }

    for (const _element0 of this.inScheme) {
      _element0.hash(_hasher);
    }

    for (const _element0 of this.mappingRelation) {
      _element0.hash(_hasher);
    }

    for (const _element0 of this.narrower) {
      _element0.hash(_hasher);
    }

    for (const _element0 of this.narrowerTransitive) {
      _element0.hash(_hasher);
    }

    for (const _element0 of this.narrowMatch) {
      _element0.hash(_hasher);
    }

    for (const _element0 of this.related) {
      _element0.hash(_hasher);
    }

    for (const _element0 of this.relatedMatch) {
      _element0.hash(_hasher);
    }

    for (const _element0 of this.semanticRelation) {
      _element0.hash(_hasher);
    }

    for (const _element0 of this.topConceptOf) {
      _element0.hash(_hasher);
    }

    return _hasher;
  }

  override toJson(): {
    readonly broader: readonly ReturnType<ConceptStub["toJson"]>[];
    readonly broaderTransitive: readonly ReturnType<ConceptStub["toJson"]>[];
    readonly broadMatch: readonly ReturnType<ConceptStub["toJson"]>[];
    readonly closeMatch: readonly ReturnType<ConceptStub["toJson"]>[];
    readonly exactMatch: readonly ReturnType<ConceptStub["toJson"]>[];
    readonly inScheme: readonly ReturnType<ConceptSchemeStub["toJson"]>[];
    readonly mappingRelation: readonly ReturnType<ConceptStub["toJson"]>[];
    readonly narrower: readonly ReturnType<ConceptStub["toJson"]>[];
    readonly narrowerTransitive: readonly ReturnType<ConceptStub["toJson"]>[];
    readonly narrowMatch: readonly ReturnType<ConceptStub["toJson"]>[];
    readonly related: readonly ReturnType<ConceptStub["toJson"]>[];
    readonly relatedMatch: readonly ReturnType<ConceptStub["toJson"]>[];
    readonly semanticRelation: readonly ReturnType<ConceptStub["toJson"]>[];
    readonly topConceptOf: readonly ReturnType<ConceptSchemeStub["toJson"]>[];
  } & ReturnType<Resource["toJson"]> {
    return JSON.parse(
      JSON.stringify({
        ...super.toJson(),
        broader: this.broader.map((_item) => _item.toJson()),
        broaderTransitive: this.broaderTransitive.map((_item) =>
          _item.toJson(),
        ),
        broadMatch: this.broadMatch.map((_item) => _item.toJson()),
        closeMatch: this.closeMatch.map((_item) => _item.toJson()),
        exactMatch: this.exactMatch.map((_item) => _item.toJson()),
        inScheme: this.inScheme.map((_item) => _item.toJson()),
        mappingRelation: this.mappingRelation.map((_item) => _item.toJson()),
        narrower: this.narrower.map((_item) => _item.toJson()),
        narrowerTransitive: this.narrowerTransitive.map((_item) =>
          _item.toJson(),
        ),
        narrowMatch: this.narrowMatch.map((_item) => _item.toJson()),
        related: this.related.map((_item) => _item.toJson()),
        relatedMatch: this.relatedMatch.map((_item) => _item.toJson()),
        semanticRelation: this.semanticRelation.map((_item) => _item.toJson()),
        topConceptOf: this.topConceptOf.map((_item) => _item.toJson()),
      } satisfies ReturnType<Concept["toJson"]>),
    );
  }

  override toRdf({
    ignoreRdfType,
    mutateGraph,
    resourceSet,
  }: {
    ignoreRdfType?: boolean;
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource<rdfjs.NamedNode> {
    const _resource = super.toRdf({
      ignoreRdfType: true,
      mutateGraph,
      resourceSet,
    });
    if (!ignoreRdfType) {
      _resource.add(
        _resource.dataFactory.namedNode(
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        ),
        _resource.dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#Concept",
        ),
      );
    }

    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#broader"),
      this.broader.map((_value) =>
        _value.toRdf({ mutateGraph: mutateGraph, resourceSet: resourceSet }),
      ),
    );
    _resource.add(
      dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#broaderTransitive",
      ),
      this.broaderTransitive.map((_value) =>
        _value.toRdf({ mutateGraph: mutateGraph, resourceSet: resourceSet }),
      ),
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#broadMatch"),
      this.broadMatch.map((_value) =>
        _value.toRdf({ mutateGraph: mutateGraph, resourceSet: resourceSet }),
      ),
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#closeMatch"),
      this.closeMatch.map((_value) =>
        _value.toRdf({ mutateGraph: mutateGraph, resourceSet: resourceSet }),
      ),
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#exactMatch"),
      this.exactMatch.map((_value) =>
        _value.toRdf({ mutateGraph: mutateGraph, resourceSet: resourceSet }),
      ),
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#inScheme"),
      this.inScheme.map((_value) =>
        _value.toRdf({ mutateGraph: mutateGraph, resourceSet: resourceSet }),
      ),
    );
    _resource.add(
      dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#mappingRelation",
      ),
      this.mappingRelation.map((_value) =>
        _value.toRdf({ mutateGraph: mutateGraph, resourceSet: resourceSet }),
      ),
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#narrower"),
      this.narrower.map((_value) =>
        _value.toRdf({ mutateGraph: mutateGraph, resourceSet: resourceSet }),
      ),
    );
    _resource.add(
      dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#narrowerTransitive",
      ),
      this.narrowerTransitive.map((_value) =>
        _value.toRdf({ mutateGraph: mutateGraph, resourceSet: resourceSet }),
      ),
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#narrowMatch"),
      this.narrowMatch.map((_value) =>
        _value.toRdf({ mutateGraph: mutateGraph, resourceSet: resourceSet }),
      ),
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#related"),
      this.related.map((_value) =>
        _value.toRdf({ mutateGraph: mutateGraph, resourceSet: resourceSet }),
      ),
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#relatedMatch"),
      this.relatedMatch.map((_value) =>
        _value.toRdf({ mutateGraph: mutateGraph, resourceSet: resourceSet }),
      ),
    );
    _resource.add(
      dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#semanticRelation",
      ),
      this.semanticRelation.map((_value) =>
        _value.toRdf({ mutateGraph: mutateGraph, resourceSet: resourceSet }),
      ),
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#topConceptOf"),
      this.topConceptOf.map((_value) =>
        _value.toRdf({ mutateGraph: mutateGraph, resourceSet: resourceSet }),
      ),
    );
    return _resource;
  }

  override toString(): string {
    return JSON.stringify(this.toJson());
  }
}

export namespace Concept {
  export function fromRdf({
    ignoreRdfType: _ignoreRdfType,
    languageIn: _languageIn,
    resource: _resource,
    // @ts-ignore
    ..._context
  }: {
    [_index: string]: any;
    ignoreRdfType?: boolean;
    languageIn?: readonly string[];
    resource: rdfjsResource.Resource<rdfjs.NamedNode>;
  }): purify.Either<rdfjsResource.Resource.ValueError, Concept> {
    return Resource.interfaceFromRdf({
      ..._context,
      ignoreRdfType: true,
      languageIn: _languageIn,
      resource: _resource,
    }).chain((_super) => {
      if (
        !_ignoreRdfType &&
        !_resource.isInstanceOf(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#Concept"),
        )
      ) {
        return purify.Left(
          new rdfjsResource.Resource.ValueError({
            focusResource: _resource,
            message: `${rdfjsResource.Resource.Identifier.toString(_resource.identifier)} has unexpected RDF type`,
            predicate: dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#Concept",
            ),
          }),
        );
      }
      const _broaderEither: purify.Either<
        rdfjsResource.Resource.ValueError,
        readonly ConceptStub[]
      > = purify.Either.of([
        ..._resource
          .values(
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#broader",
            ),
            { unique: true },
          )
          .flatMap((_value) =>
            _value
              .toValues()
              .head()
              .chain((value) => value.toResource())
              .chain((_resource) =>
                ConceptStub.fromRdf({
                  ..._context,
                  languageIn: _languageIn,
                  resource: _resource,
                }),
              )
              .toMaybe()
              .toList(),
          ),
      ]);
      if (_broaderEither.isLeft()) {
        return _broaderEither;
      }
      const broader = _broaderEither.unsafeCoerce();
      const _broaderTransitiveEither: purify.Either<
        rdfjsResource.Resource.ValueError,
        readonly ConceptStub[]
      > = purify.Either.of([
        ..._resource
          .values(
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#broaderTransitive",
            ),
            { unique: true },
          )
          .flatMap((_value) =>
            _value
              .toValues()
              .head()
              .chain((value) => value.toResource())
              .chain((_resource) =>
                ConceptStub.fromRdf({
                  ..._context,
                  languageIn: _languageIn,
                  resource: _resource,
                }),
              )
              .toMaybe()
              .toList(),
          ),
      ]);
      if (_broaderTransitiveEither.isLeft()) {
        return _broaderTransitiveEither;
      }
      const broaderTransitive = _broaderTransitiveEither.unsafeCoerce();
      const _broadMatchEither: purify.Either<
        rdfjsResource.Resource.ValueError,
        readonly ConceptStub[]
      > = purify.Either.of([
        ..._resource
          .values(
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#broadMatch",
            ),
            { unique: true },
          )
          .flatMap((_value) =>
            _value
              .toValues()
              .head()
              .chain((value) => value.toResource())
              .chain((_resource) =>
                ConceptStub.fromRdf({
                  ..._context,
                  languageIn: _languageIn,
                  resource: _resource,
                }),
              )
              .toMaybe()
              .toList(),
          ),
      ]);
      if (_broadMatchEither.isLeft()) {
        return _broadMatchEither;
      }
      const broadMatch = _broadMatchEither.unsafeCoerce();
      const _closeMatchEither: purify.Either<
        rdfjsResource.Resource.ValueError,
        readonly ConceptStub[]
      > = purify.Either.of([
        ..._resource
          .values(
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#closeMatch",
            ),
            { unique: true },
          )
          .flatMap((_value) =>
            _value
              .toValues()
              .head()
              .chain((value) => value.toResource())
              .chain((_resource) =>
                ConceptStub.fromRdf({
                  ..._context,
                  languageIn: _languageIn,
                  resource: _resource,
                }),
              )
              .toMaybe()
              .toList(),
          ),
      ]);
      if (_closeMatchEither.isLeft()) {
        return _closeMatchEither;
      }
      const closeMatch = _closeMatchEither.unsafeCoerce();
      const _exactMatchEither: purify.Either<
        rdfjsResource.Resource.ValueError,
        readonly ConceptStub[]
      > = purify.Either.of([
        ..._resource
          .values(
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#exactMatch",
            ),
            { unique: true },
          )
          .flatMap((_value) =>
            _value
              .toValues()
              .head()
              .chain((value) => value.toResource())
              .chain((_resource) =>
                ConceptStub.fromRdf({
                  ..._context,
                  languageIn: _languageIn,
                  resource: _resource,
                }),
              )
              .toMaybe()
              .toList(),
          ),
      ]);
      if (_exactMatchEither.isLeft()) {
        return _exactMatchEither;
      }
      const exactMatch = _exactMatchEither.unsafeCoerce();
      const identifier = _resource.identifier;
      const _inSchemeEither: purify.Either<
        rdfjsResource.Resource.ValueError,
        readonly ConceptSchemeStub[]
      > = purify.Either.of([
        ..._resource
          .values(
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#inScheme",
            ),
            { unique: true },
          )
          .flatMap((_value) =>
            _value
              .toValues()
              .head()
              .chain((value) => value.toResource())
              .chain((_resource) =>
                ConceptSchemeStub.fromRdf({
                  ..._context,
                  languageIn: _languageIn,
                  resource: _resource,
                }),
              )
              .toMaybe()
              .toList(),
          ),
      ]);
      if (_inSchemeEither.isLeft()) {
        return _inSchemeEither;
      }
      const inScheme = _inSchemeEither.unsafeCoerce();
      const _mappingRelationEither: purify.Either<
        rdfjsResource.Resource.ValueError,
        readonly ConceptStub[]
      > = purify.Either.of([
        ..._resource
          .values(
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#mappingRelation",
            ),
            { unique: true },
          )
          .flatMap((_value) =>
            _value
              .toValues()
              .head()
              .chain((value) => value.toResource())
              .chain((_resource) =>
                ConceptStub.fromRdf({
                  ..._context,
                  languageIn: _languageIn,
                  resource: _resource,
                }),
              )
              .toMaybe()
              .toList(),
          ),
      ]);
      if (_mappingRelationEither.isLeft()) {
        return _mappingRelationEither;
      }
      const mappingRelation = _mappingRelationEither.unsafeCoerce();
      const _narrowerEither: purify.Either<
        rdfjsResource.Resource.ValueError,
        readonly ConceptStub[]
      > = purify.Either.of([
        ..._resource
          .values(
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#narrower",
            ),
            { unique: true },
          )
          .flatMap((_value) =>
            _value
              .toValues()
              .head()
              .chain((value) => value.toResource())
              .chain((_resource) =>
                ConceptStub.fromRdf({
                  ..._context,
                  languageIn: _languageIn,
                  resource: _resource,
                }),
              )
              .toMaybe()
              .toList(),
          ),
      ]);
      if (_narrowerEither.isLeft()) {
        return _narrowerEither;
      }
      const narrower = _narrowerEither.unsafeCoerce();
      const _narrowerTransitiveEither: purify.Either<
        rdfjsResource.Resource.ValueError,
        readonly ConceptStub[]
      > = purify.Either.of([
        ..._resource
          .values(
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#narrowerTransitive",
            ),
            { unique: true },
          )
          .flatMap((_value) =>
            _value
              .toValues()
              .head()
              .chain((value) => value.toResource())
              .chain((_resource) =>
                ConceptStub.fromRdf({
                  ..._context,
                  languageIn: _languageIn,
                  resource: _resource,
                }),
              )
              .toMaybe()
              .toList(),
          ),
      ]);
      if (_narrowerTransitiveEither.isLeft()) {
        return _narrowerTransitiveEither;
      }
      const narrowerTransitive = _narrowerTransitiveEither.unsafeCoerce();
      const _narrowMatchEither: purify.Either<
        rdfjsResource.Resource.ValueError,
        readonly ConceptStub[]
      > = purify.Either.of([
        ..._resource
          .values(
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#narrowMatch",
            ),
            { unique: true },
          )
          .flatMap((_value) =>
            _value
              .toValues()
              .head()
              .chain((value) => value.toResource())
              .chain((_resource) =>
                ConceptStub.fromRdf({
                  ..._context,
                  languageIn: _languageIn,
                  resource: _resource,
                }),
              )
              .toMaybe()
              .toList(),
          ),
      ]);
      if (_narrowMatchEither.isLeft()) {
        return _narrowMatchEither;
      }
      const narrowMatch = _narrowMatchEither.unsafeCoerce();
      const _relatedEither: purify.Either<
        rdfjsResource.Resource.ValueError,
        readonly ConceptStub[]
      > = purify.Either.of([
        ..._resource
          .values(
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#related",
            ),
            { unique: true },
          )
          .flatMap((_value) =>
            _value
              .toValues()
              .head()
              .chain((value) => value.toResource())
              .chain((_resource) =>
                ConceptStub.fromRdf({
                  ..._context,
                  languageIn: _languageIn,
                  resource: _resource,
                }),
              )
              .toMaybe()
              .toList(),
          ),
      ]);
      if (_relatedEither.isLeft()) {
        return _relatedEither;
      }
      const related = _relatedEither.unsafeCoerce();
      const _relatedMatchEither: purify.Either<
        rdfjsResource.Resource.ValueError,
        readonly ConceptStub[]
      > = purify.Either.of([
        ..._resource
          .values(
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#relatedMatch",
            ),
            { unique: true },
          )
          .flatMap((_value) =>
            _value
              .toValues()
              .head()
              .chain((value) => value.toResource())
              .chain((_resource) =>
                ConceptStub.fromRdf({
                  ..._context,
                  languageIn: _languageIn,
                  resource: _resource,
                }),
              )
              .toMaybe()
              .toList(),
          ),
      ]);
      if (_relatedMatchEither.isLeft()) {
        return _relatedMatchEither;
      }
      const relatedMatch = _relatedMatchEither.unsafeCoerce();
      const _semanticRelationEither: purify.Either<
        rdfjsResource.Resource.ValueError,
        readonly ConceptStub[]
      > = purify.Either.of([
        ..._resource
          .values(
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#semanticRelation",
            ),
            { unique: true },
          )
          .flatMap((_value) =>
            _value
              .toValues()
              .head()
              .chain((value) => value.toResource())
              .chain((_resource) =>
                ConceptStub.fromRdf({
                  ..._context,
                  languageIn: _languageIn,
                  resource: _resource,
                }),
              )
              .toMaybe()
              .toList(),
          ),
      ]);
      if (_semanticRelationEither.isLeft()) {
        return _semanticRelationEither;
      }
      const semanticRelation = _semanticRelationEither.unsafeCoerce();
      const _topConceptOfEither: purify.Either<
        rdfjsResource.Resource.ValueError,
        readonly ConceptSchemeStub[]
      > = purify.Either.of([
        ..._resource
          .values(
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#topConceptOf",
            ),
            { unique: true },
          )
          .flatMap((_value) =>
            _value
              .toValues()
              .head()
              .chain((value) => value.toResource())
              .chain((_resource) =>
                ConceptSchemeStub.fromRdf({
                  ..._context,
                  languageIn: _languageIn,
                  resource: _resource,
                }),
              )
              .toMaybe()
              .toList(),
          ),
      ]);
      if (_topConceptOfEither.isLeft()) {
        return _topConceptOfEither;
      }
      const topConceptOf = _topConceptOfEither.unsafeCoerce();
      return purify.Either.of(
        new Concept({
          altLabel: _super.altLabel,
          altLabelXl: _super.altLabelXl,
          changeNote: _super.changeNote,
          definition: _super.definition,
          editorialNote: _super.editorialNote,
          example: _super.example,
          hiddenLabel: _super.hiddenLabel,
          hiddenLabelXl: _super.hiddenLabelXl,
          historyNote: _super.historyNote,
          identifier,
          modified: _super.modified,
          notation: _super.notation,
          note: _super.note,
          prefLabel: _super.prefLabel,
          prefLabelXl: _super.prefLabelXl,
          scopeNote: _super.scopeNote,
          broader,
          broaderTransitive,
          broadMatch,
          closeMatch,
          exactMatch,
          inScheme,
          mappingRelation,
          narrower,
          narrowerTransitive,
          narrowMatch,
          related,
          relatedMatch,
          semanticRelation,
          topConceptOf,
        }),
      );
    });
  }

  export class SparqlGraphPatterns extends Resource.SparqlGraphPatterns {
    constructor(
      subject: sparqlBuilder.ResourceGraphPatterns.SubjectParameter,
      _options?: { ignoreRdfType?: boolean },
    ) {
      super(subject, { ignoreRdfType: true });
      if (!_options?.ignoreRdfType) {
        this.add(
          ...new sparqlBuilder.RdfTypeGraphPatterns(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#Concept",
            ),
          ),
        );
      }

      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.group(
            sparqlBuilder.GraphPattern.basic(
              this.subject,
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#broader",
              ),
              this.variable("Broader"),
            ).chainObject(
              (_object) => new ConceptStub.SparqlGraphPatterns(_object),
            ),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.group(
            sparqlBuilder.GraphPattern.basic(
              this.subject,
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#broaderTransitive",
              ),
              this.variable("BroaderTransitive"),
            ).chainObject(
              (_object) => new ConceptStub.SparqlGraphPatterns(_object),
            ),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.group(
            sparqlBuilder.GraphPattern.basic(
              this.subject,
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#broadMatch",
              ),
              this.variable("BroadMatch"),
            ).chainObject(
              (_object) => new ConceptStub.SparqlGraphPatterns(_object),
            ),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.group(
            sparqlBuilder.GraphPattern.basic(
              this.subject,
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#closeMatch",
              ),
              this.variable("CloseMatch"),
            ).chainObject(
              (_object) => new ConceptStub.SparqlGraphPatterns(_object),
            ),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.group(
            sparqlBuilder.GraphPattern.basic(
              this.subject,
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#exactMatch",
              ),
              this.variable("ExactMatch"),
            ).chainObject(
              (_object) => new ConceptStub.SparqlGraphPatterns(_object),
            ),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.group(
            sparqlBuilder.GraphPattern.basic(
              this.subject,
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#inScheme",
              ),
              this.variable("InScheme"),
            ).chainObject(
              (_object) => new ConceptSchemeStub.SparqlGraphPatterns(_object),
            ),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.group(
            sparqlBuilder.GraphPattern.basic(
              this.subject,
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#mappingRelation",
              ),
              this.variable("MappingRelation"),
            ).chainObject(
              (_object) => new ConceptStub.SparqlGraphPatterns(_object),
            ),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.group(
            sparqlBuilder.GraphPattern.basic(
              this.subject,
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#narrower",
              ),
              this.variable("Narrower"),
            ).chainObject(
              (_object) => new ConceptStub.SparqlGraphPatterns(_object),
            ),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.group(
            sparqlBuilder.GraphPattern.basic(
              this.subject,
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#narrowerTransitive",
              ),
              this.variable("NarrowerTransitive"),
            ).chainObject(
              (_object) => new ConceptStub.SparqlGraphPatterns(_object),
            ),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.group(
            sparqlBuilder.GraphPattern.basic(
              this.subject,
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#narrowMatch",
              ),
              this.variable("NarrowMatch"),
            ).chainObject(
              (_object) => new ConceptStub.SparqlGraphPatterns(_object),
            ),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.group(
            sparqlBuilder.GraphPattern.basic(
              this.subject,
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#related",
              ),
              this.variable("Related"),
            ).chainObject(
              (_object) => new ConceptStub.SparqlGraphPatterns(_object),
            ),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.group(
            sparqlBuilder.GraphPattern.basic(
              this.subject,
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#relatedMatch",
              ),
              this.variable("RelatedMatch"),
            ).chainObject(
              (_object) => new ConceptStub.SparqlGraphPatterns(_object),
            ),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.group(
            sparqlBuilder.GraphPattern.basic(
              this.subject,
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#semanticRelation",
              ),
              this.variable("SemanticRelation"),
            ).chainObject(
              (_object) => new ConceptStub.SparqlGraphPatterns(_object),
            ),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.group(
            sparqlBuilder.GraphPattern.basic(
              this.subject,
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#topConceptOf",
              ),
              this.variable("TopConceptOf"),
            ).chainObject(
              (_object) => new ConceptSchemeStub.SparqlGraphPatterns(_object),
            ),
          ),
        ),
      );
    }
  }
}
export abstract class ResourceStub {
  abstract readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly prefLabel: readonly rdfjs.Literal[];
  readonly prefLabelXl: readonly LabelStub[];
  abstract readonly type: "ConceptSchemeStub" | "ConceptStub";

  constructor(parameters: {
    readonly prefLabel?: readonly rdfjs.Literal[];
    readonly prefLabelXl?: readonly LabelStub[];
  }) {
    if (Array.isArray(parameters.prefLabel)) {
      this.prefLabel = parameters.prefLabel;
    } else if (typeof parameters.prefLabel === "undefined") {
      this.prefLabel = [];
    } else {
      this.prefLabel = parameters.prefLabel; // never
    }

    if (Array.isArray(parameters.prefLabelXl)) {
      this.prefLabelXl = parameters.prefLabelXl;
    } else if (typeof parameters.prefLabelXl === "undefined") {
      this.prefLabelXl = [];
    } else {
      this.prefLabelXl = parameters.prefLabelXl; // never
    }
  }

  equals(other: ResourceStub): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.booleanEquals(
      this.identifier,
      other.identifier,
    )
      .mapLeft((propertyValuesUnequal) => ({
        left: this,
        right: other,
        propertyName: "identifier",
        propertyValuesUnequal,
        type: "Property" as const,
      }))
      .chain(() =>
        ((left, right) =>
          purifyHelpers.Arrays.equals(
            left,
            right,
            purifyHelpers.Equatable.booleanEquals,
          ))(this.prefLabel, other.prefLabel).mapLeft(
          (propertyValuesUnequal) => ({
            left: this,
            right: other,
            propertyName: "prefLabel",
            propertyValuesUnequal,
            type: "Property" as const,
          }),
        ),
      )
      .chain(() =>
        purifyHelpers.Equatable.arrayEquals(
          this.prefLabelXl,
          other.prefLabelXl,
        ).mapLeft((propertyValuesUnequal) => ({
          left: this,
          right: other,
          propertyName: "prefLabelXl",
          propertyValuesUnequal,
          type: "Property" as const,
        })),
      )
      .chain(() =>
        purifyHelpers.Equatable.strictEquals(this.type, other.type).mapLeft(
          (propertyValuesUnequal) => ({
            left: this,
            right: other,
            propertyName: "type",
            propertyValuesUnequal,
            type: "Property" as const,
          }),
        ),
      );
  }

  hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(_hasher: HasherT): HasherT {
    for (const _element0 of this.prefLabel) {
      _hasher.update(_element0.value);
    }

    for (const _element0 of this.prefLabelXl) {
      _element0.hash(_hasher);
    }

    return _hasher;
  }

  toJson(): {
    readonly "@id": string;
    readonly prefLabel: readonly (
      | string
      | {
          "@language": string | undefined;
          "@type": string | undefined;
          "@value": string;
        }
    )[];
    readonly prefLabelXl: readonly ReturnType<LabelStub["toJson"]>[];
    readonly type: string;
  } {
    return JSON.parse(
      JSON.stringify({
        "@id": this.identifier.value,
        prefLabel: this.prefLabel.map((_item) =>
          _item.datatype.value === "http://www.w3.org/2001/XMLSchema#string" &&
          _item.language.length === 0
            ? _item.value
            : {
                "@language":
                  _item.language.length > 0 ? _item.language : undefined,
                "@type":
                  _item.datatype.value !==
                  "http://www.w3.org/2001/XMLSchema#string"
                    ? _item.datatype.value
                    : undefined,
                "@value": _item.value,
              },
        ),
        prefLabelXl: this.prefLabelXl.map((_item) => _item.toJson()),
        type: this.type,
      } satisfies ReturnType<ResourceStub["toJson"]>),
    );
  }

  toRdf({
    mutateGraph,
    resourceSet,
  }: {
    ignoreRdfType?: boolean;
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: this.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#prefLabel"),
      this.prefLabel,
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#prefLabel"),
      this.prefLabelXl.map((_value) =>
        _value.toRdf({ mutateGraph: mutateGraph, resourceSet: resourceSet }),
      ),
    );
    return _resource;
  }

  toString(): string {
    return JSON.stringify(this.toJson());
  }
}

export namespace ResourceStub {
  export function interfaceFromRdf({
    ignoreRdfType: _ignoreRdfType,
    languageIn: _languageIn,
    resource: _resource,
    // @ts-ignore
    ..._context
  }: {
    [_index: string]: any;
    ignoreRdfType?: boolean;
    languageIn?: readonly string[];
    resource: rdfjsResource.Resource;
  }): purify.Either<
    rdfjsResource.Resource.ValueError,
    {
      identifier: rdfjs.BlankNode | rdfjs.NamedNode;
      prefLabel: readonly rdfjs.Literal[];
      prefLabelXl: readonly LabelStub[];
    }
  > {
    const identifier = _resource.identifier;
    const _prefLabelEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ..._resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#prefLabel",
          ),
          { unique: true },
        )
        .flatMap((_value) =>
          _value
            .toValues()
            .filter((_value) => {
              const _languageInOrDefault = _languageIn ?? [];
              if (_languageInOrDefault.length === 0) {
                return true;
              }
              const _valueLiteral = _value.toLiteral().toMaybe().extract();
              if (typeof _valueLiteral === "undefined") {
                return false;
              }
              return _languageInOrDefault.some(
                (_languageIn) => _languageIn === _valueLiteral.language,
              );
            })
            .head()
            .chain((_value) => _value.toLiteral())
            .toMaybe()
            .toList(),
        ),
    ]);
    if (_prefLabelEither.isLeft()) {
      return _prefLabelEither;
    }

    const prefLabel = _prefLabelEither.unsafeCoerce();
    const _prefLabelXlEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly LabelStub[]
    > = purify.Either.of([
      ..._resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#prefLabel"),
          { unique: true },
        )
        .flatMap((_value) =>
          _value
            .toValues()
            .head()
            .chain((value) => value.toResource())
            .chain((_resource) =>
              LabelStub.fromRdf({
                ..._context,
                languageIn: _languageIn,
                resource: _resource,
              }),
            )
            .toMaybe()
            .toList(),
        ),
    ]);
    if (_prefLabelXlEither.isLeft()) {
      return _prefLabelXlEither;
    }

    const prefLabelXl = _prefLabelXlEither.unsafeCoerce();
    return purify.Either.of({ identifier, prefLabel, prefLabelXl });
  }

  export class SparqlGraphPatterns extends sparqlBuilder.ResourceGraphPatterns {
    constructor(
      subject: sparqlBuilder.ResourceGraphPatterns.SubjectParameter,
      _options?: { ignoreRdfType?: boolean },
    ) {
      super(subject);
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#prefLabel",
            ),
            this.variable("PrefLabel"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.group(
            sparqlBuilder.GraphPattern.basic(
              this.subject,
              dataFactory.namedNode(
                "http://www.w3.org/2008/05/skos-xl#prefLabel",
              ),
              this.variable("PrefLabelXl"),
            ).chainObject(
              (_object) => new LabelStub.SparqlGraphPatterns(_object),
            ),
          ),
        ),
      );
    }
  }
}
export class ConceptStub extends ResourceStub {
  private _identifier: rdfjs.BlankNode | rdfjs.NamedNode | undefined;
  override readonly type = "ConceptStub";

  constructor(
    parameters: {
      readonly identifier?: rdfjs.BlankNode | rdfjs.NamedNode;
    } & ConstructorParameters<typeof ResourceStub>[0],
  ) {
    super(parameters);
    this._identifier = parameters.identifier;
  }

  override get identifier(): rdfjs.BlankNode | rdfjs.NamedNode {
    if (typeof this._identifier === "undefined") {
      this._identifier = dataFactory.namedNode(
        `urn:shaclmate:object:${this.type}:${this.hash(sha256.create())}`,
      );
    }
    return this._identifier;
  }

  override toRdf({
    ignoreRdfType,
    mutateGraph,
    resourceSet,
  }: {
    ignoreRdfType?: boolean;
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource {
    const _resource = super.toRdf({
      ignoreRdfType: true,
      mutateGraph,
      resourceSet,
    });
    if (!ignoreRdfType) {
      _resource.add(
        _resource.dataFactory.namedNode(
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        ),
        _resource.dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#Concept",
        ),
      );
    }

    return _resource;
  }

  override toString(): string {
    return JSON.stringify(this.toJson());
  }
}

export namespace ConceptStub {
  export function fromRdf({
    ignoreRdfType: _ignoreRdfType,
    languageIn: _languageIn,
    resource: _resource,
    // @ts-ignore
    ..._context
  }: {
    [_index: string]: any;
    ignoreRdfType?: boolean;
    languageIn?: readonly string[];
    resource: rdfjsResource.Resource;
  }): purify.Either<rdfjsResource.Resource.ValueError, ConceptStub> {
    return ResourceStub.interfaceFromRdf({
      ..._context,
      ignoreRdfType: true,
      languageIn: _languageIn,
      resource: _resource,
    }).chain((_super) => {
      if (
        !_ignoreRdfType &&
        !_resource.isInstanceOf(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#Concept"),
        )
      ) {
        return purify.Left(
          new rdfjsResource.Resource.ValueError({
            focusResource: _resource,
            message: `${rdfjsResource.Resource.Identifier.toString(_resource.identifier)} has unexpected RDF type`,
            predicate: dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#Concept",
            ),
          }),
        );
      }
      const identifier = _resource.identifier;
      return purify.Either.of(
        new ConceptStub({
          identifier,
          prefLabel: _super.prefLabel,
          prefLabelXl: _super.prefLabelXl,
        }),
      );
    });
  }

  export class SparqlGraphPatterns extends ResourceStub.SparqlGraphPatterns {
    constructor(
      subject: sparqlBuilder.ResourceGraphPatterns.SubjectParameter,
      _options?: { ignoreRdfType?: boolean },
    ) {
      super(subject, { ignoreRdfType: true });
      if (!_options?.ignoreRdfType) {
        this.add(
          ...new sparqlBuilder.RdfTypeGraphPatterns(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#Concept",
            ),
          ),
        );
      }
    }
  }
}
export class ConceptScheme extends Resource {
  readonly hasTopConcept: readonly ConceptStub[];
  private _identifier: rdfjs.NamedNode | undefined;
  readonly license: purify.Maybe<rdfjs.NamedNode | rdfjs.Literal>;
  readonly rights: purify.Maybe<rdfjs.Literal>;
  readonly rightsHolder: purify.Maybe<rdfjs.Literal>;
  override readonly type = "ConceptScheme";

  constructor(
    parameters: {
      readonly hasTopConcept?: readonly ConceptStub[];
      readonly identifier?: rdfjs.NamedNode;
      readonly license?:
        | (rdfjs.NamedNode | rdfjs.Literal)
        | purify.Maybe<rdfjs.NamedNode | rdfjs.Literal>;
      readonly rights?:
        | Date
        | boolean
        | number
        | purify.Maybe<rdfjs.Literal>
        | rdfjs.Literal
        | string;
      readonly rightsHolder?:
        | Date
        | boolean
        | number
        | purify.Maybe<rdfjs.Literal>
        | rdfjs.Literal
        | string;
    } & ConstructorParameters<typeof Resource>[0],
  ) {
    super(parameters);
    if (Array.isArray(parameters.hasTopConcept)) {
      this.hasTopConcept = parameters.hasTopConcept;
    } else if (typeof parameters.hasTopConcept === "undefined") {
      this.hasTopConcept = [];
    } else {
      this.hasTopConcept = parameters.hasTopConcept; // never
    }

    this._identifier = parameters.identifier;
    if (purify.Maybe.isMaybe(parameters.license)) {
      this.license = parameters.license;
    } else if (typeof parameters.license === "object") {
      this.license = purify.Maybe.of(parameters.license);
    } else if (typeof parameters.license === "undefined") {
      this.license = purify.Maybe.empty();
    } else {
      this.license = parameters.license; // never
    }

    if (purify.Maybe.isMaybe(parameters.rights)) {
      this.rights = parameters.rights;
    } else if (typeof parameters.rights === "boolean") {
      this.rights = purify.Maybe.of(rdfLiteral.toRdf(parameters.rights));
    } else if (
      typeof parameters.rights === "object" &&
      parameters.rights instanceof Date
    ) {
      this.rights = purify.Maybe.of(rdfLiteral.toRdf(parameters.rights));
    } else if (typeof parameters.rights === "number") {
      this.rights = purify.Maybe.of(rdfLiteral.toRdf(parameters.rights));
    } else if (typeof parameters.rights === "string") {
      this.rights = purify.Maybe.of(dataFactory.literal(parameters.rights));
    } else if (typeof parameters.rights === "object") {
      this.rights = purify.Maybe.of(parameters.rights);
    } else if (typeof parameters.rights === "undefined") {
      this.rights = purify.Maybe.empty();
    } else {
      this.rights = parameters.rights; // never
    }

    if (purify.Maybe.isMaybe(parameters.rightsHolder)) {
      this.rightsHolder = parameters.rightsHolder;
    } else if (typeof parameters.rightsHolder === "boolean") {
      this.rightsHolder = purify.Maybe.of(
        rdfLiteral.toRdf(parameters.rightsHolder),
      );
    } else if (
      typeof parameters.rightsHolder === "object" &&
      parameters.rightsHolder instanceof Date
    ) {
      this.rightsHolder = purify.Maybe.of(
        rdfLiteral.toRdf(parameters.rightsHolder),
      );
    } else if (typeof parameters.rightsHolder === "number") {
      this.rightsHolder = purify.Maybe.of(
        rdfLiteral.toRdf(parameters.rightsHolder),
      );
    } else if (typeof parameters.rightsHolder === "string") {
      this.rightsHolder = purify.Maybe.of(
        dataFactory.literal(parameters.rightsHolder),
      );
    } else if (typeof parameters.rightsHolder === "object") {
      this.rightsHolder = purify.Maybe.of(parameters.rightsHolder);
    } else if (typeof parameters.rightsHolder === "undefined") {
      this.rightsHolder = purify.Maybe.empty();
    } else {
      this.rightsHolder = parameters.rightsHolder; // never
    }
  }

  override get identifier(): rdfjs.NamedNode {
    if (typeof this._identifier === "undefined") {
      this._identifier = dataFactory.namedNode(
        `urn:shaclmate:object:${this.type}:${this.hash(sha256.create())}`,
      );
    }
    return this._identifier;
  }

  override equals(other: ConceptScheme): purifyHelpers.Equatable.EqualsResult {
    return super
      .equals(other)
      .chain(() =>
        purifyHelpers.Equatable.arrayEquals(
          this.hasTopConcept,
          other.hasTopConcept,
        ).mapLeft((propertyValuesUnequal) => ({
          left: this,
          right: other,
          propertyName: "hasTopConcept",
          propertyValuesUnequal,
          type: "Property" as const,
        })),
      )
      .chain(() =>
        ((left, right) =>
          purifyHelpers.Maybes.equals(
            left,
            right,
            (
              left: rdfjs.NamedNode | rdfjs.Literal,
              right: rdfjs.NamedNode | rdfjs.Literal,
            ) => {
              if (
                left.termType === "NamedNode" &&
                right.termType === "NamedNode"
              ) {
                return purifyHelpers.Equatable.booleanEquals(left, right);
              }
              if (left.termType === "Literal" && right.termType === "Literal") {
                return purifyHelpers.Equatable.booleanEquals(left, right);
              }

              return purify.Left({
                left,
                right,
                propertyName: "type",
                propertyValuesUnequal: {
                  left: typeof left,
                  right: typeof right,
                  type: "BooleanEquals" as const,
                },
                type: "Property" as const,
              });
            },
          ))(this.license, other.license).mapLeft((propertyValuesUnequal) => ({
          left: this,
          right: other,
          propertyName: "license",
          propertyValuesUnequal,
          type: "Property" as const,
        })),
      )
      .chain(() =>
        ((left, right) =>
          purifyHelpers.Maybes.equals(
            left,
            right,
            purifyHelpers.Equatable.booleanEquals,
          ))(this.rights, other.rights).mapLeft((propertyValuesUnequal) => ({
          left: this,
          right: other,
          propertyName: "rights",
          propertyValuesUnequal,
          type: "Property" as const,
        })),
      )
      .chain(() =>
        ((left, right) =>
          purifyHelpers.Maybes.equals(
            left,
            right,
            purifyHelpers.Equatable.booleanEquals,
          ))(this.rightsHolder, other.rightsHolder).mapLeft(
          (propertyValuesUnequal) => ({
            left: this,
            right: other,
            propertyName: "rightsHolder",
            propertyValuesUnequal,
            type: "Property" as const,
          }),
        ),
      );
  }

  override hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(_hasher: HasherT): HasherT {
    super.hash(_hasher);
    for (const _element0 of this.hasTopConcept) {
      _element0.hash(_hasher);
    }

    this.license.ifJust((_value0) => {
      switch (_value0.termType) {
        case "NamedNode": {
          _hasher.update(rdfjsResource.Resource.Identifier.toString(_value0));
          break;
        }
        case "Literal": {
          _hasher.update(_value0.value);
          break;
        }
      }
    });
    this.rights.ifJust((_value0) => {
      _hasher.update(_value0.value);
    });
    this.rightsHolder.ifJust((_value0) => {
      _hasher.update(_value0.value);
    });
    return _hasher;
  }

  override toJson(): {
    readonly hasTopConcept: readonly ReturnType<ConceptStub["toJson"]>[];
    readonly license:
      | (
          | { "@id": string }
          | string
          | {
              "@language": string | undefined;
              "@type": string | undefined;
              "@value": string;
            }
        )
      | undefined;
    readonly rights:
      | (
          | string
          | {
              "@language": string | undefined;
              "@type": string | undefined;
              "@value": string;
            }
        )
      | undefined;
    readonly rightsHolder:
      | (
          | string
          | {
              "@language": string | undefined;
              "@type": string | undefined;
              "@value": string;
            }
        )
      | undefined;
  } & ReturnType<Resource["toJson"]> {
    return JSON.parse(
      JSON.stringify({
        ...super.toJson(),
        hasTopConcept: this.hasTopConcept.map((_item) => _item.toJson()),
        license: this.license
          .map((_item) =>
            _item.termType === "Literal"
              ? _item.datatype.value ===
                  "http://www.w3.org/2001/XMLSchema#string" &&
                _item.language.length === 0
                ? _item.value
                : {
                    "@language":
                      _item.language.length > 0 ? _item.language : undefined,
                    "@type":
                      _item.datatype.value !==
                      "http://www.w3.org/2001/XMLSchema#string"
                        ? _item.datatype.value
                        : undefined,
                    "@value": _item.value,
                  }
              : { "@id": _item.value },
          )
          .extract(),
        rights: this.rights
          .map((_item) =>
            _item.datatype.value ===
              "http://www.w3.org/2001/XMLSchema#string" &&
            _item.language.length === 0
              ? _item.value
              : {
                  "@language":
                    _item.language.length > 0 ? _item.language : undefined,
                  "@type":
                    _item.datatype.value !==
                    "http://www.w3.org/2001/XMLSchema#string"
                      ? _item.datatype.value
                      : undefined,
                  "@value": _item.value,
                },
          )
          .extract(),
        rightsHolder: this.rightsHolder
          .map((_item) =>
            _item.datatype.value ===
              "http://www.w3.org/2001/XMLSchema#string" &&
            _item.language.length === 0
              ? _item.value
              : {
                  "@language":
                    _item.language.length > 0 ? _item.language : undefined,
                  "@type":
                    _item.datatype.value !==
                    "http://www.w3.org/2001/XMLSchema#string"
                      ? _item.datatype.value
                      : undefined,
                  "@value": _item.value,
                },
          )
          .extract(),
      } satisfies ReturnType<ConceptScheme["toJson"]>),
    );
  }

  override toRdf({
    ignoreRdfType,
    mutateGraph,
    resourceSet,
  }: {
    ignoreRdfType?: boolean;
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource<rdfjs.NamedNode> {
    const _resource = super.toRdf({
      ignoreRdfType: true,
      mutateGraph,
      resourceSet,
    });
    if (!ignoreRdfType) {
      _resource.add(
        _resource.dataFactory.namedNode(
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        ),
        _resource.dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#ConceptScheme",
        ),
      );
    }

    _resource.add(
      dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#hasTopConcept",
      ),
      this.hasTopConcept.map((_value) =>
        _value.toRdf({ mutateGraph: mutateGraph, resourceSet: resourceSet }),
      ),
    );
    _resource.add(
      dataFactory.namedNode("http://purl.org/dc/terms/license"),
      this.license.map((_value) =>
        _value.termType === "Literal" ? _value : _value,
      ),
    );
    _resource.add(
      dataFactory.namedNode("http://purl.org/dc/terms/rights"),
      this.rights,
    );
    _resource.add(
      dataFactory.namedNode("http://purl.org/dc/terms/rightsHolder"),
      this.rightsHolder,
    );
    return _resource;
  }

  override toString(): string {
    return JSON.stringify(this.toJson());
  }
}

export namespace ConceptScheme {
  export function fromRdf({
    ignoreRdfType: _ignoreRdfType,
    languageIn: _languageIn,
    resource: _resource,
    // @ts-ignore
    ..._context
  }: {
    [_index: string]: any;
    ignoreRdfType?: boolean;
    languageIn?: readonly string[];
    resource: rdfjsResource.Resource<rdfjs.NamedNode>;
  }): purify.Either<rdfjsResource.Resource.ValueError, ConceptScheme> {
    return Resource.interfaceFromRdf({
      ..._context,
      ignoreRdfType: true,
      languageIn: _languageIn,
      resource: _resource,
    }).chain((_super) => {
      if (
        !_ignoreRdfType &&
        !_resource.isInstanceOf(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#ConceptScheme",
          ),
        )
      ) {
        return purify.Left(
          new rdfjsResource.Resource.ValueError({
            focusResource: _resource,
            message: `${rdfjsResource.Resource.Identifier.toString(_resource.identifier)} has unexpected RDF type`,
            predicate: dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#ConceptScheme",
            ),
          }),
        );
      }
      const _hasTopConceptEither: purify.Either<
        rdfjsResource.Resource.ValueError,
        readonly ConceptStub[]
      > = purify.Either.of([
        ..._resource
          .values(
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#hasTopConcept",
            ),
            { unique: true },
          )
          .flatMap((_value) =>
            _value
              .toValues()
              .head()
              .chain((value) => value.toResource())
              .chain((_resource) =>
                ConceptStub.fromRdf({
                  ..._context,
                  languageIn: _languageIn,
                  resource: _resource,
                }),
              )
              .toMaybe()
              .toList(),
          ),
      ]);
      if (_hasTopConceptEither.isLeft()) {
        return _hasTopConceptEither;
      }
      const hasTopConcept = _hasTopConceptEither.unsafeCoerce();
      const identifier = _resource.identifier;
      const _licenseEither: purify.Either<
        rdfjsResource.Resource.ValueError,
        purify.Maybe<rdfjs.NamedNode | rdfjs.Literal>
      > = purify.Either.of(
        (
          _resource
            .values(dataFactory.namedNode("http://purl.org/dc/terms/license"), {
              unique: true,
            })
            .head()
            .chain((_value) => _value.toIri()) as purify.Either<
            rdfjsResource.Resource.ValueError,
            rdfjs.NamedNode | rdfjs.Literal
          >
        )
          .altLazy(
            () =>
              _resource
                .values(
                  dataFactory.namedNode("http://purl.org/dc/terms/license"),
                  { unique: true },
                )
                .filter((_value) => {
                  const _languageInOrDefault = _languageIn ?? [];
                  if (_languageInOrDefault.length === 0) {
                    return true;
                  }
                  const _valueLiteral = _value.toLiteral().toMaybe().extract();
                  if (typeof _valueLiteral === "undefined") {
                    return false;
                  }
                  return _languageInOrDefault.some(
                    (_languageIn) => _languageIn === _valueLiteral.language,
                  );
                })
                .head()
                .chain((_value) => _value.toLiteral()) as purify.Either<
                rdfjsResource.Resource.ValueError,
                rdfjs.NamedNode | rdfjs.Literal
              >,
          )
          .toMaybe(),
      );
      if (_licenseEither.isLeft()) {
        return _licenseEither;
      }
      const license = _licenseEither.unsafeCoerce();
      const _rightsEither: purify.Either<
        rdfjsResource.Resource.ValueError,
        purify.Maybe<rdfjs.Literal>
      > = purify.Either.of(
        _resource
          .values(dataFactory.namedNode("http://purl.org/dc/terms/rights"), {
            unique: true,
          })
          .filter((_value) => {
            const _languageInOrDefault = _languageIn ?? [];
            if (_languageInOrDefault.length === 0) {
              return true;
            }
            const _valueLiteral = _value.toLiteral().toMaybe().extract();
            if (typeof _valueLiteral === "undefined") {
              return false;
            }
            return _languageInOrDefault.some(
              (_languageIn) => _languageIn === _valueLiteral.language,
            );
          })
          .head()
          .chain((_value) => _value.toLiteral())
          .toMaybe(),
      );
      if (_rightsEither.isLeft()) {
        return _rightsEither;
      }
      const rights = _rightsEither.unsafeCoerce();
      const _rightsHolderEither: purify.Either<
        rdfjsResource.Resource.ValueError,
        purify.Maybe<rdfjs.Literal>
      > = purify.Either.of(
        _resource
          .values(
            dataFactory.namedNode("http://purl.org/dc/terms/rightsHolder"),
            { unique: true },
          )
          .filter((_value) => {
            const _languageInOrDefault = _languageIn ?? [];
            if (_languageInOrDefault.length === 0) {
              return true;
            }
            const _valueLiteral = _value.toLiteral().toMaybe().extract();
            if (typeof _valueLiteral === "undefined") {
              return false;
            }
            return _languageInOrDefault.some(
              (_languageIn) => _languageIn === _valueLiteral.language,
            );
          })
          .head()
          .chain((_value) => _value.toLiteral())
          .toMaybe(),
      );
      if (_rightsHolderEither.isLeft()) {
        return _rightsHolderEither;
      }
      const rightsHolder = _rightsHolderEither.unsafeCoerce();
      return purify.Either.of(
        new ConceptScheme({
          altLabel: _super.altLabel,
          altLabelXl: _super.altLabelXl,
          changeNote: _super.changeNote,
          definition: _super.definition,
          editorialNote: _super.editorialNote,
          example: _super.example,
          hiddenLabel: _super.hiddenLabel,
          hiddenLabelXl: _super.hiddenLabelXl,
          historyNote: _super.historyNote,
          identifier,
          modified: _super.modified,
          notation: _super.notation,
          note: _super.note,
          prefLabel: _super.prefLabel,
          prefLabelXl: _super.prefLabelXl,
          scopeNote: _super.scopeNote,
          hasTopConcept,
          license,
          rights,
          rightsHolder,
        }),
      );
    });
  }

  export class SparqlGraphPatterns extends Resource.SparqlGraphPatterns {
    constructor(
      subject: sparqlBuilder.ResourceGraphPatterns.SubjectParameter,
      _options?: { ignoreRdfType?: boolean },
    ) {
      super(subject, { ignoreRdfType: true });
      if (!_options?.ignoreRdfType) {
        this.add(
          ...new sparqlBuilder.RdfTypeGraphPatterns(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#ConceptScheme",
            ),
          ),
        );
      }

      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.group(
            sparqlBuilder.GraphPattern.basic(
              this.subject,
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#hasTopConcept",
              ),
              this.variable("HasTopConcept"),
            ).chainObject(
              (_object) => new ConceptStub.SparqlGraphPatterns(_object),
            ),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.union(
            sparqlBuilder.GraphPattern.basic(
              this.subject,
              dataFactory.namedNode("http://purl.org/dc/terms/license"),
              this.variable("License"),
            ),
            sparqlBuilder.GraphPattern.basic(
              this.subject,
              dataFactory.namedNode("http://purl.org/dc/terms/license"),
              this.variable("License"),
            ),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode("http://purl.org/dc/terms/rights"),
            this.variable("Rights"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode("http://purl.org/dc/terms/rightsHolder"),
            this.variable("RightsHolder"),
          ),
        ),
      );
    }
  }
}
export class ConceptSchemeStub extends ResourceStub {
  private _identifier: rdfjs.BlankNode | rdfjs.NamedNode | undefined;
  override readonly type = "ConceptSchemeStub";

  constructor(
    parameters: {
      readonly identifier?: rdfjs.BlankNode | rdfjs.NamedNode;
    } & ConstructorParameters<typeof ResourceStub>[0],
  ) {
    super(parameters);
    this._identifier = parameters.identifier;
  }

  override get identifier(): rdfjs.BlankNode | rdfjs.NamedNode {
    if (typeof this._identifier === "undefined") {
      this._identifier = dataFactory.namedNode(
        `urn:shaclmate:object:${this.type}:${this.hash(sha256.create())}`,
      );
    }
    return this._identifier;
  }

  override toRdf({
    ignoreRdfType,
    mutateGraph,
    resourceSet,
  }: {
    ignoreRdfType?: boolean;
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource {
    const _resource = super.toRdf({
      ignoreRdfType: true,
      mutateGraph,
      resourceSet,
    });
    if (!ignoreRdfType) {
      _resource.add(
        _resource.dataFactory.namedNode(
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        ),
        _resource.dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#ConceptScheme",
        ),
      );
    }

    return _resource;
  }

  override toString(): string {
    return JSON.stringify(this.toJson());
  }
}

export namespace ConceptSchemeStub {
  export function fromRdf({
    ignoreRdfType: _ignoreRdfType,
    languageIn: _languageIn,
    resource: _resource,
    // @ts-ignore
    ..._context
  }: {
    [_index: string]: any;
    ignoreRdfType?: boolean;
    languageIn?: readonly string[];
    resource: rdfjsResource.Resource;
  }): purify.Either<rdfjsResource.Resource.ValueError, ConceptSchemeStub> {
    return ResourceStub.interfaceFromRdf({
      ..._context,
      ignoreRdfType: true,
      languageIn: _languageIn,
      resource: _resource,
    }).chain((_super) => {
      if (
        !_ignoreRdfType &&
        !_resource.isInstanceOf(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#ConceptScheme",
          ),
        )
      ) {
        return purify.Left(
          new rdfjsResource.Resource.ValueError({
            focusResource: _resource,
            message: `${rdfjsResource.Resource.Identifier.toString(_resource.identifier)} has unexpected RDF type`,
            predicate: dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#ConceptScheme",
            ),
          }),
        );
      }
      const identifier = _resource.identifier;
      return purify.Either.of(
        new ConceptSchemeStub({
          identifier,
          prefLabel: _super.prefLabel,
          prefLabelXl: _super.prefLabelXl,
        }),
      );
    });
  }

  export class SparqlGraphPatterns extends ResourceStub.SparqlGraphPatterns {
    constructor(
      subject: sparqlBuilder.ResourceGraphPatterns.SubjectParameter,
      _options?: { ignoreRdfType?: boolean },
    ) {
      super(subject, { ignoreRdfType: true });
      if (!_options?.ignoreRdfType) {
        this.add(
          ...new sparqlBuilder.RdfTypeGraphPatterns(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#ConceptScheme",
            ),
          ),
        );
      }
    }
  }
}
