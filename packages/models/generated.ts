import * as sparqlBuilder from "@kos-kit/sparql-builder";
import type * as rdfjs from "@rdfjs/types";
import { DataFactory as dataFactory } from "n3";
import * as purify from "purify-ts";
import * as rdfLiteral from "rdf-literal";
import * as rdfjsResource from "rdfjs-resource";
export interface LabelStub {
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly literalForm: purify.NonEmptyList<rdfjs.Literal>;
  readonly type: "LabelStub";
}

export namespace LabelStub {
  export function create(parameters: {
    readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
    readonly literalForm: purify.NonEmptyList<rdfjs.Literal>;
  }): LabelStub {
    const identifier = parameters.identifier;
    const literalForm = parameters.literalForm;
    const type = "LabelStub" as const;
    return { identifier, literalForm, type };
  }

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
      purify.NonEmptyList<rdfjs.Literal>
    > = purify.NonEmptyList.fromArray([
      ..._resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2008/05/skos-xl#literalForm",
          ),
          { unique: true },
        )
        .flatMap((_item) =>
          _item
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
    ]).toEither(
      new rdfjsResource.Resource.ValueError({
        focusResource: _resource,
        message: `${rdfjsResource.Resource.Identifier.toString(_resource.identifier)} is empty`,
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2008/05/skos-xl#literalForm",
        ),
      }),
    );
    if (_literalFormEither.isLeft()) {
      return _literalFormEither;
    }

    const literalForm = _literalFormEither.unsafeCoerce();
    const type = "LabelStub" as const;
    return purify.Either.of({ identifier, literalForm, type });
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
export interface KosResourceStub {
  readonly identifier: rdfjs.NamedNode;
  readonly prefLabel: readonly rdfjs.Literal[];
  readonly prefLabelXl: readonly LabelStub[];
  readonly type: "ConceptSchemeStub" | "ConceptStub";
}

export namespace KosResourceStub {
  export function create(parameters: {
    readonly identifier: rdfjs.NamedNode;
    readonly prefLabel?: readonly rdfjs.Literal[];
    readonly prefLabelXl?: readonly LabelStub[];
  }): Omit<KosResourceStub, "type"> {
    const identifier = parameters.identifier;
    let prefLabel: readonly rdfjs.Literal[];
    if (typeof parameters.prefLabel === "undefined") {
      prefLabel = [];
    } else if (Array.isArray(parameters.prefLabel)) {
      prefLabel = parameters.prefLabel;
    } else {
      prefLabel = parameters.prefLabel as never;
    }

    let prefLabelXl: readonly LabelStub[];
    if (typeof parameters.prefLabelXl === "undefined") {
      prefLabelXl = [];
    } else if (Array.isArray(parameters.prefLabelXl)) {
      prefLabelXl = parameters.prefLabelXl;
    } else {
      prefLabelXl = parameters.prefLabelXl as never;
    }

    return { identifier, prefLabel, prefLabelXl };
  }

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
  }): purify.Either<
    rdfjsResource.Resource.ValueError,
    {
      identifier: rdfjs.NamedNode;
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
        .flatMap((_item) =>
          _item
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
        .flatMap((_item) =>
          _item
            .toValues()
            .head()
            .chain((value) => value.toResource())
            .chain((_resource) =>
              LabelStub.fromRdf({
                ..._context,
                ignoreRdfType: true,
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
              (_object) =>
                new LabelStub.SparqlGraphPatterns(_object, {
                  ignoreRdfType: true,
                }),
            ),
          ),
        ),
      );
    }
  }
}
export interface KosResource {
  readonly altLabel: readonly rdfjs.Literal[];
  readonly altLabelXl: readonly Label[];
  readonly changeNote: readonly rdfjs.Literal[];
  readonly definition: readonly rdfjs.Literal[];
  readonly editorialNote: readonly rdfjs.Literal[];
  readonly example: readonly rdfjs.Literal[];
  readonly hiddenLabel: readonly rdfjs.Literal[];
  readonly hiddenLabelXl: readonly Label[];
  readonly historyNote: readonly rdfjs.Literal[];
  readonly identifier: rdfjs.NamedNode;
  readonly modified: purify.Maybe<Date>;
  readonly notation: readonly rdfjs.Literal[];
  readonly note: readonly rdfjs.Literal[];
  readonly prefLabel: readonly rdfjs.Literal[];
  readonly prefLabelXl: readonly Label[];
  readonly scopeNote: readonly rdfjs.Literal[];
  readonly type: "Concept" | "ConceptScheme";
}

export namespace KosResource {
  export function create(parameters: {
    readonly altLabel?: readonly rdfjs.Literal[];
    readonly altLabelXl?: readonly Label[];
    readonly changeNote?: readonly rdfjs.Literal[];
    readonly definition?: readonly rdfjs.Literal[];
    readonly editorialNote?: readonly rdfjs.Literal[];
    readonly example?: readonly rdfjs.Literal[];
    readonly hiddenLabel?: readonly rdfjs.Literal[];
    readonly hiddenLabelXl?: readonly Label[];
    readonly historyNote?: readonly rdfjs.Literal[];
    readonly identifier: rdfjs.NamedNode;
    readonly modified?: Date | purify.Maybe<Date>;
    readonly notation?: readonly rdfjs.Literal[];
    readonly note?: readonly rdfjs.Literal[];
    readonly prefLabel?: readonly rdfjs.Literal[];
    readonly prefLabelXl?: readonly Label[];
    readonly scopeNote?: readonly rdfjs.Literal[];
  }): Omit<KosResource, "type"> {
    let altLabel: readonly rdfjs.Literal[];
    if (typeof parameters.altLabel === "undefined") {
      altLabel = [];
    } else if (Array.isArray(parameters.altLabel)) {
      altLabel = parameters.altLabel;
    } else {
      altLabel = parameters.altLabel as never;
    }

    let altLabelXl: readonly Label[];
    if (typeof parameters.altLabelXl === "undefined") {
      altLabelXl = [];
    } else if (Array.isArray(parameters.altLabelXl)) {
      altLabelXl = parameters.altLabelXl;
    } else {
      altLabelXl = parameters.altLabelXl as never;
    }

    let changeNote: readonly rdfjs.Literal[];
    if (typeof parameters.changeNote === "undefined") {
      changeNote = [];
    } else if (Array.isArray(parameters.changeNote)) {
      changeNote = parameters.changeNote;
    } else {
      changeNote = parameters.changeNote as never;
    }

    let definition: readonly rdfjs.Literal[];
    if (typeof parameters.definition === "undefined") {
      definition = [];
    } else if (Array.isArray(parameters.definition)) {
      definition = parameters.definition;
    } else {
      definition = parameters.definition as never;
    }

    let editorialNote: readonly rdfjs.Literal[];
    if (typeof parameters.editorialNote === "undefined") {
      editorialNote = [];
    } else if (Array.isArray(parameters.editorialNote)) {
      editorialNote = parameters.editorialNote;
    } else {
      editorialNote = parameters.editorialNote as never;
    }

    let example: readonly rdfjs.Literal[];
    if (typeof parameters.example === "undefined") {
      example = [];
    } else if (Array.isArray(parameters.example)) {
      example = parameters.example;
    } else {
      example = parameters.example as never;
    }

    let hiddenLabel: readonly rdfjs.Literal[];
    if (typeof parameters.hiddenLabel === "undefined") {
      hiddenLabel = [];
    } else if (Array.isArray(parameters.hiddenLabel)) {
      hiddenLabel = parameters.hiddenLabel;
    } else {
      hiddenLabel = parameters.hiddenLabel as never;
    }

    let hiddenLabelXl: readonly Label[];
    if (typeof parameters.hiddenLabelXl === "undefined") {
      hiddenLabelXl = [];
    } else if (Array.isArray(parameters.hiddenLabelXl)) {
      hiddenLabelXl = parameters.hiddenLabelXl;
    } else {
      hiddenLabelXl = parameters.hiddenLabelXl as never;
    }

    let historyNote: readonly rdfjs.Literal[];
    if (typeof parameters.historyNote === "undefined") {
      historyNote = [];
    } else if (Array.isArray(parameters.historyNote)) {
      historyNote = parameters.historyNote;
    } else {
      historyNote = parameters.historyNote as never;
    }

    const identifier = parameters.identifier;
    let modified: purify.Maybe<Date>;
    if (purify.Maybe.isMaybe(parameters.modified)) {
      modified = parameters.modified;
    } else if (
      typeof parameters.modified === "object" &&
      parameters.modified instanceof Date
    ) {
      modified = purify.Maybe.of(parameters.modified);
    } else if (typeof parameters.modified === "undefined") {
      modified = purify.Maybe.empty();
    } else {
      modified = parameters.modified as never;
    }

    let notation: readonly rdfjs.Literal[];
    if (typeof parameters.notation === "undefined") {
      notation = [];
    } else if (Array.isArray(parameters.notation)) {
      notation = parameters.notation;
    } else {
      notation = parameters.notation as never;
    }

    let note: readonly rdfjs.Literal[];
    if (typeof parameters.note === "undefined") {
      note = [];
    } else if (Array.isArray(parameters.note)) {
      note = parameters.note;
    } else {
      note = parameters.note as never;
    }

    let prefLabel: readonly rdfjs.Literal[];
    if (typeof parameters.prefLabel === "undefined") {
      prefLabel = [];
    } else if (Array.isArray(parameters.prefLabel)) {
      prefLabel = parameters.prefLabel;
    } else {
      prefLabel = parameters.prefLabel as never;
    }

    let prefLabelXl: readonly Label[];
    if (typeof parameters.prefLabelXl === "undefined") {
      prefLabelXl = [];
    } else if (Array.isArray(parameters.prefLabelXl)) {
      prefLabelXl = parameters.prefLabelXl;
    } else {
      prefLabelXl = parameters.prefLabelXl as never;
    }

    let scopeNote: readonly rdfjs.Literal[];
    if (typeof parameters.scopeNote === "undefined") {
      scopeNote = [];
    } else if (Array.isArray(parameters.scopeNote)) {
      scopeNote = parameters.scopeNote;
    } else {
      scopeNote = parameters.scopeNote as never;
    }

    return {
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
    };
  }

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
  }): purify.Either<
    rdfjsResource.Resource.ValueError,
    {
      altLabel: readonly rdfjs.Literal[];
      altLabelXl: readonly Label[];
      changeNote: readonly rdfjs.Literal[];
      definition: readonly rdfjs.Literal[];
      editorialNote: readonly rdfjs.Literal[];
      example: readonly rdfjs.Literal[];
      hiddenLabel: readonly rdfjs.Literal[];
      hiddenLabelXl: readonly Label[];
      historyNote: readonly rdfjs.Literal[];
      identifier: rdfjs.NamedNode;
      modified: purify.Maybe<Date>;
      notation: readonly rdfjs.Literal[];
      note: readonly rdfjs.Literal[];
      prefLabel: readonly rdfjs.Literal[];
      prefLabelXl: readonly Label[];
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
        .flatMap((_item) =>
          _item
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
      readonly Label[]
    > = purify.Either.of([
      ..._resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#altLabel"),
          { unique: true },
        )
        .flatMap((_item) =>
          _item
            .toValues()
            .head()
            .chain((value) => value.toResource())
            .chain((_resource) =>
              Label.fromRdf({
                ..._context,
                ignoreRdfType: true,
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
        .flatMap((_item) =>
          _item
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
        .flatMap((_item) =>
          _item
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
        .flatMap((_item) =>
          _item
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
        .flatMap((_item) =>
          _item
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
        .flatMap((_item) =>
          _item
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
      readonly Label[]
    > = purify.Either.of([
      ..._resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2008/05/skos-xl#hiddenLabel",
          ),
          { unique: true },
        )
        .flatMap((_item) =>
          _item
            .toValues()
            .head()
            .chain((value) => value.toResource())
            .chain((_resource) =>
              Label.fromRdf({
                ..._context,
                ignoreRdfType: true,
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
        .flatMap((_item) =>
          _item
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
        .flatMap((_item) =>
          _item
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
        .flatMap((_item) =>
          _item
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
        .flatMap((_item) =>
          _item
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
      readonly Label[]
    > = purify.Either.of([
      ..._resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#prefLabel"),
          { unique: true },
        )
        .flatMap((_item) =>
          _item
            .toValues()
            .head()
            .chain((value) => value.toResource())
            .chain((_resource) =>
              Label.fromRdf({
                ..._context,
                ignoreRdfType: true,
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
        .flatMap((_item) =>
          _item
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
              (_object) =>
                new Label.SparqlGraphPatterns(_object, { ignoreRdfType: true }),
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
              (_object) =>
                new Label.SparqlGraphPatterns(_object, { ignoreRdfType: true }),
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
              (_object) =>
                new Label.SparqlGraphPatterns(_object, { ignoreRdfType: true }),
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
export interface ConceptScheme extends KosResource {
  readonly hasTopConcept: readonly ConceptStub[];
  readonly identifier: rdfjs.NamedNode;
  readonly license: purify.Maybe<rdfjs.NamedNode | rdfjs.Literal>;
  readonly rights: purify.Maybe<rdfjs.Literal>;
  readonly rightsHolder: purify.Maybe<rdfjs.Literal>;
  readonly type: "ConceptScheme";
}

export namespace ConceptScheme {
  export function create(
    parameters: {
      readonly hasTopConcept?: readonly ConceptStub[];
      readonly identifier: rdfjs.NamedNode;
      readonly license?:
        | (rdfjs.NamedNode | rdfjs.Literal)
        | purify.Maybe<rdfjs.NamedNode | rdfjs.Literal>;
      readonly rights?:
        | rdfjs.Literal
        | Date
        | boolean
        | number
        | purify.Maybe<rdfjs.Literal>
        | string;
      readonly rightsHolder?:
        | rdfjs.Literal
        | Date
        | boolean
        | number
        | purify.Maybe<rdfjs.Literal>
        | string;
    } & Parameters<typeof KosResource.create>[0],
  ): ConceptScheme {
    let hasTopConcept: readonly ConceptStub[];
    if (typeof parameters.hasTopConcept === "undefined") {
      hasTopConcept = [];
    } else if (Array.isArray(parameters.hasTopConcept)) {
      hasTopConcept = parameters.hasTopConcept;
    } else {
      hasTopConcept = parameters.hasTopConcept as never;
    }

    const identifier = parameters.identifier;
    let license: purify.Maybe<rdfjs.NamedNode | rdfjs.Literal>;
    if (purify.Maybe.isMaybe(parameters.license)) {
      license = parameters.license;
    } else if (typeof parameters.license === "object") {
      license = purify.Maybe.of(parameters.license);
    } else if (typeof parameters.license === "undefined") {
      license = purify.Maybe.empty();
    } else {
      license = parameters.license as never;
    }

    let rights: purify.Maybe<rdfjs.Literal>;
    if (purify.Maybe.isMaybe(parameters.rights)) {
      rights = parameters.rights;
    } else if (typeof parameters.rights === "boolean") {
      rights = purify.Maybe.of(rdfLiteral.toRdf(parameters.rights));
    } else if (
      typeof parameters.rights === "object" &&
      parameters.rights instanceof Date
    ) {
      rights = purify.Maybe.of(rdfLiteral.toRdf(parameters.rights));
    } else if (typeof parameters.rights === "number") {
      rights = purify.Maybe.of(rdfLiteral.toRdf(parameters.rights));
    } else if (typeof parameters.rights === "string") {
      rights = purify.Maybe.of(dataFactory.literal(parameters.rights));
    } else if (typeof parameters.rights === "object") {
      rights = purify.Maybe.of(parameters.rights);
    } else if (typeof parameters.rights === "undefined") {
      rights = purify.Maybe.empty();
    } else {
      rights = parameters.rights as never;
    }

    let rightsHolder: purify.Maybe<rdfjs.Literal>;
    if (purify.Maybe.isMaybe(parameters.rightsHolder)) {
      rightsHolder = parameters.rightsHolder;
    } else if (typeof parameters.rightsHolder === "boolean") {
      rightsHolder = purify.Maybe.of(rdfLiteral.toRdf(parameters.rightsHolder));
    } else if (
      typeof parameters.rightsHolder === "object" &&
      parameters.rightsHolder instanceof Date
    ) {
      rightsHolder = purify.Maybe.of(rdfLiteral.toRdf(parameters.rightsHolder));
    } else if (typeof parameters.rightsHolder === "number") {
      rightsHolder = purify.Maybe.of(rdfLiteral.toRdf(parameters.rightsHolder));
    } else if (typeof parameters.rightsHolder === "string") {
      rightsHolder = purify.Maybe.of(
        dataFactory.literal(parameters.rightsHolder),
      );
    } else if (typeof parameters.rightsHolder === "object") {
      rightsHolder = purify.Maybe.of(parameters.rightsHolder);
    } else if (typeof parameters.rightsHolder === "undefined") {
      rightsHolder = purify.Maybe.empty();
    } else {
      rightsHolder = parameters.rightsHolder as never;
    }

    const type = "ConceptScheme" as const;
    return {
      ...KosResource.create(parameters),
      hasTopConcept,
      identifier,
      license,
      rights,
      rightsHolder,
      type,
    };
  }

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
    return KosResource.fromRdf({
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
          .flatMap((_item) =>
            _item
              .toValues()
              .head()
              .chain((value) => value.toNamedResource())
              .chain((_resource) =>
                ConceptStub.fromRdf({
                  ..._context,
                  ignoreRdfType: true,
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
      const type = "ConceptScheme" as const;
      return purify.Either.of({
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
        type,
      });
    });
  }

  export class SparqlGraphPatterns extends KosResource.SparqlGraphPatterns {
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
              (_object) =>
                new ConceptStub.SparqlGraphPatterns(_object, {
                  ignoreRdfType: true,
                }),
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
export interface ConceptSchemeStub extends KosResourceStub {
  readonly identifier: rdfjs.NamedNode;
  readonly type: "ConceptSchemeStub";
}

export namespace ConceptSchemeStub {
  export function create(
    parameters: { readonly identifier: rdfjs.NamedNode } & Parameters<
      typeof KosResourceStub.create
    >[0],
  ): ConceptSchemeStub {
    const identifier = parameters.identifier;
    const type = "ConceptSchemeStub" as const;
    return { ...KosResourceStub.create(parameters), identifier, type };
  }

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
  }): purify.Either<rdfjsResource.Resource.ValueError, ConceptSchemeStub> {
    return KosResourceStub.fromRdf({
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
      const type = "ConceptSchemeStub" as const;
      return purify.Either.of({
        identifier,
        prefLabel: _super.prefLabel,
        prefLabelXl: _super.prefLabelXl,
        type,
      });
    });
  }

  export class SparqlGraphPatterns extends KosResourceStub.SparqlGraphPatterns {
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
export interface ConceptStub extends KosResourceStub {
  readonly identifier: rdfjs.NamedNode;
  readonly type: "ConceptStub";
}

export namespace ConceptStub {
  export function create(
    parameters: { readonly identifier: rdfjs.NamedNode } & Parameters<
      typeof KosResourceStub.create
    >[0],
  ): ConceptStub {
    const identifier = parameters.identifier;
    const type = "ConceptStub" as const;
    return { ...KosResourceStub.create(parameters), identifier, type };
  }

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
  }): purify.Either<rdfjsResource.Resource.ValueError, ConceptStub> {
    return KosResourceStub.fromRdf({
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
      const type = "ConceptStub" as const;
      return purify.Either.of({
        identifier,
        prefLabel: _super.prefLabel,
        prefLabelXl: _super.prefLabelXl,
        type,
      });
    });
  }

  export class SparqlGraphPatterns extends KosResourceStub.SparqlGraphPatterns {
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
export interface Concept extends KosResource {
  readonly broader: readonly ConceptStub[];
  readonly broaderTransitive: readonly ConceptStub[];
  readonly broadMatch: readonly ConceptStub[];
  readonly closeMatch: readonly ConceptStub[];
  readonly exactMatch: readonly ConceptStub[];
  readonly identifier: rdfjs.NamedNode;
  readonly inScheme: readonly ConceptSchemeStub[];
  readonly mappingRelation: readonly ConceptStub[];
  readonly narrower: readonly ConceptStub[];
  readonly narrowerTransitive: readonly ConceptStub[];
  readonly narrowMatch: readonly ConceptStub[];
  readonly related: readonly ConceptStub[];
  readonly relatedMatch: readonly ConceptStub[];
  readonly semanticRelation: readonly ConceptStub[];
  readonly topConceptOf: readonly ConceptSchemeStub[];
  readonly type: "Concept";
}

export namespace Concept {
  export function create(
    parameters: {
      readonly broader?: readonly ConceptStub[];
      readonly broaderTransitive?: readonly ConceptStub[];
      readonly broadMatch?: readonly ConceptStub[];
      readonly closeMatch?: readonly ConceptStub[];
      readonly exactMatch?: readonly ConceptStub[];
      readonly identifier: rdfjs.NamedNode;
      readonly inScheme?: readonly ConceptSchemeStub[];
      readonly mappingRelation?: readonly ConceptStub[];
      readonly narrower?: readonly ConceptStub[];
      readonly narrowerTransitive?: readonly ConceptStub[];
      readonly narrowMatch?: readonly ConceptStub[];
      readonly related?: readonly ConceptStub[];
      readonly relatedMatch?: readonly ConceptStub[];
      readonly semanticRelation?: readonly ConceptStub[];
      readonly topConceptOf?: readonly ConceptSchemeStub[];
    } & Parameters<typeof KosResource.create>[0],
  ): Concept {
    let broader: readonly ConceptStub[];
    if (typeof parameters.broader === "undefined") {
      broader = [];
    } else if (Array.isArray(parameters.broader)) {
      broader = parameters.broader;
    } else {
      broader = parameters.broader as never;
    }

    let broaderTransitive: readonly ConceptStub[];
    if (typeof parameters.broaderTransitive === "undefined") {
      broaderTransitive = [];
    } else if (Array.isArray(parameters.broaderTransitive)) {
      broaderTransitive = parameters.broaderTransitive;
    } else {
      broaderTransitive = parameters.broaderTransitive as never;
    }

    let broadMatch: readonly ConceptStub[];
    if (typeof parameters.broadMatch === "undefined") {
      broadMatch = [];
    } else if (Array.isArray(parameters.broadMatch)) {
      broadMatch = parameters.broadMatch;
    } else {
      broadMatch = parameters.broadMatch as never;
    }

    let closeMatch: readonly ConceptStub[];
    if (typeof parameters.closeMatch === "undefined") {
      closeMatch = [];
    } else if (Array.isArray(parameters.closeMatch)) {
      closeMatch = parameters.closeMatch;
    } else {
      closeMatch = parameters.closeMatch as never;
    }

    let exactMatch: readonly ConceptStub[];
    if (typeof parameters.exactMatch === "undefined") {
      exactMatch = [];
    } else if (Array.isArray(parameters.exactMatch)) {
      exactMatch = parameters.exactMatch;
    } else {
      exactMatch = parameters.exactMatch as never;
    }

    const identifier = parameters.identifier;
    let inScheme: readonly ConceptSchemeStub[];
    if (typeof parameters.inScheme === "undefined") {
      inScheme = [];
    } else if (Array.isArray(parameters.inScheme)) {
      inScheme = parameters.inScheme;
    } else {
      inScheme = parameters.inScheme as never;
    }

    let mappingRelation: readonly ConceptStub[];
    if (typeof parameters.mappingRelation === "undefined") {
      mappingRelation = [];
    } else if (Array.isArray(parameters.mappingRelation)) {
      mappingRelation = parameters.mappingRelation;
    } else {
      mappingRelation = parameters.mappingRelation as never;
    }

    let narrower: readonly ConceptStub[];
    if (typeof parameters.narrower === "undefined") {
      narrower = [];
    } else if (Array.isArray(parameters.narrower)) {
      narrower = parameters.narrower;
    } else {
      narrower = parameters.narrower as never;
    }

    let narrowerTransitive: readonly ConceptStub[];
    if (typeof parameters.narrowerTransitive === "undefined") {
      narrowerTransitive = [];
    } else if (Array.isArray(parameters.narrowerTransitive)) {
      narrowerTransitive = parameters.narrowerTransitive;
    } else {
      narrowerTransitive = parameters.narrowerTransitive as never;
    }

    let narrowMatch: readonly ConceptStub[];
    if (typeof parameters.narrowMatch === "undefined") {
      narrowMatch = [];
    } else if (Array.isArray(parameters.narrowMatch)) {
      narrowMatch = parameters.narrowMatch;
    } else {
      narrowMatch = parameters.narrowMatch as never;
    }

    let related: readonly ConceptStub[];
    if (typeof parameters.related === "undefined") {
      related = [];
    } else if (Array.isArray(parameters.related)) {
      related = parameters.related;
    } else {
      related = parameters.related as never;
    }

    let relatedMatch: readonly ConceptStub[];
    if (typeof parameters.relatedMatch === "undefined") {
      relatedMatch = [];
    } else if (Array.isArray(parameters.relatedMatch)) {
      relatedMatch = parameters.relatedMatch;
    } else {
      relatedMatch = parameters.relatedMatch as never;
    }

    let semanticRelation: readonly ConceptStub[];
    if (typeof parameters.semanticRelation === "undefined") {
      semanticRelation = [];
    } else if (Array.isArray(parameters.semanticRelation)) {
      semanticRelation = parameters.semanticRelation;
    } else {
      semanticRelation = parameters.semanticRelation as never;
    }

    let topConceptOf: readonly ConceptSchemeStub[];
    if (typeof parameters.topConceptOf === "undefined") {
      topConceptOf = [];
    } else if (Array.isArray(parameters.topConceptOf)) {
      topConceptOf = parameters.topConceptOf;
    } else {
      topConceptOf = parameters.topConceptOf as never;
    }

    const type = "Concept" as const;
    return {
      ...KosResource.create(parameters),
      broader,
      broaderTransitive,
      broadMatch,
      closeMatch,
      exactMatch,
      identifier,
      inScheme,
      mappingRelation,
      narrower,
      narrowerTransitive,
      narrowMatch,
      related,
      relatedMatch,
      semanticRelation,
      topConceptOf,
      type,
    };
  }

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
    return KosResource.fromRdf({
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
          .flatMap((_item) =>
            _item
              .toValues()
              .head()
              .chain((value) => value.toNamedResource())
              .chain((_resource) =>
                ConceptStub.fromRdf({
                  ..._context,
                  ignoreRdfType: true,
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
          .flatMap((_item) =>
            _item
              .toValues()
              .head()
              .chain((value) => value.toNamedResource())
              .chain((_resource) =>
                ConceptStub.fromRdf({
                  ..._context,
                  ignoreRdfType: true,
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
          .flatMap((_item) =>
            _item
              .toValues()
              .head()
              .chain((value) => value.toNamedResource())
              .chain((_resource) =>
                ConceptStub.fromRdf({
                  ..._context,
                  ignoreRdfType: true,
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
          .flatMap((_item) =>
            _item
              .toValues()
              .head()
              .chain((value) => value.toNamedResource())
              .chain((_resource) =>
                ConceptStub.fromRdf({
                  ..._context,
                  ignoreRdfType: true,
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
          .flatMap((_item) =>
            _item
              .toValues()
              .head()
              .chain((value) => value.toNamedResource())
              .chain((_resource) =>
                ConceptStub.fromRdf({
                  ..._context,
                  ignoreRdfType: true,
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
          .flatMap((_item) =>
            _item
              .toValues()
              .head()
              .chain((value) => value.toNamedResource())
              .chain((_resource) =>
                ConceptSchemeStub.fromRdf({
                  ..._context,
                  ignoreRdfType: true,
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
          .flatMap((_item) =>
            _item
              .toValues()
              .head()
              .chain((value) => value.toNamedResource())
              .chain((_resource) =>
                ConceptStub.fromRdf({
                  ..._context,
                  ignoreRdfType: true,
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
          .flatMap((_item) =>
            _item
              .toValues()
              .head()
              .chain((value) => value.toNamedResource())
              .chain((_resource) =>
                ConceptStub.fromRdf({
                  ..._context,
                  ignoreRdfType: true,
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
          .flatMap((_item) =>
            _item
              .toValues()
              .head()
              .chain((value) => value.toNamedResource())
              .chain((_resource) =>
                ConceptStub.fromRdf({
                  ..._context,
                  ignoreRdfType: true,
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
          .flatMap((_item) =>
            _item
              .toValues()
              .head()
              .chain((value) => value.toNamedResource())
              .chain((_resource) =>
                ConceptStub.fromRdf({
                  ..._context,
                  ignoreRdfType: true,
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
          .flatMap((_item) =>
            _item
              .toValues()
              .head()
              .chain((value) => value.toNamedResource())
              .chain((_resource) =>
                ConceptStub.fromRdf({
                  ..._context,
                  ignoreRdfType: true,
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
          .flatMap((_item) =>
            _item
              .toValues()
              .head()
              .chain((value) => value.toNamedResource())
              .chain((_resource) =>
                ConceptStub.fromRdf({
                  ..._context,
                  ignoreRdfType: true,
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
          .flatMap((_item) =>
            _item
              .toValues()
              .head()
              .chain((value) => value.toNamedResource())
              .chain((_resource) =>
                ConceptStub.fromRdf({
                  ..._context,
                  ignoreRdfType: true,
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
          .flatMap((_item) =>
            _item
              .toValues()
              .head()
              .chain((value) => value.toNamedResource())
              .chain((_resource) =>
                ConceptSchemeStub.fromRdf({
                  ..._context,
                  ignoreRdfType: true,
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
      const type = "Concept" as const;
      return purify.Either.of({
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
        type,
      });
    });
  }

  export class SparqlGraphPatterns extends KosResource.SparqlGraphPatterns {
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
              (_object) =>
                new ConceptStub.SparqlGraphPatterns(_object, {
                  ignoreRdfType: true,
                }),
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
              (_object) =>
                new ConceptStub.SparqlGraphPatterns(_object, {
                  ignoreRdfType: true,
                }),
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
              (_object) =>
                new ConceptStub.SparqlGraphPatterns(_object, {
                  ignoreRdfType: true,
                }),
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
              (_object) =>
                new ConceptStub.SparqlGraphPatterns(_object, {
                  ignoreRdfType: true,
                }),
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
              (_object) =>
                new ConceptStub.SparqlGraphPatterns(_object, {
                  ignoreRdfType: true,
                }),
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
              (_object) =>
                new ConceptSchemeStub.SparqlGraphPatterns(_object, {
                  ignoreRdfType: true,
                }),
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
              (_object) =>
                new ConceptStub.SparqlGraphPatterns(_object, {
                  ignoreRdfType: true,
                }),
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
              (_object) =>
                new ConceptStub.SparqlGraphPatterns(_object, {
                  ignoreRdfType: true,
                }),
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
              (_object) =>
                new ConceptStub.SparqlGraphPatterns(_object, {
                  ignoreRdfType: true,
                }),
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
              (_object) =>
                new ConceptStub.SparqlGraphPatterns(_object, {
                  ignoreRdfType: true,
                }),
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
              (_object) =>
                new ConceptStub.SparqlGraphPatterns(_object, {
                  ignoreRdfType: true,
                }),
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
              (_object) =>
                new ConceptStub.SparqlGraphPatterns(_object, {
                  ignoreRdfType: true,
                }),
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
              (_object) =>
                new ConceptStub.SparqlGraphPatterns(_object, {
                  ignoreRdfType: true,
                }),
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
              (_object) =>
                new ConceptSchemeStub.SparqlGraphPatterns(_object, {
                  ignoreRdfType: true,
                }),
            ),
          ),
        ),
      );
    }
  }
}
export interface Label {
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly literalForm: purify.NonEmptyList<rdfjs.Literal>;
  readonly type: "Label";
}

export namespace Label {
  export function create(parameters: {
    readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
    readonly literalForm: purify.NonEmptyList<rdfjs.Literal>;
  }): Label {
    const identifier = parameters.identifier;
    const literalForm = parameters.literalForm;
    const type = "Label" as const;
    return { identifier, literalForm, type };
  }

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
      purify.NonEmptyList<rdfjs.Literal>
    > = purify.NonEmptyList.fromArray([
      ..._resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2008/05/skos-xl#literalForm",
          ),
          { unique: true },
        )
        .flatMap((_item) =>
          _item
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
    ]).toEither(
      new rdfjsResource.Resource.ValueError({
        focusResource: _resource,
        message: `${rdfjsResource.Resource.Identifier.toString(_resource.identifier)} is empty`,
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2008/05/skos-xl#literalForm",
        ),
      }),
    );
    if (_literalFormEither.isLeft()) {
      return _literalFormEither;
    }

    const literalForm = _literalFormEither.unsafeCoerce();
    const type = "Label" as const;
    return purify.Either.of({ identifier, literalForm, type });
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
