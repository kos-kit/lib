import type * as rdfjs from "@rdfjs/types";
import { DataFactory as dataFactory } from "n3";
import * as purify from "purify-ts";
import * as purifyHelpers from "purify-ts-helpers";
import * as rdfLiteral from "rdf-literal";
import * as rdfjsResource from "rdfjs-resource";
import * as sparqljs from "sparqljs";
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

  export function propertiesFromRdf({
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
      literalForm: purify.NonEmptyList<rdfjs.Literal>;
      type: "LabelStub";
    }
  > {
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

  export function fromRdf(
    parameters: Parameters<typeof LabelStub.propertiesFromRdf>[0],
  ): purify.Either<rdfjsResource.Resource.ValueError, LabelStub> {
    return LabelStub.propertiesFromRdf(parameters);
  }

  export function sparqlConstructQuery(
    parameters?: {
      prefixes?: { [prefix: string]: string };
      subject: rdfjs.Variable;
    } & Omit<
      sparqljs.ConstructQuery,
      "prefixes" | "queryType" | "template" | "type" | "where"
    >,
  ): sparqljs.ConstructQuery {
    const subject = parameters?.subject ?? dataFactory.variable("labelStub");
    return {
      ...parameters,
      prefixes: parameters?.prefixes ?? {},
      queryType: "CONSTRUCT",
      template: LabelStub.sparqlConstructTemplateTriples({ subject }).concat(),
      type: "query",
      where: LabelStub.sparqlWherePatterns({ subject }).concat(),
    };
  }

  export function sparqlConstructQueryString(
    parameters?: { subject: rdfjs.Variable } & Omit<
      sparqljs.ConstructQuery,
      "prefixes" | "queryType" | "template" | "type" | "where"
    > &
      sparqljs.GeneratorOptions,
  ): string {
    return new sparqljs.Generator(parameters).stringify(
      LabelStub.sparqlConstructQuery(parameters),
    );
  }

  export function sparqlConstructTemplateTriples({
    ignoreRdfType,
    subject,
    variablePrefix: variablePrefixParameter,
  }: {
    ignoreRdfType?: boolean;
    subject: rdfjs.Variable;
    variablePrefix?: string;
  }): readonly sparqljs.Triple[] {
    const variablePrefix = variablePrefixParameter ?? subject.value;
    return [
      ...(ignoreRdfType
        ? []
        : [
            {
              subject,
              predicate: dataFactory.namedNode(
                "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              ),
              object: dataFactory.variable(`${variablePrefix}RdfType`),
            },
          ]),
      {
        object: dataFactory.variable(`${variablePrefix}LiteralForm`),
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2008/05/skos-xl#literalForm",
        ),
        subject,
      },
    ];
  }

  export function sparqlWherePatterns({
    ignoreRdfType,
    subject,
    variablePrefix: variablePrefixParameter,
  }: {
    ignoreRdfType?: boolean;
    subject: rdfjs.Variable;
    variablePrefix?: string;
  }): readonly sparqljs.Pattern[] {
    const variablePrefix = variablePrefixParameter ?? subject.value;
    return [
      ...(ignoreRdfType
        ? []
        : [
            {
              triples: [
                {
                  subject,
                  predicate: dataFactory.namedNode(
                    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                  ),
                  object: dataFactory.namedNode(
                    "http://www.w3.org/2008/05/skos-xl#Label",
                  ),
                },
                {
                  subject,
                  predicate: dataFactory.namedNode(
                    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                  ),
                  object: dataFactory.variable(`${variablePrefix}RdfType`),
                },
              ],
              type: "bgp" as const,
            },
          ]),
      {
        triples: [
          {
            object: dataFactory.variable(`${variablePrefix}LiteralForm`),
            predicate: dataFactory.namedNode(
              "http://www.w3.org/2008/05/skos-xl#literalForm",
            ),
            subject,
          },
        ],
        type: "bgp",
      },
    ];
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

  export function propertiesFromRdf({
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

  export function sparqlConstructQuery(
    parameters?: {
      prefixes?: { [prefix: string]: string };
      subject: rdfjs.Variable;
    } & Omit<
      sparqljs.ConstructQuery,
      "prefixes" | "queryType" | "template" | "type" | "where"
    >,
  ): sparqljs.ConstructQuery {
    const subject =
      parameters?.subject ?? dataFactory.variable("kosResourceStub");
    return {
      ...parameters,
      prefixes: parameters?.prefixes ?? {},
      queryType: "CONSTRUCT",
      template: KosResourceStub.sparqlConstructTemplateTriples({
        subject,
      }).concat(),
      type: "query",
      where: KosResourceStub.sparqlWherePatterns({ subject }).concat(),
    };
  }

  export function sparqlConstructQueryString(
    parameters?: { subject: rdfjs.Variable } & Omit<
      sparqljs.ConstructQuery,
      "prefixes" | "queryType" | "template" | "type" | "where"
    > &
      sparqljs.GeneratorOptions,
  ): string {
    return new sparqljs.Generator(parameters).stringify(
      KosResourceStub.sparqlConstructQuery(parameters),
    );
  }

  export function sparqlConstructTemplateTriples({
    subject,
    variablePrefix: variablePrefixParameter,
  }: {
    ignoreRdfType?: boolean;
    subject: rdfjs.Variable;
    variablePrefix?: string;
  }): readonly sparqljs.Triple[] {
    const variablePrefix = variablePrefixParameter ?? subject.value;
    return [
      {
        object: dataFactory.variable(`${variablePrefix}PrefLabel`),
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#prefLabel",
        ),
        subject,
      },
      {
        object: dataFactory.variable(`${variablePrefix}PrefLabelXl`),
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2008/05/skos-xl#prefLabel",
        ),
        subject,
      },
      ...LabelStub.sparqlConstructTemplateTriples({
        subject: dataFactory.variable(`${variablePrefix}PrefLabelXl`),
        variablePrefix: `${variablePrefix}PrefLabelXl`,
      }),
    ];
  }

  export function sparqlWherePatterns({
    subject,
    variablePrefix: variablePrefixParameter,
  }: {
    ignoreRdfType?: boolean;
    subject: rdfjs.Variable;
    variablePrefix?: string;
  }): readonly sparqljs.Pattern[] {
    const variablePrefix = variablePrefixParameter ?? subject.value;
    return [
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(`${variablePrefix}PrefLabel`),
                predicate: dataFactory.namedNode(
                  "http://www.w3.org/2004/02/skos/core#prefLabel",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(`${variablePrefix}PrefLabelXl`),
                predicate: dataFactory.namedNode(
                  "http://www.w3.org/2008/05/skos-xl#prefLabel",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
          {
            patterns: [
              ...LabelStub.sparqlWherePatterns({
                subject: dataFactory.variable(`${variablePrefix}PrefLabelXl`),
                variablePrefix: `${variablePrefix}PrefLabelXl`,
              }),
            ],
            type: "optional",
          },
        ],
        type: "optional",
      },
    ];
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

  export function propertiesFromRdf({
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

  export function sparqlConstructQuery(
    parameters?: {
      prefixes?: { [prefix: string]: string };
      subject: rdfjs.Variable;
    } & Omit<
      sparqljs.ConstructQuery,
      "prefixes" | "queryType" | "template" | "type" | "where"
    >,
  ): sparqljs.ConstructQuery {
    const subject = parameters?.subject ?? dataFactory.variable("kosResource");
    return {
      ...parameters,
      prefixes: parameters?.prefixes ?? {},
      queryType: "CONSTRUCT",
      template: KosResource.sparqlConstructTemplateTriples({
        subject,
      }).concat(),
      type: "query",
      where: KosResource.sparqlWherePatterns({ subject }).concat(),
    };
  }

  export function sparqlConstructQueryString(
    parameters?: { subject: rdfjs.Variable } & Omit<
      sparqljs.ConstructQuery,
      "prefixes" | "queryType" | "template" | "type" | "where"
    > &
      sparqljs.GeneratorOptions,
  ): string {
    return new sparqljs.Generator(parameters).stringify(
      KosResource.sparqlConstructQuery(parameters),
    );
  }

  export function sparqlConstructTemplateTriples({
    subject,
    variablePrefix: variablePrefixParameter,
  }: {
    ignoreRdfType?: boolean;
    subject: rdfjs.Variable;
    variablePrefix?: string;
  }): readonly sparqljs.Triple[] {
    const variablePrefix = variablePrefixParameter ?? subject.value;
    return [
      {
        object: dataFactory.variable(`${variablePrefix}AltLabel`),
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#altLabel",
        ),
        subject,
      },
      {
        object: dataFactory.variable(`${variablePrefix}AltLabelXl`),
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2008/05/skos-xl#altLabel",
        ),
        subject,
      },
      ...Label.sparqlConstructTemplateTriples({
        subject: dataFactory.variable(`${variablePrefix}AltLabelXl`),
        variablePrefix: `${variablePrefix}AltLabelXl`,
      }),
      {
        object: dataFactory.variable(`${variablePrefix}ChangeNote`),
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#changeNote",
        ),
        subject,
      },
      {
        object: dataFactory.variable(`${variablePrefix}Definition`),
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#definition",
        ),
        subject,
      },
      {
        object: dataFactory.variable(`${variablePrefix}EditorialNote`),
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#editorialNote",
        ),
        subject,
      },
      {
        object: dataFactory.variable(`${variablePrefix}Example`),
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#example",
        ),
        subject,
      },
      {
        object: dataFactory.variable(`${variablePrefix}HiddenLabel`),
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#hiddenLabel",
        ),
        subject,
      },
      {
        object: dataFactory.variable(`${variablePrefix}HiddenLabelXl`),
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2008/05/skos-xl#hiddenLabel",
        ),
        subject,
      },
      ...Label.sparqlConstructTemplateTriples({
        subject: dataFactory.variable(`${variablePrefix}HiddenLabelXl`),
        variablePrefix: `${variablePrefix}HiddenLabelXl`,
      }),
      {
        object: dataFactory.variable(`${variablePrefix}HistoryNote`),
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#historyNote",
        ),
        subject,
      },
      {
        object: dataFactory.variable(`${variablePrefix}Modified`),
        predicate: dataFactory.namedNode("http://purl.org/dc/terms/modified"),
        subject,
      },
      {
        object: dataFactory.variable(`${variablePrefix}Notation`),
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#notation",
        ),
        subject,
      },
      {
        object: dataFactory.variable(`${variablePrefix}Note`),
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#notation",
        ),
        subject,
      },
      {
        object: dataFactory.variable(`${variablePrefix}PrefLabel`),
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#prefLabel",
        ),
        subject,
      },
      {
        object: dataFactory.variable(`${variablePrefix}PrefLabelXl`),
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2008/05/skos-xl#prefLabel",
        ),
        subject,
      },
      ...Label.sparqlConstructTemplateTriples({
        subject: dataFactory.variable(`${variablePrefix}PrefLabelXl`),
        variablePrefix: `${variablePrefix}PrefLabelXl`,
      }),
      {
        object: dataFactory.variable(`${variablePrefix}ScopeNote`),
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#scopeNote",
        ),
        subject,
      },
    ];
  }

  export function sparqlWherePatterns({
    subject,
    variablePrefix: variablePrefixParameter,
  }: {
    ignoreRdfType?: boolean;
    subject: rdfjs.Variable;
    variablePrefix?: string;
  }): readonly sparqljs.Pattern[] {
    const variablePrefix = variablePrefixParameter ?? subject.value;
    return [
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(`${variablePrefix}AltLabel`),
                predicate: dataFactory.namedNode(
                  "http://www.w3.org/2004/02/skos/core#altLabel",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(`${variablePrefix}AltLabelXl`),
                predicate: dataFactory.namedNode(
                  "http://www.w3.org/2008/05/skos-xl#altLabel",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
          {
            patterns: [
              ...Label.sparqlWherePatterns({
                subject: dataFactory.variable(`${variablePrefix}AltLabelXl`),
                variablePrefix: `${variablePrefix}AltLabelXl`,
              }),
            ],
            type: "optional",
          },
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(`${variablePrefix}ChangeNote`),
                predicate: dataFactory.namedNode(
                  "http://www.w3.org/2004/02/skos/core#changeNote",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(`${variablePrefix}Definition`),
                predicate: dataFactory.namedNode(
                  "http://www.w3.org/2004/02/skos/core#definition",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(`${variablePrefix}EditorialNote`),
                predicate: dataFactory.namedNode(
                  "http://www.w3.org/2004/02/skos/core#editorialNote",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(`${variablePrefix}Example`),
                predicate: dataFactory.namedNode(
                  "http://www.w3.org/2004/02/skos/core#example",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(`${variablePrefix}HiddenLabel`),
                predicate: dataFactory.namedNode(
                  "http://www.w3.org/2004/02/skos/core#hiddenLabel",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(`${variablePrefix}HiddenLabelXl`),
                predicate: dataFactory.namedNode(
                  "http://www.w3.org/2008/05/skos-xl#hiddenLabel",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
          {
            patterns: [
              ...Label.sparqlWherePatterns({
                subject: dataFactory.variable(`${variablePrefix}HiddenLabelXl`),
                variablePrefix: `${variablePrefix}HiddenLabelXl`,
              }),
            ],
            type: "optional",
          },
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(`${variablePrefix}HistoryNote`),
                predicate: dataFactory.namedNode(
                  "http://www.w3.org/2004/02/skos/core#historyNote",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(`${variablePrefix}Modified`),
                predicate: dataFactory.namedNode(
                  "http://purl.org/dc/terms/modified",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(`${variablePrefix}Notation`),
                predicate: dataFactory.namedNode(
                  "http://www.w3.org/2004/02/skos/core#notation",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(`${variablePrefix}Note`),
                predicate: dataFactory.namedNode(
                  "http://www.w3.org/2004/02/skos/core#notation",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(`${variablePrefix}PrefLabel`),
                predicate: dataFactory.namedNode(
                  "http://www.w3.org/2004/02/skos/core#prefLabel",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(`${variablePrefix}PrefLabelXl`),
                predicate: dataFactory.namedNode(
                  "http://www.w3.org/2008/05/skos-xl#prefLabel",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
          {
            patterns: [
              ...Label.sparqlWherePatterns({
                subject: dataFactory.variable(`${variablePrefix}PrefLabelXl`),
                variablePrefix: `${variablePrefix}PrefLabelXl`,
              }),
            ],
            type: "optional",
          },
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(`${variablePrefix}ScopeNote`),
                predicate: dataFactory.namedNode(
                  "http://www.w3.org/2004/02/skos/core#scopeNote",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
        ],
        type: "optional",
      },
    ];
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
        | Date
        | boolean
        | number
        | purify.Maybe<rdfjs.NamedNode | rdfjs.Literal>
        | string;
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
    } else if (typeof parameters.license === "boolean") {
      license = purify.Maybe.of(rdfLiteral.toRdf(parameters.license));
    } else if (
      typeof parameters.license === "object" &&
      parameters.license instanceof Date
    ) {
      license = purify.Maybe.of(rdfLiteral.toRdf(parameters.license));
    } else if (typeof parameters.license === "number") {
      license = purify.Maybe.of(rdfLiteral.toRdf(parameters.license));
    } else if (typeof parameters.license === "string") {
      license = purify.Maybe.of(dataFactory.literal(parameters.license));
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

  export function propertiesFromRdf({
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
      hasTopConcept: readonly ConceptStub[];
      identifier: rdfjs.NamedNode;
      license: purify.Maybe<rdfjs.NamedNode | rdfjs.Literal>;
      rights: purify.Maybe<rdfjs.Literal>;
      rightsHolder: purify.Maybe<rdfjs.Literal>;
      type: "ConceptScheme";
    } & purifyHelpers.Eithers.UnwrapR<
      ReturnType<typeof KosResource.propertiesFromRdf>
    >
  > {
    const _super0Either = KosResource.propertiesFromRdf({
      ..._context,
      ignoreRdfType: true,
      languageIn: _languageIn,
      resource: _resource,
    });
    if (_super0Either.isLeft()) {
      return _super0Either;
    }

    const _super0 = _super0Either.unsafeCoerce();
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
      _resource
        .values(dataFactory.namedNode("http://purl.org/dc/terms/license"), {
          unique: true,
        })
        .head()
        .chain((_value) =>
          purify.Either.of(_value.toTerm()).chain((term) => {
            switch (term.termType) {
              case "NamedNode":
              case "Literal":
                return purify.Either.of(term);
              default:
                return purify.Left(
                  new rdfjsResource.Resource.MistypedValueError({
                    actualValue: term,
                    expectedValueType: "(rdfjs.NamedNode | rdfjs.Literal)",
                    focusResource: _resource,
                    predicate: dataFactory.namedNode(
                      "http://purl.org/dc/terms/license",
                    ),
                  }),
                );
            }
          }),
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
      ..._super0,
      hasTopConcept,
      identifier,
      license,
      rights,
      rightsHolder,
      type,
    });
  }

  export function fromRdf(
    parameters: Parameters<typeof ConceptScheme.propertiesFromRdf>[0],
  ): purify.Either<rdfjsResource.Resource.ValueError, ConceptScheme> {
    return ConceptScheme.propertiesFromRdf(parameters);
  }

  export function sparqlConstructQuery(
    parameters?: {
      prefixes?: { [prefix: string]: string };
      subject: rdfjs.Variable;
    } & Omit<
      sparqljs.ConstructQuery,
      "prefixes" | "queryType" | "template" | "type" | "where"
    >,
  ): sparqljs.ConstructQuery {
    const subject =
      parameters?.subject ?? dataFactory.variable("conceptScheme");
    return {
      ...parameters,
      prefixes: parameters?.prefixes ?? {},
      queryType: "CONSTRUCT",
      template: ConceptScheme.sparqlConstructTemplateTriples({
        subject,
      }).concat(),
      type: "query",
      where: ConceptScheme.sparqlWherePatterns({ subject }).concat(),
    };
  }

  export function sparqlConstructQueryString(
    parameters?: { subject: rdfjs.Variable } & Omit<
      sparqljs.ConstructQuery,
      "prefixes" | "queryType" | "template" | "type" | "where"
    > &
      sparqljs.GeneratorOptions,
  ): string {
    return new sparqljs.Generator(parameters).stringify(
      ConceptScheme.sparqlConstructQuery(parameters),
    );
  }

  export function sparqlConstructTemplateTriples({
    ignoreRdfType,
    subject,
    variablePrefix: variablePrefixParameter,
  }: {
    ignoreRdfType?: boolean;
    subject: rdfjs.Variable;
    variablePrefix?: string;
  }): readonly sparqljs.Triple[] {
    const variablePrefix = variablePrefixParameter ?? subject.value;
    return [
      ...KosResource.sparqlConstructTemplateTriples({
        ignoreRdfType: true,
        subject,
        variablePrefix,
      }),
      ...(ignoreRdfType
        ? []
        : [
            {
              subject,
              predicate: dataFactory.namedNode(
                "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              ),
              object: dataFactory.variable(`${variablePrefix}RdfType`),
            },
          ]),
      {
        object: dataFactory.variable(`${variablePrefix}HasTopConcept`),
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#hasTopConcept",
        ),
        subject,
      },
      ...ConceptStub.sparqlConstructTemplateTriples({
        subject: dataFactory.variable(`${variablePrefix}HasTopConcept`),
        variablePrefix: `${variablePrefix}HasTopConcept`,
      }),
      {
        object: dataFactory.variable(`${variablePrefix}License`),
        predicate: dataFactory.namedNode("http://purl.org/dc/terms/license"),
        subject,
      },
      {
        object: dataFactory.variable(`${variablePrefix}Rights`),
        predicate: dataFactory.namedNode("http://purl.org/dc/terms/rights"),
        subject,
      },
      {
        object: dataFactory.variable(`${variablePrefix}RightsHolder`),
        predicate: dataFactory.namedNode(
          "http://purl.org/dc/terms/rightsHolder",
        ),
        subject,
      },
    ];
  }

  export function sparqlWherePatterns({
    ignoreRdfType,
    subject,
    variablePrefix: variablePrefixParameter,
  }: {
    ignoreRdfType?: boolean;
    subject: rdfjs.Variable;
    variablePrefix?: string;
  }): readonly sparqljs.Pattern[] {
    const variablePrefix = variablePrefixParameter ?? subject.value;
    return [
      ...KosResource.sparqlWherePatterns({
        ignoreRdfType: true,
        subject,
        variablePrefix,
      }),
      ...(ignoreRdfType
        ? []
        : [
            {
              triples: [
                {
                  subject,
                  predicate: dataFactory.namedNode(
                    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                  ),
                  object: dataFactory.namedNode(
                    "http://www.w3.org/2004/02/skos/core#ConceptScheme",
                  ),
                },
                {
                  subject,
                  predicate: dataFactory.namedNode(
                    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                  ),
                  object: dataFactory.variable(`${variablePrefix}RdfType`),
                },
              ],
              type: "bgp" as const,
            },
          ]),
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(`${variablePrefix}HasTopConcept`),
                predicate: dataFactory.namedNode(
                  "http://www.w3.org/2004/02/skos/core#hasTopConcept",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
          {
            patterns: [
              ...ConceptStub.sparqlWherePatterns({
                subject: dataFactory.variable(`${variablePrefix}HasTopConcept`),
                variablePrefix: `${variablePrefix}HasTopConcept`,
              }),
            ],
            type: "optional",
          },
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(`${variablePrefix}License`),
                predicate: dataFactory.namedNode(
                  "http://purl.org/dc/terms/license",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(`${variablePrefix}Rights`),
                predicate: dataFactory.namedNode(
                  "http://purl.org/dc/terms/rights",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(`${variablePrefix}RightsHolder`),
                predicate: dataFactory.namedNode(
                  "http://purl.org/dc/terms/rightsHolder",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
        ],
        type: "optional",
      },
    ];
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

  export function propertiesFromRdf({
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
      type: "ConceptSchemeStub";
    } & purifyHelpers.Eithers.UnwrapR<
      ReturnType<typeof KosResourceStub.propertiesFromRdf>
    >
  > {
    const _super0Either = KosResourceStub.propertiesFromRdf({
      ..._context,
      ignoreRdfType: true,
      languageIn: _languageIn,
      resource: _resource,
    });
    if (_super0Either.isLeft()) {
      return _super0Either;
    }

    const _super0 = _super0Either.unsafeCoerce();
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
    return purify.Either.of({ ..._super0, identifier, type });
  }

  export function fromRdf(
    parameters: Parameters<typeof ConceptSchemeStub.propertiesFromRdf>[0],
  ): purify.Either<rdfjsResource.Resource.ValueError, ConceptSchemeStub> {
    return ConceptSchemeStub.propertiesFromRdf(parameters);
  }

  export function sparqlConstructQuery(
    parameters?: {
      prefixes?: { [prefix: string]: string };
      subject: rdfjs.Variable;
    } & Omit<
      sparqljs.ConstructQuery,
      "prefixes" | "queryType" | "template" | "type" | "where"
    >,
  ): sparqljs.ConstructQuery {
    const subject =
      parameters?.subject ?? dataFactory.variable("conceptSchemeStub");
    return {
      ...parameters,
      prefixes: parameters?.prefixes ?? {},
      queryType: "CONSTRUCT",
      template: ConceptSchemeStub.sparqlConstructTemplateTriples({
        subject,
      }).concat(),
      type: "query",
      where: ConceptSchemeStub.sparqlWherePatterns({ subject }).concat(),
    };
  }

  export function sparqlConstructQueryString(
    parameters?: { subject: rdfjs.Variable } & Omit<
      sparqljs.ConstructQuery,
      "prefixes" | "queryType" | "template" | "type" | "where"
    > &
      sparqljs.GeneratorOptions,
  ): string {
    return new sparqljs.Generator(parameters).stringify(
      ConceptSchemeStub.sparqlConstructQuery(parameters),
    );
  }

  export function sparqlConstructTemplateTriples({
    ignoreRdfType,
    subject,
    variablePrefix: variablePrefixParameter,
  }: {
    ignoreRdfType?: boolean;
    subject: rdfjs.Variable;
    variablePrefix?: string;
  }): readonly sparqljs.Triple[] {
    const variablePrefix = variablePrefixParameter ?? subject.value;
    return [
      ...KosResourceStub.sparqlConstructTemplateTriples({
        ignoreRdfType: true,
        subject,
        variablePrefix,
      }),
      ...(ignoreRdfType
        ? []
        : [
            {
              subject,
              predicate: dataFactory.namedNode(
                "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              ),
              object: dataFactory.variable(`${variablePrefix}RdfType`),
            },
          ]),
    ];
  }

  export function sparqlWherePatterns({
    ignoreRdfType,
    subject,
    variablePrefix: variablePrefixParameter,
  }: {
    ignoreRdfType?: boolean;
    subject: rdfjs.Variable;
    variablePrefix?: string;
  }): readonly sparqljs.Pattern[] {
    const variablePrefix = variablePrefixParameter ?? subject.value;
    return [
      ...KosResourceStub.sparqlWherePatterns({
        ignoreRdfType: true,
        subject,
        variablePrefix,
      }),
      ...(ignoreRdfType
        ? []
        : [
            {
              triples: [
                {
                  subject,
                  predicate: dataFactory.namedNode(
                    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                  ),
                  object: dataFactory.namedNode(
                    "http://www.w3.org/2004/02/skos/core#ConceptScheme",
                  ),
                },
                {
                  subject,
                  predicate: dataFactory.namedNode(
                    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                  ),
                  object: dataFactory.variable(`${variablePrefix}RdfType`),
                },
              ],
              type: "bgp" as const,
            },
          ]),
    ];
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

  export function propertiesFromRdf({
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
      type: "ConceptStub";
    } & purifyHelpers.Eithers.UnwrapR<
      ReturnType<typeof KosResourceStub.propertiesFromRdf>
    >
  > {
    const _super0Either = KosResourceStub.propertiesFromRdf({
      ..._context,
      ignoreRdfType: true,
      languageIn: _languageIn,
      resource: _resource,
    });
    if (_super0Either.isLeft()) {
      return _super0Either;
    }

    const _super0 = _super0Either.unsafeCoerce();
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
    return purify.Either.of({ ..._super0, identifier, type });
  }

  export function fromRdf(
    parameters: Parameters<typeof ConceptStub.propertiesFromRdf>[0],
  ): purify.Either<rdfjsResource.Resource.ValueError, ConceptStub> {
    return ConceptStub.propertiesFromRdf(parameters);
  }

  export function sparqlConstructQuery(
    parameters?: {
      prefixes?: { [prefix: string]: string };
      subject: rdfjs.Variable;
    } & Omit<
      sparqljs.ConstructQuery,
      "prefixes" | "queryType" | "template" | "type" | "where"
    >,
  ): sparqljs.ConstructQuery {
    const subject = parameters?.subject ?? dataFactory.variable("conceptStub");
    return {
      ...parameters,
      prefixes: parameters?.prefixes ?? {},
      queryType: "CONSTRUCT",
      template: ConceptStub.sparqlConstructTemplateTriples({
        subject,
      }).concat(),
      type: "query",
      where: ConceptStub.sparqlWherePatterns({ subject }).concat(),
    };
  }

  export function sparqlConstructQueryString(
    parameters?: { subject: rdfjs.Variable } & Omit<
      sparqljs.ConstructQuery,
      "prefixes" | "queryType" | "template" | "type" | "where"
    > &
      sparqljs.GeneratorOptions,
  ): string {
    return new sparqljs.Generator(parameters).stringify(
      ConceptStub.sparqlConstructQuery(parameters),
    );
  }

  export function sparqlConstructTemplateTriples({
    ignoreRdfType,
    subject,
    variablePrefix: variablePrefixParameter,
  }: {
    ignoreRdfType?: boolean;
    subject: rdfjs.Variable;
    variablePrefix?: string;
  }): readonly sparqljs.Triple[] {
    const variablePrefix = variablePrefixParameter ?? subject.value;
    return [
      ...KosResourceStub.sparqlConstructTemplateTriples({
        ignoreRdfType: true,
        subject,
        variablePrefix,
      }),
      ...(ignoreRdfType
        ? []
        : [
            {
              subject,
              predicate: dataFactory.namedNode(
                "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              ),
              object: dataFactory.variable(`${variablePrefix}RdfType`),
            },
          ]),
    ];
  }

  export function sparqlWherePatterns({
    ignoreRdfType,
    subject,
    variablePrefix: variablePrefixParameter,
  }: {
    ignoreRdfType?: boolean;
    subject: rdfjs.Variable;
    variablePrefix?: string;
  }): readonly sparqljs.Pattern[] {
    const variablePrefix = variablePrefixParameter ?? subject.value;
    return [
      ...KosResourceStub.sparqlWherePatterns({
        ignoreRdfType: true,
        subject,
        variablePrefix,
      }),
      ...(ignoreRdfType
        ? []
        : [
            {
              triples: [
                {
                  subject,
                  predicate: dataFactory.namedNode(
                    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                  ),
                  object: dataFactory.namedNode(
                    "http://www.w3.org/2004/02/skos/core#Concept",
                  ),
                },
                {
                  subject,
                  predicate: dataFactory.namedNode(
                    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                  ),
                  object: dataFactory.variable(`${variablePrefix}RdfType`),
                },
              ],
              type: "bgp" as const,
            },
          ]),
    ];
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

  export function propertiesFromRdf({
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
      broader: readonly ConceptStub[];
      broaderTransitive: readonly ConceptStub[];
      broadMatch: readonly ConceptStub[];
      closeMatch: readonly ConceptStub[];
      exactMatch: readonly ConceptStub[];
      identifier: rdfjs.NamedNode;
      inScheme: readonly ConceptSchemeStub[];
      mappingRelation: readonly ConceptStub[];
      narrower: readonly ConceptStub[];
      narrowerTransitive: readonly ConceptStub[];
      narrowMatch: readonly ConceptStub[];
      related: readonly ConceptStub[];
      relatedMatch: readonly ConceptStub[];
      semanticRelation: readonly ConceptStub[];
      topConceptOf: readonly ConceptSchemeStub[];
      type: "Concept";
    } & purifyHelpers.Eithers.UnwrapR<
      ReturnType<typeof KosResource.propertiesFromRdf>
    >
  > {
    const _super0Either = KosResource.propertiesFromRdf({
      ..._context,
      ignoreRdfType: true,
      languageIn: _languageIn,
      resource: _resource,
    });
    if (_super0Either.isLeft()) {
      return _super0Either;
    }

    const _super0 = _super0Either.unsafeCoerce();
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
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#broader"),
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
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#inScheme"),
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
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#narrower"),
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
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#related"),
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
      ..._super0,
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
    });
  }

  export function fromRdf(
    parameters: Parameters<typeof Concept.propertiesFromRdf>[0],
  ): purify.Either<rdfjsResource.Resource.ValueError, Concept> {
    return Concept.propertiesFromRdf(parameters);
  }

  export function sparqlConstructQuery(
    parameters?: {
      prefixes?: { [prefix: string]: string };
      subject: rdfjs.Variable;
    } & Omit<
      sparqljs.ConstructQuery,
      "prefixes" | "queryType" | "template" | "type" | "where"
    >,
  ): sparqljs.ConstructQuery {
    const subject = parameters?.subject ?? dataFactory.variable("concept");
    return {
      ...parameters,
      prefixes: parameters?.prefixes ?? {},
      queryType: "CONSTRUCT",
      template: Concept.sparqlConstructTemplateTriples({ subject }).concat(),
      type: "query",
      where: Concept.sparqlWherePatterns({ subject }).concat(),
    };
  }

  export function sparqlConstructQueryString(
    parameters?: { subject: rdfjs.Variable } & Omit<
      sparqljs.ConstructQuery,
      "prefixes" | "queryType" | "template" | "type" | "where"
    > &
      sparqljs.GeneratorOptions,
  ): string {
    return new sparqljs.Generator(parameters).stringify(
      Concept.sparqlConstructQuery(parameters),
    );
  }

  export function sparqlConstructTemplateTriples({
    ignoreRdfType,
    subject,
    variablePrefix: variablePrefixParameter,
  }: {
    ignoreRdfType?: boolean;
    subject: rdfjs.Variable;
    variablePrefix?: string;
  }): readonly sparqljs.Triple[] {
    const variablePrefix = variablePrefixParameter ?? subject.value;
    return [
      ...KosResource.sparqlConstructTemplateTriples({
        ignoreRdfType: true,
        subject,
        variablePrefix,
      }),
      ...(ignoreRdfType
        ? []
        : [
            {
              subject,
              predicate: dataFactory.namedNode(
                "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              ),
              object: dataFactory.variable(`${variablePrefix}RdfType`),
            },
          ]),
      {
        object: dataFactory.variable(`${variablePrefix}Broader`),
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#broader",
        ),
        subject,
      },
      ...ConceptStub.sparqlConstructTemplateTriples({
        subject: dataFactory.variable(`${variablePrefix}Broader`),
        variablePrefix: `${variablePrefix}Broader`,
      }),
      {
        object: dataFactory.variable(`${variablePrefix}BroaderTransitive`),
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#broaderTransitive",
        ),
        subject,
      },
      ...ConceptStub.sparqlConstructTemplateTriples({
        subject: dataFactory.variable(`${variablePrefix}BroaderTransitive`),
        variablePrefix: `${variablePrefix}BroaderTransitive`,
      }),
      {
        object: dataFactory.variable(`${variablePrefix}BroadMatch`),
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#broadMatch",
        ),
        subject,
      },
      ...ConceptStub.sparqlConstructTemplateTriples({
        subject: dataFactory.variable(`${variablePrefix}BroadMatch`),
        variablePrefix: `${variablePrefix}BroadMatch`,
      }),
      {
        object: dataFactory.variable(`${variablePrefix}CloseMatch`),
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#closeMatch",
        ),
        subject,
      },
      ...ConceptStub.sparqlConstructTemplateTriples({
        subject: dataFactory.variable(`${variablePrefix}CloseMatch`),
        variablePrefix: `${variablePrefix}CloseMatch`,
      }),
      {
        object: dataFactory.variable(`${variablePrefix}ExactMatch`),
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#exactMatch",
        ),
        subject,
      },
      ...ConceptStub.sparqlConstructTemplateTriples({
        subject: dataFactory.variable(`${variablePrefix}ExactMatch`),
        variablePrefix: `${variablePrefix}ExactMatch`,
      }),
      {
        object: dataFactory.variable(`${variablePrefix}InScheme`),
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#inScheme",
        ),
        subject,
      },
      ...ConceptSchemeStub.sparqlConstructTemplateTriples({
        subject: dataFactory.variable(`${variablePrefix}InScheme`),
        variablePrefix: `${variablePrefix}InScheme`,
      }),
      {
        object: dataFactory.variable(`${variablePrefix}MappingRelation`),
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#mappingRelation",
        ),
        subject,
      },
      ...ConceptStub.sparqlConstructTemplateTriples({
        subject: dataFactory.variable(`${variablePrefix}MappingRelation`),
        variablePrefix: `${variablePrefix}MappingRelation`,
      }),
      {
        object: dataFactory.variable(`${variablePrefix}Narrower`),
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#narrower",
        ),
        subject,
      },
      ...ConceptStub.sparqlConstructTemplateTriples({
        subject: dataFactory.variable(`${variablePrefix}Narrower`),
        variablePrefix: `${variablePrefix}Narrower`,
      }),
      {
        object: dataFactory.variable(`${variablePrefix}NarrowerTransitive`),
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#narrowerTransitive",
        ),
        subject,
      },
      ...ConceptStub.sparqlConstructTemplateTriples({
        subject: dataFactory.variable(`${variablePrefix}NarrowerTransitive`),
        variablePrefix: `${variablePrefix}NarrowerTransitive`,
      }),
      {
        object: dataFactory.variable(`${variablePrefix}NarrowMatch`),
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#narrowMatch",
        ),
        subject,
      },
      ...ConceptStub.sparqlConstructTemplateTriples({
        subject: dataFactory.variable(`${variablePrefix}NarrowMatch`),
        variablePrefix: `${variablePrefix}NarrowMatch`,
      }),
      {
        object: dataFactory.variable(`${variablePrefix}Related`),
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#related",
        ),
        subject,
      },
      ...ConceptStub.sparqlConstructTemplateTriples({
        subject: dataFactory.variable(`${variablePrefix}Related`),
        variablePrefix: `${variablePrefix}Related`,
      }),
      {
        object: dataFactory.variable(`${variablePrefix}RelatedMatch`),
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#relatedMatch",
        ),
        subject,
      },
      ...ConceptStub.sparqlConstructTemplateTriples({
        subject: dataFactory.variable(`${variablePrefix}RelatedMatch`),
        variablePrefix: `${variablePrefix}RelatedMatch`,
      }),
      {
        object: dataFactory.variable(`${variablePrefix}SemanticRelation`),
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#semanticRelation",
        ),
        subject,
      },
      ...ConceptStub.sparqlConstructTemplateTriples({
        subject: dataFactory.variable(`${variablePrefix}SemanticRelation`),
        variablePrefix: `${variablePrefix}SemanticRelation`,
      }),
      {
        object: dataFactory.variable(`${variablePrefix}TopConceptOf`),
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#topConceptOf",
        ),
        subject,
      },
      ...ConceptSchemeStub.sparqlConstructTemplateTriples({
        subject: dataFactory.variable(`${variablePrefix}TopConceptOf`),
        variablePrefix: `${variablePrefix}TopConceptOf`,
      }),
    ];
  }

  export function sparqlWherePatterns({
    ignoreRdfType,
    subject,
    variablePrefix: variablePrefixParameter,
  }: {
    ignoreRdfType?: boolean;
    subject: rdfjs.Variable;
    variablePrefix?: string;
  }): readonly sparqljs.Pattern[] {
    const variablePrefix = variablePrefixParameter ?? subject.value;
    return [
      ...KosResource.sparqlWherePatterns({
        ignoreRdfType: true,
        subject,
        variablePrefix,
      }),
      ...(ignoreRdfType
        ? []
        : [
            {
              triples: [
                {
                  subject,
                  predicate: dataFactory.namedNode(
                    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                  ),
                  object: dataFactory.namedNode(
                    "http://www.w3.org/2004/02/skos/core#Concept",
                  ),
                },
                {
                  subject,
                  predicate: dataFactory.namedNode(
                    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                  ),
                  object: dataFactory.variable(`${variablePrefix}RdfType`),
                },
              ],
              type: "bgp" as const,
            },
          ]),
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(`${variablePrefix}Broader`),
                predicate: dataFactory.namedNode(
                  "http://www.w3.org/2004/02/skos/core#broader",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
          {
            patterns: [
              ...ConceptStub.sparqlWherePatterns({
                subject: dataFactory.variable(`${variablePrefix}Broader`),
                variablePrefix: `${variablePrefix}Broader`,
              }),
            ],
            type: "optional",
          },
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(
                  `${variablePrefix}BroaderTransitive`,
                ),
                predicate: dataFactory.namedNode(
                  "http://www.w3.org/2004/02/skos/core#broaderTransitive",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
          {
            patterns: [
              ...ConceptStub.sparqlWherePatterns({
                subject: dataFactory.variable(
                  `${variablePrefix}BroaderTransitive`,
                ),
                variablePrefix: `${variablePrefix}BroaderTransitive`,
              }),
            ],
            type: "optional",
          },
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(`${variablePrefix}BroadMatch`),
                predicate: dataFactory.namedNode(
                  "http://www.w3.org/2004/02/skos/core#broadMatch",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
          {
            patterns: [
              ...ConceptStub.sparqlWherePatterns({
                subject: dataFactory.variable(`${variablePrefix}BroadMatch`),
                variablePrefix: `${variablePrefix}BroadMatch`,
              }),
            ],
            type: "optional",
          },
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(`${variablePrefix}CloseMatch`),
                predicate: dataFactory.namedNode(
                  "http://www.w3.org/2004/02/skos/core#closeMatch",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
          {
            patterns: [
              ...ConceptStub.sparqlWherePatterns({
                subject: dataFactory.variable(`${variablePrefix}CloseMatch`),
                variablePrefix: `${variablePrefix}CloseMatch`,
              }),
            ],
            type: "optional",
          },
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(`${variablePrefix}ExactMatch`),
                predicate: dataFactory.namedNode(
                  "http://www.w3.org/2004/02/skos/core#exactMatch",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
          {
            patterns: [
              ...ConceptStub.sparqlWherePatterns({
                subject: dataFactory.variable(`${variablePrefix}ExactMatch`),
                variablePrefix: `${variablePrefix}ExactMatch`,
              }),
            ],
            type: "optional",
          },
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(`${variablePrefix}InScheme`),
                predicate: dataFactory.namedNode(
                  "http://www.w3.org/2004/02/skos/core#inScheme",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
          {
            patterns: [
              ...ConceptSchemeStub.sparqlWherePatterns({
                subject: dataFactory.variable(`${variablePrefix}InScheme`),
                variablePrefix: `${variablePrefix}InScheme`,
              }),
            ],
            type: "optional",
          },
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(
                  `${variablePrefix}MappingRelation`,
                ),
                predicate: dataFactory.namedNode(
                  "http://www.w3.org/2004/02/skos/core#mappingRelation",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
          {
            patterns: [
              ...ConceptStub.sparqlWherePatterns({
                subject: dataFactory.variable(
                  `${variablePrefix}MappingRelation`,
                ),
                variablePrefix: `${variablePrefix}MappingRelation`,
              }),
            ],
            type: "optional",
          },
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(`${variablePrefix}Narrower`),
                predicate: dataFactory.namedNode(
                  "http://www.w3.org/2004/02/skos/core#narrower",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
          {
            patterns: [
              ...ConceptStub.sparqlWherePatterns({
                subject: dataFactory.variable(`${variablePrefix}Narrower`),
                variablePrefix: `${variablePrefix}Narrower`,
              }),
            ],
            type: "optional",
          },
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(
                  `${variablePrefix}NarrowerTransitive`,
                ),
                predicate: dataFactory.namedNode(
                  "http://www.w3.org/2004/02/skos/core#narrowerTransitive",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
          {
            patterns: [
              ...ConceptStub.sparqlWherePatterns({
                subject: dataFactory.variable(
                  `${variablePrefix}NarrowerTransitive`,
                ),
                variablePrefix: `${variablePrefix}NarrowerTransitive`,
              }),
            ],
            type: "optional",
          },
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(`${variablePrefix}NarrowMatch`),
                predicate: dataFactory.namedNode(
                  "http://www.w3.org/2004/02/skos/core#narrowMatch",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
          {
            patterns: [
              ...ConceptStub.sparqlWherePatterns({
                subject: dataFactory.variable(`${variablePrefix}NarrowMatch`),
                variablePrefix: `${variablePrefix}NarrowMatch`,
              }),
            ],
            type: "optional",
          },
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(`${variablePrefix}Related`),
                predicate: dataFactory.namedNode(
                  "http://www.w3.org/2004/02/skos/core#related",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
          {
            patterns: [
              ...ConceptStub.sparqlWherePatterns({
                subject: dataFactory.variable(`${variablePrefix}Related`),
                variablePrefix: `${variablePrefix}Related`,
              }),
            ],
            type: "optional",
          },
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(`${variablePrefix}RelatedMatch`),
                predicate: dataFactory.namedNode(
                  "http://www.w3.org/2004/02/skos/core#relatedMatch",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
          {
            patterns: [
              ...ConceptStub.sparqlWherePatterns({
                subject: dataFactory.variable(`${variablePrefix}RelatedMatch`),
                variablePrefix: `${variablePrefix}RelatedMatch`,
              }),
            ],
            type: "optional",
          },
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(
                  `${variablePrefix}SemanticRelation`,
                ),
                predicate: dataFactory.namedNode(
                  "http://www.w3.org/2004/02/skos/core#semanticRelation",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
          {
            patterns: [
              ...ConceptStub.sparqlWherePatterns({
                subject: dataFactory.variable(
                  `${variablePrefix}SemanticRelation`,
                ),
                variablePrefix: `${variablePrefix}SemanticRelation`,
              }),
            ],
            type: "optional",
          },
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable(`${variablePrefix}TopConceptOf`),
                predicate: dataFactory.namedNode(
                  "http://www.w3.org/2004/02/skos/core#topConceptOf",
                ),
                subject,
              },
            ],
            type: "bgp",
          },
          {
            patterns: [
              ...ConceptSchemeStub.sparqlWherePatterns({
                subject: dataFactory.variable(`${variablePrefix}TopConceptOf`),
                variablePrefix: `${variablePrefix}TopConceptOf`,
              }),
            ],
            type: "optional",
          },
        ],
        type: "optional",
      },
    ];
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

  export function propertiesFromRdf({
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
      literalForm: purify.NonEmptyList<rdfjs.Literal>;
      type: "Label";
    }
  > {
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

  export function fromRdf(
    parameters: Parameters<typeof Label.propertiesFromRdf>[0],
  ): purify.Either<rdfjsResource.Resource.ValueError, Label> {
    return Label.propertiesFromRdf(parameters);
  }

  export function sparqlConstructQuery(
    parameters?: {
      prefixes?: { [prefix: string]: string };
      subject: rdfjs.Variable;
    } & Omit<
      sparqljs.ConstructQuery,
      "prefixes" | "queryType" | "template" | "type" | "where"
    >,
  ): sparqljs.ConstructQuery {
    const subject = parameters?.subject ?? dataFactory.variable("label");
    return {
      ...parameters,
      prefixes: parameters?.prefixes ?? {},
      queryType: "CONSTRUCT",
      template: Label.sparqlConstructTemplateTriples({ subject }).concat(),
      type: "query",
      where: Label.sparqlWherePatterns({ subject }).concat(),
    };
  }

  export function sparqlConstructQueryString(
    parameters?: { subject: rdfjs.Variable } & Omit<
      sparqljs.ConstructQuery,
      "prefixes" | "queryType" | "template" | "type" | "where"
    > &
      sparqljs.GeneratorOptions,
  ): string {
    return new sparqljs.Generator(parameters).stringify(
      Label.sparqlConstructQuery(parameters),
    );
  }

  export function sparqlConstructTemplateTriples({
    ignoreRdfType,
    subject,
    variablePrefix: variablePrefixParameter,
  }: {
    ignoreRdfType?: boolean;
    subject: rdfjs.Variable;
    variablePrefix?: string;
  }): readonly sparqljs.Triple[] {
    const variablePrefix = variablePrefixParameter ?? subject.value;
    return [
      ...(ignoreRdfType
        ? []
        : [
            {
              subject,
              predicate: dataFactory.namedNode(
                "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              ),
              object: dataFactory.variable(`${variablePrefix}RdfType`),
            },
          ]),
      {
        object: dataFactory.variable(`${variablePrefix}LiteralForm`),
        predicate: dataFactory.namedNode(
          "http://www.w3.org/2008/05/skos-xl#literalForm",
        ),
        subject,
      },
    ];
  }

  export function sparqlWherePatterns({
    ignoreRdfType,
    subject,
    variablePrefix: variablePrefixParameter,
  }: {
    ignoreRdfType?: boolean;
    subject: rdfjs.Variable;
    variablePrefix?: string;
  }): readonly sparqljs.Pattern[] {
    const variablePrefix = variablePrefixParameter ?? subject.value;
    return [
      ...(ignoreRdfType
        ? []
        : [
            {
              triples: [
                {
                  subject,
                  predicate: dataFactory.namedNode(
                    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                  ),
                  object: dataFactory.namedNode(
                    "http://www.w3.org/2008/05/skos-xl#Label",
                  ),
                },
                {
                  subject,
                  predicate: dataFactory.namedNode(
                    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                  ),
                  object: dataFactory.variable(`${variablePrefix}RdfType`),
                },
              ],
              type: "bgp" as const,
            },
          ]),
      {
        triples: [
          {
            object: dataFactory.variable(`${variablePrefix}LiteralForm`),
            predicate: dataFactory.namedNode(
              "http://www.w3.org/2008/05/skos-xl#literalForm",
            ),
            subject,
          },
        ],
        type: "bgp",
      },
    ];
  }
}
