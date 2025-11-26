import { StoreFactory as _DatasetFactory } from "n3";
const datasetFactory = new _DatasetFactory();
import type * as rdfjs from "@rdfjs/types";
import { DataFactory as dataFactory } from "n3";
import * as purify from "purify-ts";
import * as rdfLiteral from "rdf-literal";
import * as rdfjsResource from "rdfjs-resource";
import * as sparqljs from "sparqljs";
export namespace $RdfVocabularies {
  export namespace rdf {
    export const first = dataFactory.namedNode(
      "http://www.w3.org/1999/02/22-rdf-syntax-ns#first",
    );
    export const nil = dataFactory.namedNode(
      "http://www.w3.org/1999/02/22-rdf-syntax-ns#nil",
    );
    export const rest = dataFactory.namedNode(
      "http://www.w3.org/1999/02/22-rdf-syntax-ns#rest",
    );
    export const subject = dataFactory.namedNode(
      "http://www.w3.org/1999/02/22-rdf-syntax-ns#subject",
    );
    export const type = dataFactory.namedNode(
      "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
    );
  }

  export namespace rdfs {
    export const subClassOf = dataFactory.namedNode(
      "http://www.w3.org/2000/01/rdf-schema#subClassOf",
    );
  }

  export namespace xsd {
    export const boolean = dataFactory.namedNode(
      "http://www.w3.org/2001/XMLSchema#boolean",
    );
    export const date = dataFactory.namedNode(
      "http://www.w3.org/2001/XMLSchema#date",
    );
    export const dateTime = dataFactory.namedNode(
      "http://www.w3.org/2001/XMLSchema#dateTime",
    );
    export const integer = dataFactory.namedNode(
      "http://www.w3.org/2001/XMLSchema#integer",
    );
  }
}
/**
 * A sparqljs.Pattern that's the equivalent of ?subject rdf:type/rdfs:subClassOf* ?rdfType .
 */
export function $sparqlInstancesOfPattern({
  rdfType,
  subject,
}: {
  rdfType: rdfjs.NamedNode | rdfjs.Variable;
  subject: sparqljs.Triple["subject"];
}): sparqljs.Pattern {
  return {
    triples: [
      {
        subject,
        predicate: {
          items: [
            $RdfVocabularies.rdf.type,
            {
              items: [$RdfVocabularies.rdfs.subClassOf],
              pathType: "*",
              type: "path",
            },
          ],
          pathType: "/",
          type: "path",
        },
        object: rdfType,
      },
    ],
    type: "bgp",
  };
}
function $isReadonlyObjectArray(x: unknown): x is readonly object[] {
  return Array.isArray(x) && x.every((z) => typeof z === "object");
}
function $isReadonlyBooleanArray(x: unknown): x is readonly boolean[] {
  return Array.isArray(x) && x.every((z) => typeof z === "boolean");
}
function $isReadonlyNumberArray(x: unknown): x is readonly number[] {
  return Array.isArray(x) && x.every((z) => typeof z === "number");
}
function $isReadonlyStringArray(x: unknown): x is readonly string[] {
  return Array.isArray(x) && x.every((z) => typeof z === "string");
}
type $UnwrapR<T> = T extends purify.Either<any, infer R> ? R : never;
export interface LabelStub {
  readonly $identifier: LabelStub.$Identifier;
  readonly $type: "LabelStub";
  readonly literalForm: purify.NonEmptyList<rdfjs.Literal>;
}

export namespace LabelStub {
  export function $create(parameters: {
    readonly $identifier?: (rdfjs.BlankNode | rdfjs.NamedNode) | string;
    readonly literalForm: purify.NonEmptyList<rdfjs.Literal>;
  }): LabelStub {
    let $identifier: LabelStub.$Identifier;
    if (typeof parameters.$identifier === "object") {
      $identifier = parameters.$identifier;
    } else if (typeof parameters.$identifier === "string") {
      $identifier = dataFactory.namedNode(parameters.$identifier);
    } else if (typeof parameters.$identifier === "undefined") {
      $identifier = dataFactory.blankNode();
    } else {
      $identifier = parameters.$identifier satisfies never;
    }

    const $type = "LabelStub" as const;
    const literalForm = parameters.literalForm;
    return { $identifier, $type, literalForm };
  }

  export function $fromRdf(
    resource: rdfjsResource.Resource,
    options?: {
      [_index: string]: any;
      ignoreRdfType?: boolean;
      objectSet?: $ObjectSet;
      preferredLanguages?: readonly string[];
    },
  ): purify.Either<Error, LabelStub> {
    let {
      ignoreRdfType = false,
      objectSet,
      preferredLanguages,
      ...context
    } = options ?? {};
    if (!objectSet) {
      objectSet = new $RdfjsDatasetObjectSet({ dataset: resource.dataset });
    }

    return LabelStub.$propertiesFromRdf({
      ...context,
      ignoreRdfType,
      objectSet,
      preferredLanguages,
      resource,
    });
  }

  export const $fromRdfType: rdfjs.NamedNode<string> = dataFactory.namedNode(
    "http://www.w3.org/2008/05/skos-xl#Label",
  );
  export type $Identifier = rdfjs.BlankNode | rdfjs.NamedNode;

  export namespace $Identifier {
    export function fromString(
      identifier: string,
    ): purify.Either<Error, rdfjsResource.Resource.Identifier> {
      return purify.Either.encase(() =>
        rdfjsResource.Resource.Identifier.fromString({
          dataFactory,
          identifier,
        }),
      );
    }

    export const // biome-ignore lint/suspicious/noShadowRestrictedNames:
      toString = rdfjsResource.Resource.Identifier.toString;
  }

  export const $properties = {
    literalForm: {
      identifier: dataFactory.namedNode(
        "http://www.w3.org/2008/05/skos-xl#literalForm",
      ),
    },
  };

  export function $propertiesFromRdf({
    ignoreRdfType: $ignoreRdfType,
    objectSet: $objectSet,
    preferredLanguages: $preferredLanguages,
    resource: $resource,
    // @ts-ignore
    ...$context
  }: {
    [_index: string]: any;
    ignoreRdfType: boolean;
    objectSet: $ObjectSet;
    preferredLanguages?: readonly string[];
    resource: rdfjsResource.Resource;
  }): purify.Either<
    Error,
    {
      $identifier: rdfjs.BlankNode | rdfjs.NamedNode;
      $type: "LabelStub";
      literalForm: purify.NonEmptyList<rdfjs.Literal>;
    }
  > {
    if (!$ignoreRdfType) {
      const $rdfTypeCheck: purify.Either<Error, true> = $resource
        .value($RdfVocabularies.rdf.type)
        .chain((actualRdfType) => actualRdfType.toIri())
        .chain((actualRdfType) => {
          // Check the expected type and its known subtypes
          switch (actualRdfType.value) {
            case "http://www.w3.org/2008/05/skos-xl#Label":
              return purify.Either.of(true);
          }

          // Check arbitrary rdfs:subClassOf's of the expected type
          if ($resource.isInstanceOf(LabelStub.$fromRdfType)) {
            return purify.Either.of(true);
          }

          return purify.Left(
            new Error(
              `${rdfjsResource.Resource.Identifier.toString($resource.identifier)} has unexpected RDF type (actual: ${actualRdfType.value}, expected: http://www.w3.org/2008/05/skos-xl#Label)`,
            ),
          );
        });
      if ($rdfTypeCheck.isLeft()) {
        return $rdfTypeCheck;
      }
    }

    const $identifier: LabelStub.$Identifier = $resource.identifier;
    const $type = "LabelStub" as const;
    const _literalFormEither: purify.Either<
      Error,
      purify.NonEmptyList<rdfjs.Literal>
    > = purify.Either.of<
      Error,
      rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
    >($resource.values($properties.literalForm["identifier"], { unique: true }))
      .chain((values) => {
        if (!$preferredLanguages || $preferredLanguages.length === 0) {
          return purify.Either.of<
            Error,
            rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
          >(values);
        }

        const literalValuesEither = values.chainMap((value) =>
          value.toLiteral(),
        );
        if (literalValuesEither.isLeft()) {
          return literalValuesEither;
        }
        const literalValues = literalValuesEither.unsafeCoerce();

        // Return all literals for the first preferredLanguage, then all literals for the second preferredLanguage, etc.
        // Within a preferredLanguage the literals may be in any order.
        let filteredLiteralValues:
          | rdfjsResource.Resource.Values<rdfjs.Literal>
          | undefined;
        for (const preferredLanguage of $preferredLanguages) {
          if (!filteredLiteralValues) {
            filteredLiteralValues = literalValues.filter(
              (value) => value.language === preferredLanguage,
            );
          } else {
            filteredLiteralValues = filteredLiteralValues.concat(
              ...literalValues
                .filter((value) => value.language === preferredLanguage)
                .toArray(),
            );
          }
        }

        return purify.Either.of<
          Error,
          rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
        >(
          filteredLiteralValues!.map(
            (literalValue) =>
              new rdfjsResource.Resource.TermValue({
                focusResource: $resource,
                predicate: LabelStub.$properties.literalForm["identifier"],
                term: literalValue,
              }),
          ),
        );
      })
      .chain((values) => values.chainMap((value) => value.toLiteral()))
      .chain((values) =>
        purify.NonEmptyList.fromArray(values.toArray()).toEither(
          new Error(
            `${rdfjsResource.Resource.Identifier.toString($resource.identifier)} is an empty set`,
          ),
        ),
      )
      .map((valuesArray) =>
        rdfjsResource.Resource.Values.fromValue({
          focusResource: $resource,
          predicate: LabelStub.$properties.literalForm["identifier"],
          value: valuesArray,
        }),
      )
      .chain((values) => values.head());
    if (_literalFormEither.isLeft()) {
      return _literalFormEither;
    }

    const literalForm = _literalFormEither.unsafeCoerce();
    return purify.Either.of({ $identifier, $type, literalForm });
  }

  export function $sparqlConstructQuery(
    parameters?: {
      ignoreRdfType?: boolean;
      prefixes?: { [prefix: string]: string };
      preferredLanguages?: readonly string[];
      subject?: sparqljs.Triple["subject"];
    } & Omit<sparqljs.ConstructQuery, "prefixes" | "queryType" | "type">,
  ): sparqljs.ConstructQuery {
    const { ignoreRdfType, preferredLanguages, subject, ...queryParameters } =
      parameters ?? {};

    return {
      ...queryParameters,
      prefixes: parameters?.prefixes ?? {},
      queryType: "CONSTRUCT",
      template: (queryParameters.template ?? []).concat(
        LabelStub.$sparqlConstructTemplateTriples({ ignoreRdfType, subject }),
      ),
      type: "query",
      where: (queryParameters.where ?? []).concat(
        LabelStub.$sparqlWherePatterns({
          ignoreRdfType,
          preferredLanguages,
          subject,
        }),
      ),
    };
  }

  export function $sparqlConstructQueryString(
    parameters?: {
      ignoreRdfType?: boolean;
      preferredLanguages?: readonly string[];
      subject?: sparqljs.Triple["subject"];
      variablePrefix?: string;
    } & Omit<sparqljs.ConstructQuery, "prefixes" | "queryType" | "type"> &
      sparqljs.GeneratorOptions,
  ): string {
    return new sparqljs.Generator(parameters).stringify(
      LabelStub.$sparqlConstructQuery(parameters),
    );
  }

  export function $sparqlConstructTemplateTriples(parameters?: {
    ignoreRdfType?: boolean;
    subject?: sparqljs.Triple["subject"];
    variablePrefix?: string;
  }): readonly sparqljs.Triple[] {
    const subject = parameters?.subject ?? dataFactory.variable!("labelStub");
    const triples: sparqljs.Triple[] = [];
    const variablePrefix =
      parameters?.variablePrefix ??
      (subject.termType === "Variable" ? subject.value : "labelStub");
    if (!parameters?.ignoreRdfType) {
      triples.push(
        {
          subject,
          predicate: $RdfVocabularies.rdf.type,
          object: dataFactory.variable!(`${variablePrefix}RdfType`),
        },
        {
          subject: dataFactory.variable!(`${variablePrefix}RdfType`),
          predicate: $RdfVocabularies.rdfs.subClassOf,
          object: dataFactory.variable!(`${variablePrefix}RdfClass`),
        },
      );
    }

    triples.push({
      object: dataFactory.variable!(`${variablePrefix}LiteralForm`),
      predicate: LabelStub.$properties.literalForm["identifier"],
      subject,
    });
    return triples;
  }

  export function $sparqlWherePatterns(parameters?: {
    ignoreRdfType?: boolean;
    preferredLanguages?: readonly string[];
    subject?: sparqljs.Triple["subject"];
    variablePrefix?: string;
  }): readonly sparqljs.Pattern[] {
    const optionalPatterns: sparqljs.OptionalPattern[] = [];
    const requiredPatterns: sparqljs.Pattern[] = [];
    const subject = parameters?.subject ?? dataFactory.variable!("labelStub");
    const variablePrefix =
      parameters?.variablePrefix ??
      (subject.termType === "Variable" ? subject.value : "labelStub");
    const rdfTypeVariable = dataFactory.variable!(`${variablePrefix}RdfType`);
    if (!parameters?.ignoreRdfType) {
      requiredPatterns.push(
        $sparqlInstancesOfPattern({ rdfType: LabelStub.$fromRdfType, subject }),
        {
          triples: [
            {
              subject,
              predicate: $RdfVocabularies.rdf.type,
              object: rdfTypeVariable,
            },
          ],
          type: "bgp" as const,
        },
      );
      optionalPatterns.push({
        patterns: [
          {
            triples: [
              {
                subject: rdfTypeVariable,
                predicate: {
                  items: [$RdfVocabularies.rdfs.subClassOf],
                  pathType: "+" as const,
                  type: "path" as const,
                },
                object: dataFactory.variable!(`${variablePrefix}RdfClass`),
              },
            ],
            type: "bgp" as const,
          },
        ],
        type: "optional" as const,
      });
    }

    const propertyPatterns: readonly sparqljs.Pattern[] = [
      {
        triples: [
          {
            object: dataFactory.variable!(`${variablePrefix}LiteralForm`),
            predicate: LabelStub.$properties.literalForm["identifier"],
            subject,
          },
        ],
        type: "bgp",
      },
      ...[parameters?.preferredLanguages ?? []]
        .filter((languages) => languages.length > 0)
        .map((languages) =>
          languages.map((language) => ({
            type: "operation" as const,
            operator: "=",
            args: [
              {
                type: "operation" as const,
                operator: "lang",
                args: [dataFactory.variable!(`${variablePrefix}LiteralForm`)],
              },
              dataFactory.literal(language),
            ],
          })),
        )
        .map((langEqualsExpressions) => ({
          type: "filter" as const,
          expression: langEqualsExpressions.reduce(
            (reducedExpression, langEqualsExpression) => {
              if (reducedExpression === null) {
                return langEqualsExpression;
              }
              return {
                type: "operation" as const,
                operator: "||",
                args: [reducedExpression, langEqualsExpression],
              };
            },
            null as sparqljs.Expression | null,
          ) as sparqljs.Expression,
        })),
    ];
    for (const pattern of propertyPatterns) {
      if (pattern.type === "optional") {
        optionalPatterns.push(pattern);
      } else {
        requiredPatterns.push(pattern);
      }
    }

    return requiredPatterns.concat(optionalPatterns);
  }

  export function $toRdf(
    _labelStub: LabelStub,
    options?: {
      ignoreRdfType?: boolean;
      mutateGraph?: rdfjsResource.MutableResource.MutateGraph;
      resourceSet?: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource {
    const ignoreRdfType = !!options?.ignoreRdfType;
    const mutateGraph = options?.mutateGraph;
    const resourceSet =
      options?.resourceSet ??
      new rdfjsResource.MutableResourceSet({
        dataFactory,
        dataset: datasetFactory.dataset(),
      });
    const resource = resourceSet.mutableResource(_labelStub.$identifier, {
      mutateGraph,
    });
    if (!ignoreRdfType) {
      resource.add(
        $RdfVocabularies.rdf.type,
        resource.dataFactory.namedNode(
          "http://kos-kit.github.io/ontology#LabelStub",
        ),
      );
      resource.add(
        $RdfVocabularies.rdf.type,
        resource.dataFactory.namedNode(
          "http://www.w3.org/2008/05/skos-xl#Label",
        ),
      );
    }

    resource.add(
      LabelStub.$properties.literalForm["identifier"],
      ..._labelStub.literalForm.flatMap((item) => [item]),
    );
    return resource;
  }
}
export interface Label {
  readonly $identifier: Label.$Identifier;
  readonly $type: "Label";
  readonly literalForm: purify.NonEmptyList<rdfjs.Literal>;
}

export namespace Label {
  export function $create(parameters: {
    readonly $identifier?: (rdfjs.BlankNode | rdfjs.NamedNode) | string;
    readonly literalForm: purify.NonEmptyList<rdfjs.Literal>;
  }): Label {
    let $identifier: Label.$Identifier;
    if (typeof parameters.$identifier === "object") {
      $identifier = parameters.$identifier;
    } else if (typeof parameters.$identifier === "string") {
      $identifier = dataFactory.namedNode(parameters.$identifier);
    } else if (typeof parameters.$identifier === "undefined") {
      $identifier = dataFactory.blankNode();
    } else {
      $identifier = parameters.$identifier satisfies never;
    }

    const $type = "Label" as const;
    const literalForm = parameters.literalForm;
    return { $identifier, $type, literalForm };
  }

  export function $fromRdf(
    resource: rdfjsResource.Resource,
    options?: {
      [_index: string]: any;
      ignoreRdfType?: boolean;
      objectSet?: $ObjectSet;
      preferredLanguages?: readonly string[];
    },
  ): purify.Either<Error, Label> {
    let {
      ignoreRdfType = false,
      objectSet,
      preferredLanguages,
      ...context
    } = options ?? {};
    if (!objectSet) {
      objectSet = new $RdfjsDatasetObjectSet({ dataset: resource.dataset });
    }

    return Label.$propertiesFromRdf({
      ...context,
      ignoreRdfType,
      objectSet,
      preferredLanguages,
      resource,
    });
  }

  export const $fromRdfType: rdfjs.NamedNode<string> = dataFactory.namedNode(
    "http://www.w3.org/2008/05/skos-xl#Label",
  );
  export type $Identifier = rdfjs.BlankNode | rdfjs.NamedNode;

  export namespace $Identifier {
    export function fromString(
      identifier: string,
    ): purify.Either<Error, rdfjsResource.Resource.Identifier> {
      return purify.Either.encase(() =>
        rdfjsResource.Resource.Identifier.fromString({
          dataFactory,
          identifier,
        }),
      );
    }

    export const // biome-ignore lint/suspicious/noShadowRestrictedNames:
      toString = rdfjsResource.Resource.Identifier.toString;
  }

  export const $properties = {
    literalForm: {
      identifier: dataFactory.namedNode(
        "http://www.w3.org/2008/05/skos-xl#literalForm",
      ),
    },
  };

  export function $propertiesFromRdf({
    ignoreRdfType: $ignoreRdfType,
    objectSet: $objectSet,
    preferredLanguages: $preferredLanguages,
    resource: $resource,
    // @ts-ignore
    ...$context
  }: {
    [_index: string]: any;
    ignoreRdfType: boolean;
    objectSet: $ObjectSet;
    preferredLanguages?: readonly string[];
    resource: rdfjsResource.Resource;
  }): purify.Either<
    Error,
    {
      $identifier: rdfjs.BlankNode | rdfjs.NamedNode;
      $type: "Label";
      literalForm: purify.NonEmptyList<rdfjs.Literal>;
    }
  > {
    if (!$ignoreRdfType) {
      const $rdfTypeCheck: purify.Either<Error, true> = $resource
        .value($RdfVocabularies.rdf.type)
        .chain((actualRdfType) => actualRdfType.toIri())
        .chain((actualRdfType) => {
          // Check the expected type and its known subtypes
          switch (actualRdfType.value) {
            case "http://www.w3.org/2008/05/skos-xl#Label":
              return purify.Either.of(true);
          }

          // Check arbitrary rdfs:subClassOf's of the expected type
          if ($resource.isInstanceOf(Label.$fromRdfType)) {
            return purify.Either.of(true);
          }

          return purify.Left(
            new Error(
              `${rdfjsResource.Resource.Identifier.toString($resource.identifier)} has unexpected RDF type (actual: ${actualRdfType.value}, expected: http://www.w3.org/2008/05/skos-xl#Label)`,
            ),
          );
        });
      if ($rdfTypeCheck.isLeft()) {
        return $rdfTypeCheck;
      }
    }

    const $identifier: Label.$Identifier = $resource.identifier;
    const $type = "Label" as const;
    const _literalFormEither: purify.Either<
      Error,
      purify.NonEmptyList<rdfjs.Literal>
    > = purify.Either.of<
      Error,
      rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
    >($resource.values($properties.literalForm["identifier"], { unique: true }))
      .chain((values) => {
        if (!$preferredLanguages || $preferredLanguages.length === 0) {
          return purify.Either.of<
            Error,
            rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
          >(values);
        }

        const literalValuesEither = values.chainMap((value) =>
          value.toLiteral(),
        );
        if (literalValuesEither.isLeft()) {
          return literalValuesEither;
        }
        const literalValues = literalValuesEither.unsafeCoerce();

        // Return all literals for the first preferredLanguage, then all literals for the second preferredLanguage, etc.
        // Within a preferredLanguage the literals may be in any order.
        let filteredLiteralValues:
          | rdfjsResource.Resource.Values<rdfjs.Literal>
          | undefined;
        for (const preferredLanguage of $preferredLanguages) {
          if (!filteredLiteralValues) {
            filteredLiteralValues = literalValues.filter(
              (value) => value.language === preferredLanguage,
            );
          } else {
            filteredLiteralValues = filteredLiteralValues.concat(
              ...literalValues
                .filter((value) => value.language === preferredLanguage)
                .toArray(),
            );
          }
        }

        return purify.Either.of<
          Error,
          rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
        >(
          filteredLiteralValues!.map(
            (literalValue) =>
              new rdfjsResource.Resource.TermValue({
                focusResource: $resource,
                predicate: Label.$properties.literalForm["identifier"],
                term: literalValue,
              }),
          ),
        );
      })
      .chain((values) => values.chainMap((value) => value.toLiteral()))
      .chain((values) =>
        purify.NonEmptyList.fromArray(values.toArray()).toEither(
          new Error(
            `${rdfjsResource.Resource.Identifier.toString($resource.identifier)} is an empty set`,
          ),
        ),
      )
      .map((valuesArray) =>
        rdfjsResource.Resource.Values.fromValue({
          focusResource: $resource,
          predicate: Label.$properties.literalForm["identifier"],
          value: valuesArray,
        }),
      )
      .chain((values) => values.head());
    if (_literalFormEither.isLeft()) {
      return _literalFormEither;
    }

    const literalForm = _literalFormEither.unsafeCoerce();
    return purify.Either.of({ $identifier, $type, literalForm });
  }

  export function $sparqlConstructQuery(
    parameters?: {
      ignoreRdfType?: boolean;
      prefixes?: { [prefix: string]: string };
      preferredLanguages?: readonly string[];
      subject?: sparqljs.Triple["subject"];
    } & Omit<sparqljs.ConstructQuery, "prefixes" | "queryType" | "type">,
  ): sparqljs.ConstructQuery {
    const { ignoreRdfType, preferredLanguages, subject, ...queryParameters } =
      parameters ?? {};

    return {
      ...queryParameters,
      prefixes: parameters?.prefixes ?? {},
      queryType: "CONSTRUCT",
      template: (queryParameters.template ?? []).concat(
        Label.$sparqlConstructTemplateTriples({ ignoreRdfType, subject }),
      ),
      type: "query",
      where: (queryParameters.where ?? []).concat(
        Label.$sparqlWherePatterns({
          ignoreRdfType,
          preferredLanguages,
          subject,
        }),
      ),
    };
  }

  export function $sparqlConstructQueryString(
    parameters?: {
      ignoreRdfType?: boolean;
      preferredLanguages?: readonly string[];
      subject?: sparqljs.Triple["subject"];
      variablePrefix?: string;
    } & Omit<sparqljs.ConstructQuery, "prefixes" | "queryType" | "type"> &
      sparqljs.GeneratorOptions,
  ): string {
    return new sparqljs.Generator(parameters).stringify(
      Label.$sparqlConstructQuery(parameters),
    );
  }

  export function $sparqlConstructTemplateTriples(parameters?: {
    ignoreRdfType?: boolean;
    subject?: sparqljs.Triple["subject"];
    variablePrefix?: string;
  }): readonly sparqljs.Triple[] {
    const subject = parameters?.subject ?? dataFactory.variable!("label");
    const triples: sparqljs.Triple[] = [];
    const variablePrefix =
      parameters?.variablePrefix ??
      (subject.termType === "Variable" ? subject.value : "label");
    if (!parameters?.ignoreRdfType) {
      triples.push(
        {
          subject,
          predicate: $RdfVocabularies.rdf.type,
          object: dataFactory.variable!(`${variablePrefix}RdfType`),
        },
        {
          subject: dataFactory.variable!(`${variablePrefix}RdfType`),
          predicate: $RdfVocabularies.rdfs.subClassOf,
          object: dataFactory.variable!(`${variablePrefix}RdfClass`),
        },
      );
    }

    triples.push({
      object: dataFactory.variable!(`${variablePrefix}LiteralForm`),
      predicate: Label.$properties.literalForm["identifier"],
      subject,
    });
    return triples;
  }

  export function $sparqlWherePatterns(parameters?: {
    ignoreRdfType?: boolean;
    preferredLanguages?: readonly string[];
    subject?: sparqljs.Triple["subject"];
    variablePrefix?: string;
  }): readonly sparqljs.Pattern[] {
    const optionalPatterns: sparqljs.OptionalPattern[] = [];
    const requiredPatterns: sparqljs.Pattern[] = [];
    const subject = parameters?.subject ?? dataFactory.variable!("label");
    const variablePrefix =
      parameters?.variablePrefix ??
      (subject.termType === "Variable" ? subject.value : "label");
    const rdfTypeVariable = dataFactory.variable!(`${variablePrefix}RdfType`);
    if (!parameters?.ignoreRdfType) {
      requiredPatterns.push(
        $sparqlInstancesOfPattern({ rdfType: Label.$fromRdfType, subject }),
        {
          triples: [
            {
              subject,
              predicate: $RdfVocabularies.rdf.type,
              object: rdfTypeVariable,
            },
          ],
          type: "bgp" as const,
        },
      );
      optionalPatterns.push({
        patterns: [
          {
            triples: [
              {
                subject: rdfTypeVariable,
                predicate: {
                  items: [$RdfVocabularies.rdfs.subClassOf],
                  pathType: "+" as const,
                  type: "path" as const,
                },
                object: dataFactory.variable!(`${variablePrefix}RdfClass`),
              },
            ],
            type: "bgp" as const,
          },
        ],
        type: "optional" as const,
      });
    }

    const propertyPatterns: readonly sparqljs.Pattern[] = [
      {
        triples: [
          {
            object: dataFactory.variable!(`${variablePrefix}LiteralForm`),
            predicate: Label.$properties.literalForm["identifier"],
            subject,
          },
        ],
        type: "bgp",
      },
      ...[parameters?.preferredLanguages ?? []]
        .filter((languages) => languages.length > 0)
        .map((languages) =>
          languages.map((language) => ({
            type: "operation" as const,
            operator: "=",
            args: [
              {
                type: "operation" as const,
                operator: "lang",
                args: [dataFactory.variable!(`${variablePrefix}LiteralForm`)],
              },
              dataFactory.literal(language),
            ],
          })),
        )
        .map((langEqualsExpressions) => ({
          type: "filter" as const,
          expression: langEqualsExpressions.reduce(
            (reducedExpression, langEqualsExpression) => {
              if (reducedExpression === null) {
                return langEqualsExpression;
              }
              return {
                type: "operation" as const,
                operator: "||",
                args: [reducedExpression, langEqualsExpression],
              };
            },
            null as sparqljs.Expression | null,
          ) as sparqljs.Expression,
        })),
    ];
    for (const pattern of propertyPatterns) {
      if (pattern.type === "optional") {
        optionalPatterns.push(pattern);
      } else {
        requiredPatterns.push(pattern);
      }
    }

    return requiredPatterns.concat(optionalPatterns);
  }

  export function $toRdf(
    _label: Label,
    options?: {
      ignoreRdfType?: boolean;
      mutateGraph?: rdfjsResource.MutableResource.MutateGraph;
      resourceSet?: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource {
    const ignoreRdfType = !!options?.ignoreRdfType;
    const mutateGraph = options?.mutateGraph;
    const resourceSet =
      options?.resourceSet ??
      new rdfjsResource.MutableResourceSet({
        dataFactory,
        dataset: datasetFactory.dataset(),
      });
    const resource = resourceSet.mutableResource(_label.$identifier, {
      mutateGraph,
    });
    if (!ignoreRdfType) {
      resource.add(
        $RdfVocabularies.rdf.type,
        resource.dataFactory.namedNode(
          "http://www.w3.org/2008/05/skos-xl#Label",
        ),
      );
    }

    resource.add(
      Label.$properties.literalForm["identifier"],
      ..._label.literalForm.flatMap((item) => [item]),
    );
    return resource;
  }
}
export interface KosResource {
  readonly $identifier: KosResourceStatic.$Identifier;
  readonly $type: "Concept" | "ConceptScheme";
  readonly altLabel: readonly rdfjs.Literal[];
  readonly altLabelXl: readonly Label[];
  readonly changeNote: readonly rdfjs.Literal[];
  readonly definition: readonly rdfjs.Literal[];
  readonly editorialNote: readonly rdfjs.Literal[];
  readonly example: readonly rdfjs.Literal[];
  readonly hiddenLabel: readonly rdfjs.Literal[];
  readonly hiddenLabelXl: readonly Label[];
  readonly historyNote: readonly rdfjs.Literal[];
  readonly modified: purify.Maybe<Date>;
  readonly notation: readonly rdfjs.Literal[];
  readonly note: readonly rdfjs.Literal[];
  readonly prefLabel: readonly rdfjs.Literal[];
  readonly prefLabelXl: readonly Label[];
  readonly scopeNote: readonly rdfjs.Literal[];
}

export namespace KosResourceStatic {
  export function $create(parameters: {
    readonly $identifier: rdfjs.NamedNode | string;
    readonly altLabel?:
      | readonly rdfjs.Literal[]
      | readonly boolean[]
      | readonly number[]
      | readonly string[];
    readonly altLabelXl?: readonly Label[];
    readonly changeNote?:
      | readonly rdfjs.Literal[]
      | readonly boolean[]
      | readonly number[]
      | readonly string[];
    readonly definition?:
      | readonly rdfjs.Literal[]
      | readonly boolean[]
      | readonly number[]
      | readonly string[];
    readonly editorialNote?:
      | readonly rdfjs.Literal[]
      | readonly boolean[]
      | readonly number[]
      | readonly string[];
    readonly example?:
      | readonly rdfjs.Literal[]
      | readonly boolean[]
      | readonly number[]
      | readonly string[];
    readonly hiddenLabel?:
      | readonly rdfjs.Literal[]
      | readonly boolean[]
      | readonly number[]
      | readonly string[];
    readonly hiddenLabelXl?: readonly Label[];
    readonly historyNote?:
      | readonly rdfjs.Literal[]
      | readonly boolean[]
      | readonly number[]
      | readonly string[];
    readonly modified?: Date | purify.Maybe<Date>;
    readonly notation?:
      | readonly rdfjs.Literal[]
      | readonly boolean[]
      | readonly number[]
      | readonly string[];
    readonly note?:
      | readonly rdfjs.Literal[]
      | readonly boolean[]
      | readonly number[]
      | readonly string[];
    readonly prefLabel?:
      | readonly rdfjs.Literal[]
      | readonly boolean[]
      | readonly number[]
      | readonly string[];
    readonly prefLabelXl?: readonly Label[];
    readonly scopeNote?:
      | readonly rdfjs.Literal[]
      | readonly boolean[]
      | readonly number[]
      | readonly string[];
  }): Omit<KosResource, "$type"> {
    let $identifier: KosResourceStatic.$Identifier;
    if (typeof parameters.$identifier === "object") {
      $identifier = parameters.$identifier;
    } else if (typeof parameters.$identifier === "string") {
      $identifier = dataFactory.namedNode(parameters.$identifier);
    } else {
      $identifier = parameters.$identifier satisfies never;
    }

    let altLabel: readonly rdfjs.Literal[];
    if (typeof parameters.altLabel === "undefined") {
      altLabel = [];
    } else if ($isReadonlyObjectArray(parameters.altLabel)) {
      altLabel = parameters.altLabel;
    } else if ($isReadonlyBooleanArray(parameters.altLabel)) {
      altLabel = parameters.altLabel.map((item) =>
        rdfLiteral.toRdf(item, { dataFactory }),
      );
    } else if ($isReadonlyNumberArray(parameters.altLabel)) {
      altLabel = parameters.altLabel.map((item) =>
        rdfLiteral.toRdf(item, { dataFactory }),
      );
    } else if ($isReadonlyStringArray(parameters.altLabel)) {
      altLabel = parameters.altLabel.map((item) => dataFactory.literal(item));
    } else {
      altLabel = parameters.altLabel satisfies never;
    }

    let altLabelXl: readonly Label[];
    if (typeof parameters.altLabelXl === "undefined") {
      altLabelXl = [];
    } else if (typeof parameters.altLabelXl === "object") {
      altLabelXl = parameters.altLabelXl;
    } else {
      altLabelXl = parameters.altLabelXl satisfies never;
    }

    let changeNote: readonly rdfjs.Literal[];
    if (typeof parameters.changeNote === "undefined") {
      changeNote = [];
    } else if ($isReadonlyObjectArray(parameters.changeNote)) {
      changeNote = parameters.changeNote;
    } else if ($isReadonlyBooleanArray(parameters.changeNote)) {
      changeNote = parameters.changeNote.map((item) =>
        rdfLiteral.toRdf(item, { dataFactory }),
      );
    } else if ($isReadonlyNumberArray(parameters.changeNote)) {
      changeNote = parameters.changeNote.map((item) =>
        rdfLiteral.toRdf(item, { dataFactory }),
      );
    } else if ($isReadonlyStringArray(parameters.changeNote)) {
      changeNote = parameters.changeNote.map((item) =>
        dataFactory.literal(item),
      );
    } else {
      changeNote = parameters.changeNote satisfies never;
    }

    let definition: readonly rdfjs.Literal[];
    if (typeof parameters.definition === "undefined") {
      definition = [];
    } else if ($isReadonlyObjectArray(parameters.definition)) {
      definition = parameters.definition;
    } else if ($isReadonlyBooleanArray(parameters.definition)) {
      definition = parameters.definition.map((item) =>
        rdfLiteral.toRdf(item, { dataFactory }),
      );
    } else if ($isReadonlyNumberArray(parameters.definition)) {
      definition = parameters.definition.map((item) =>
        rdfLiteral.toRdf(item, { dataFactory }),
      );
    } else if ($isReadonlyStringArray(parameters.definition)) {
      definition = parameters.definition.map((item) =>
        dataFactory.literal(item),
      );
    } else {
      definition = parameters.definition satisfies never;
    }

    let editorialNote: readonly rdfjs.Literal[];
    if (typeof parameters.editorialNote === "undefined") {
      editorialNote = [];
    } else if ($isReadonlyObjectArray(parameters.editorialNote)) {
      editorialNote = parameters.editorialNote;
    } else if ($isReadonlyBooleanArray(parameters.editorialNote)) {
      editorialNote = parameters.editorialNote.map((item) =>
        rdfLiteral.toRdf(item, { dataFactory }),
      );
    } else if ($isReadonlyNumberArray(parameters.editorialNote)) {
      editorialNote = parameters.editorialNote.map((item) =>
        rdfLiteral.toRdf(item, { dataFactory }),
      );
    } else if ($isReadonlyStringArray(parameters.editorialNote)) {
      editorialNote = parameters.editorialNote.map((item) =>
        dataFactory.literal(item),
      );
    } else {
      editorialNote = parameters.editorialNote satisfies never;
    }

    let example: readonly rdfjs.Literal[];
    if (typeof parameters.example === "undefined") {
      example = [];
    } else if ($isReadonlyObjectArray(parameters.example)) {
      example = parameters.example;
    } else if ($isReadonlyBooleanArray(parameters.example)) {
      example = parameters.example.map((item) =>
        rdfLiteral.toRdf(item, { dataFactory }),
      );
    } else if ($isReadonlyNumberArray(parameters.example)) {
      example = parameters.example.map((item) =>
        rdfLiteral.toRdf(item, { dataFactory }),
      );
    } else if ($isReadonlyStringArray(parameters.example)) {
      example = parameters.example.map((item) => dataFactory.literal(item));
    } else {
      example = parameters.example satisfies never;
    }

    let hiddenLabel: readonly rdfjs.Literal[];
    if (typeof parameters.hiddenLabel === "undefined") {
      hiddenLabel = [];
    } else if ($isReadonlyObjectArray(parameters.hiddenLabel)) {
      hiddenLabel = parameters.hiddenLabel;
    } else if ($isReadonlyBooleanArray(parameters.hiddenLabel)) {
      hiddenLabel = parameters.hiddenLabel.map((item) =>
        rdfLiteral.toRdf(item, { dataFactory }),
      );
    } else if ($isReadonlyNumberArray(parameters.hiddenLabel)) {
      hiddenLabel = parameters.hiddenLabel.map((item) =>
        rdfLiteral.toRdf(item, { dataFactory }),
      );
    } else if ($isReadonlyStringArray(parameters.hiddenLabel)) {
      hiddenLabel = parameters.hiddenLabel.map((item) =>
        dataFactory.literal(item),
      );
    } else {
      hiddenLabel = parameters.hiddenLabel satisfies never;
    }

    let hiddenLabelXl: readonly Label[];
    if (typeof parameters.hiddenLabelXl === "undefined") {
      hiddenLabelXl = [];
    } else if (typeof parameters.hiddenLabelXl === "object") {
      hiddenLabelXl = parameters.hiddenLabelXl;
    } else {
      hiddenLabelXl = parameters.hiddenLabelXl satisfies never;
    }

    let historyNote: readonly rdfjs.Literal[];
    if (typeof parameters.historyNote === "undefined") {
      historyNote = [];
    } else if ($isReadonlyObjectArray(parameters.historyNote)) {
      historyNote = parameters.historyNote;
    } else if ($isReadonlyBooleanArray(parameters.historyNote)) {
      historyNote = parameters.historyNote.map((item) =>
        rdfLiteral.toRdf(item, { dataFactory }),
      );
    } else if ($isReadonlyNumberArray(parameters.historyNote)) {
      historyNote = parameters.historyNote.map((item) =>
        rdfLiteral.toRdf(item, { dataFactory }),
      );
    } else if ($isReadonlyStringArray(parameters.historyNote)) {
      historyNote = parameters.historyNote.map((item) =>
        dataFactory.literal(item),
      );
    } else {
      historyNote = parameters.historyNote satisfies never;
    }

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
      modified = parameters.modified satisfies never;
    }

    let notation: readonly rdfjs.Literal[];
    if (typeof parameters.notation === "undefined") {
      notation = [];
    } else if ($isReadonlyObjectArray(parameters.notation)) {
      notation = parameters.notation;
    } else if ($isReadonlyBooleanArray(parameters.notation)) {
      notation = parameters.notation.map((item) =>
        rdfLiteral.toRdf(item, { dataFactory }),
      );
    } else if ($isReadonlyNumberArray(parameters.notation)) {
      notation = parameters.notation.map((item) =>
        rdfLiteral.toRdf(item, { dataFactory }),
      );
    } else if ($isReadonlyStringArray(parameters.notation)) {
      notation = parameters.notation.map((item) => dataFactory.literal(item));
    } else {
      notation = parameters.notation satisfies never;
    }

    let note: readonly rdfjs.Literal[];
    if (typeof parameters.note === "undefined") {
      note = [];
    } else if ($isReadonlyObjectArray(parameters.note)) {
      note = parameters.note;
    } else if ($isReadonlyBooleanArray(parameters.note)) {
      note = parameters.note.map((item) =>
        rdfLiteral.toRdf(item, { dataFactory }),
      );
    } else if ($isReadonlyNumberArray(parameters.note)) {
      note = parameters.note.map((item) =>
        rdfLiteral.toRdf(item, { dataFactory }),
      );
    } else if ($isReadonlyStringArray(parameters.note)) {
      note = parameters.note.map((item) => dataFactory.literal(item));
    } else {
      note = parameters.note satisfies never;
    }

    let prefLabel: readonly rdfjs.Literal[];
    if (typeof parameters.prefLabel === "undefined") {
      prefLabel = [];
    } else if ($isReadonlyObjectArray(parameters.prefLabel)) {
      prefLabel = parameters.prefLabel;
    } else if ($isReadonlyBooleanArray(parameters.prefLabel)) {
      prefLabel = parameters.prefLabel.map((item) =>
        rdfLiteral.toRdf(item, { dataFactory }),
      );
    } else if ($isReadonlyNumberArray(parameters.prefLabel)) {
      prefLabel = parameters.prefLabel.map((item) =>
        rdfLiteral.toRdf(item, { dataFactory }),
      );
    } else if ($isReadonlyStringArray(parameters.prefLabel)) {
      prefLabel = parameters.prefLabel.map((item) => dataFactory.literal(item));
    } else {
      prefLabel = parameters.prefLabel satisfies never;
    }

    let prefLabelXl: readonly Label[];
    if (typeof parameters.prefLabelXl === "undefined") {
      prefLabelXl = [];
    } else if (typeof parameters.prefLabelXl === "object") {
      prefLabelXl = parameters.prefLabelXl;
    } else {
      prefLabelXl = parameters.prefLabelXl satisfies never;
    }

    let scopeNote: readonly rdfjs.Literal[];
    if (typeof parameters.scopeNote === "undefined") {
      scopeNote = [];
    } else if ($isReadonlyObjectArray(parameters.scopeNote)) {
      scopeNote = parameters.scopeNote;
    } else if ($isReadonlyBooleanArray(parameters.scopeNote)) {
      scopeNote = parameters.scopeNote.map((item) =>
        rdfLiteral.toRdf(item, { dataFactory }),
      );
    } else if ($isReadonlyNumberArray(parameters.scopeNote)) {
      scopeNote = parameters.scopeNote.map((item) =>
        rdfLiteral.toRdf(item, { dataFactory }),
      );
    } else if ($isReadonlyStringArray(parameters.scopeNote)) {
      scopeNote = parameters.scopeNote.map((item) => dataFactory.literal(item));
    } else {
      scopeNote = parameters.scopeNote satisfies never;
    }

    return {
      $identifier,
      altLabel,
      altLabelXl,
      changeNote,
      definition,
      editorialNote,
      example,
      hiddenLabel,
      hiddenLabelXl,
      historyNote,
      modified,
      notation,
      note,
      prefLabel,
      prefLabelXl,
      scopeNote,
    };
  }

  export type $Identifier = rdfjs.NamedNode;

  export namespace $Identifier {
    export function fromString(
      identifier: string,
    ): purify.Either<Error, rdfjs.NamedNode> {
      return purify.Either.encase(() =>
        rdfjsResource.Resource.Identifier.fromString({
          dataFactory,
          identifier,
        }),
      ).chain((identifier) =>
        identifier.termType === "NamedNode"
          ? purify.Either.of(identifier)
          : purify.Left(new Error("expected identifier to be NamedNode")),
      ) as purify.Either<Error, rdfjs.NamedNode>;
    }

    export const // biome-ignore lint/suspicious/noShadowRestrictedNames:
      toString = rdfjsResource.Resource.Identifier.toString;
  }

  export const $properties = {
    altLabel: {
      identifier: dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#altLabel",
      ),
    },
    altLabelXl: {
      identifier: dataFactory.namedNode(
        "http://www.w3.org/2008/05/skos-xl#altLabel",
      ),
    },
    changeNote: {
      identifier: dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#changeNote",
      ),
    },
    definition: {
      identifier: dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#definition",
      ),
    },
    editorialNote: {
      identifier: dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#editorialNote",
      ),
    },
    example: {
      identifier: dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#example",
      ),
    },
    hiddenLabel: {
      identifier: dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#hiddenLabel",
      ),
    },
    hiddenLabelXl: {
      identifier: dataFactory.namedNode(
        "http://www.w3.org/2008/05/skos-xl#hiddenLabel",
      ),
    },
    historyNote: {
      identifier: dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#historyNote",
      ),
    },
    modified: {
      identifier: dataFactory.namedNode("http://purl.org/dc/terms/modified"),
    },
    notation: {
      identifier: dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#notation",
      ),
    },
    note: {
      identifier: dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#note",
      ),
    },
    prefLabel: {
      identifier: dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#prefLabel",
      ),
    },
    prefLabelXl: {
      identifier: dataFactory.namedNode(
        "http://www.w3.org/2008/05/skos-xl#prefLabel",
      ),
    },
    scopeNote: {
      identifier: dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#scopeNote",
      ),
    },
  };

  export function $propertiesFromRdf({
    ignoreRdfType: $ignoreRdfType,
    objectSet: $objectSet,
    preferredLanguages: $preferredLanguages,
    resource: $resource,
    // @ts-ignore
    ...$context
  }: {
    [_index: string]: any;
    ignoreRdfType: boolean;
    objectSet: $ObjectSet;
    preferredLanguages?: readonly string[];
    resource: rdfjsResource.Resource;
  }): purify.Either<
    Error,
    {
      $identifier: rdfjs.NamedNode;
      altLabel: readonly rdfjs.Literal[];
      altLabelXl: readonly Label[];
      changeNote: readonly rdfjs.Literal[];
      definition: readonly rdfjs.Literal[];
      editorialNote: readonly rdfjs.Literal[];
      example: readonly rdfjs.Literal[];
      hiddenLabel: readonly rdfjs.Literal[];
      hiddenLabelXl: readonly Label[];
      historyNote: readonly rdfjs.Literal[];
      modified: purify.Maybe<Date>;
      notation: readonly rdfjs.Literal[];
      note: readonly rdfjs.Literal[];
      prefLabel: readonly rdfjs.Literal[];
      prefLabelXl: readonly Label[];
      scopeNote: readonly rdfjs.Literal[];
    }
  > {
    if ($resource.identifier.termType !== "NamedNode") {
      return purify.Left(
        new rdfjsResource.Resource.MistypedTermValueError({
          actualValue: $resource.identifier,
          expectedValueType: "(rdfjs.NamedNode)",
          focusResource: $resource,
          predicate: $RdfVocabularies.rdf.subject,
        }),
      );
    }

    const $identifier: KosResourceStatic.$Identifier = $resource.identifier;
    const _altLabelEither: purify.Either<Error, readonly rdfjs.Literal[]> =
      purify.Either.of<
        Error,
        rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
      >($resource.values($properties.altLabel["identifier"], { unique: true }))
        .chain((values) => {
          if (!$preferredLanguages || $preferredLanguages.length === 0) {
            return purify.Either.of<
              Error,
              rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
            >(values);
          }

          const literalValuesEither = values.chainMap((value) =>
            value.toLiteral(),
          );
          if (literalValuesEither.isLeft()) {
            return literalValuesEither;
          }
          const literalValues = literalValuesEither.unsafeCoerce();

          // Return all literals for the first preferredLanguage, then all literals for the second preferredLanguage, etc.
          // Within a preferredLanguage the literals may be in any order.
          let filteredLiteralValues:
            | rdfjsResource.Resource.Values<rdfjs.Literal>
            | undefined;
          for (const preferredLanguage of $preferredLanguages) {
            if (!filteredLiteralValues) {
              filteredLiteralValues = literalValues.filter(
                (value) => value.language === preferredLanguage,
              );
            } else {
              filteredLiteralValues = filteredLiteralValues.concat(
                ...literalValues
                  .filter((value) => value.language === preferredLanguage)
                  .toArray(),
              );
            }
          }

          return purify.Either.of<
            Error,
            rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
          >(
            filteredLiteralValues!.map(
              (literalValue) =>
                new rdfjsResource.Resource.TermValue({
                  focusResource: $resource,
                  predicate:
                    KosResourceStatic.$properties.altLabel["identifier"],
                  term: literalValue,
                }),
            ),
          );
        })
        .chain((values) => values.chainMap((value) => value.toLiteral()))
        .map((values) => values.toArray())
        .map((valuesArray) =>
          rdfjsResource.Resource.Values.fromValue({
            focusResource: $resource,
            predicate: KosResourceStatic.$properties.altLabel["identifier"],
            value: valuesArray,
          }),
        )
        .chain((values) => values.head());
    if (_altLabelEither.isLeft()) {
      return _altLabelEither;
    }

    const altLabel = _altLabelEither.unsafeCoerce();
    const _altLabelXlEither: purify.Either<Error, readonly Label[]> =
      purify.Either.of<
        Error,
        rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
      >(
        $resource.values($properties.altLabelXl["identifier"], {
          unique: true,
        }),
      )
        .chain((values) =>
          values.chainMap((value) =>
            value.toResource().chain((resource) =>
              Label.$fromRdf(resource, {
                ...$context,
                ignoreRdfType: true,
                objectSet: $objectSet,
                preferredLanguages: $preferredLanguages,
              }),
            ),
          ),
        )
        .map((values) => values.toArray())
        .map((valuesArray) =>
          rdfjsResource.Resource.Values.fromValue({
            focusResource: $resource,
            predicate: KosResourceStatic.$properties.altLabelXl["identifier"],
            value: valuesArray,
          }),
        )
        .chain((values) => values.head());
    if (_altLabelXlEither.isLeft()) {
      return _altLabelXlEither;
    }

    const altLabelXl = _altLabelXlEither.unsafeCoerce();
    const _changeNoteEither: purify.Either<Error, readonly rdfjs.Literal[]> =
      purify.Either.of<
        Error,
        rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
      >(
        $resource.values($properties.changeNote["identifier"], {
          unique: true,
        }),
      )
        .chain((values) => {
          if (!$preferredLanguages || $preferredLanguages.length === 0) {
            return purify.Either.of<
              Error,
              rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
            >(values);
          }

          const literalValuesEither = values.chainMap((value) =>
            value.toLiteral(),
          );
          if (literalValuesEither.isLeft()) {
            return literalValuesEither;
          }
          const literalValues = literalValuesEither.unsafeCoerce();

          // Return all literals for the first preferredLanguage, then all literals for the second preferredLanguage, etc.
          // Within a preferredLanguage the literals may be in any order.
          let filteredLiteralValues:
            | rdfjsResource.Resource.Values<rdfjs.Literal>
            | undefined;
          for (const preferredLanguage of $preferredLanguages) {
            if (!filteredLiteralValues) {
              filteredLiteralValues = literalValues.filter(
                (value) => value.language === preferredLanguage,
              );
            } else {
              filteredLiteralValues = filteredLiteralValues.concat(
                ...literalValues
                  .filter((value) => value.language === preferredLanguage)
                  .toArray(),
              );
            }
          }

          return purify.Either.of<
            Error,
            rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
          >(
            filteredLiteralValues!.map(
              (literalValue) =>
                new rdfjsResource.Resource.TermValue({
                  focusResource: $resource,
                  predicate:
                    KosResourceStatic.$properties.changeNote["identifier"],
                  term: literalValue,
                }),
            ),
          );
        })
        .chain((values) => values.chainMap((value) => value.toLiteral()))
        .map((values) => values.toArray())
        .map((valuesArray) =>
          rdfjsResource.Resource.Values.fromValue({
            focusResource: $resource,
            predicate: KosResourceStatic.$properties.changeNote["identifier"],
            value: valuesArray,
          }),
        )
        .chain((values) => values.head());
    if (_changeNoteEither.isLeft()) {
      return _changeNoteEither;
    }

    const changeNote = _changeNoteEither.unsafeCoerce();
    const _definitionEither: purify.Either<Error, readonly rdfjs.Literal[]> =
      purify.Either.of<
        Error,
        rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
      >(
        $resource.values($properties.definition["identifier"], {
          unique: true,
        }),
      )
        .chain((values) => {
          if (!$preferredLanguages || $preferredLanguages.length === 0) {
            return purify.Either.of<
              Error,
              rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
            >(values);
          }

          const literalValuesEither = values.chainMap((value) =>
            value.toLiteral(),
          );
          if (literalValuesEither.isLeft()) {
            return literalValuesEither;
          }
          const literalValues = literalValuesEither.unsafeCoerce();

          // Return all literals for the first preferredLanguage, then all literals for the second preferredLanguage, etc.
          // Within a preferredLanguage the literals may be in any order.
          let filteredLiteralValues:
            | rdfjsResource.Resource.Values<rdfjs.Literal>
            | undefined;
          for (const preferredLanguage of $preferredLanguages) {
            if (!filteredLiteralValues) {
              filteredLiteralValues = literalValues.filter(
                (value) => value.language === preferredLanguage,
              );
            } else {
              filteredLiteralValues = filteredLiteralValues.concat(
                ...literalValues
                  .filter((value) => value.language === preferredLanguage)
                  .toArray(),
              );
            }
          }

          return purify.Either.of<
            Error,
            rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
          >(
            filteredLiteralValues!.map(
              (literalValue) =>
                new rdfjsResource.Resource.TermValue({
                  focusResource: $resource,
                  predicate:
                    KosResourceStatic.$properties.definition["identifier"],
                  term: literalValue,
                }),
            ),
          );
        })
        .chain((values) => values.chainMap((value) => value.toLiteral()))
        .map((values) => values.toArray())
        .map((valuesArray) =>
          rdfjsResource.Resource.Values.fromValue({
            focusResource: $resource,
            predicate: KosResourceStatic.$properties.definition["identifier"],
            value: valuesArray,
          }),
        )
        .chain((values) => values.head());
    if (_definitionEither.isLeft()) {
      return _definitionEither;
    }

    const definition = _definitionEither.unsafeCoerce();
    const _editorialNoteEither: purify.Either<Error, readonly rdfjs.Literal[]> =
      purify.Either.of<
        Error,
        rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
      >(
        $resource.values($properties.editorialNote["identifier"], {
          unique: true,
        }),
      )
        .chain((values) => {
          if (!$preferredLanguages || $preferredLanguages.length === 0) {
            return purify.Either.of<
              Error,
              rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
            >(values);
          }

          const literalValuesEither = values.chainMap((value) =>
            value.toLiteral(),
          );
          if (literalValuesEither.isLeft()) {
            return literalValuesEither;
          }
          const literalValues = literalValuesEither.unsafeCoerce();

          // Return all literals for the first preferredLanguage, then all literals for the second preferredLanguage, etc.
          // Within a preferredLanguage the literals may be in any order.
          let filteredLiteralValues:
            | rdfjsResource.Resource.Values<rdfjs.Literal>
            | undefined;
          for (const preferredLanguage of $preferredLanguages) {
            if (!filteredLiteralValues) {
              filteredLiteralValues = literalValues.filter(
                (value) => value.language === preferredLanguage,
              );
            } else {
              filteredLiteralValues = filteredLiteralValues.concat(
                ...literalValues
                  .filter((value) => value.language === preferredLanguage)
                  .toArray(),
              );
            }
          }

          return purify.Either.of<
            Error,
            rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
          >(
            filteredLiteralValues!.map(
              (literalValue) =>
                new rdfjsResource.Resource.TermValue({
                  focusResource: $resource,
                  predicate:
                    KosResourceStatic.$properties.editorialNote["identifier"],
                  term: literalValue,
                }),
            ),
          );
        })
        .chain((values) => values.chainMap((value) => value.toLiteral()))
        .map((values) => values.toArray())
        .map((valuesArray) =>
          rdfjsResource.Resource.Values.fromValue({
            focusResource: $resource,
            predicate:
              KosResourceStatic.$properties.editorialNote["identifier"],
            value: valuesArray,
          }),
        )
        .chain((values) => values.head());
    if (_editorialNoteEither.isLeft()) {
      return _editorialNoteEither;
    }

    const editorialNote = _editorialNoteEither.unsafeCoerce();
    const _exampleEither: purify.Either<Error, readonly rdfjs.Literal[]> =
      purify.Either.of<
        Error,
        rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
      >($resource.values($properties.example["identifier"], { unique: true }))
        .chain((values) => {
          if (!$preferredLanguages || $preferredLanguages.length === 0) {
            return purify.Either.of<
              Error,
              rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
            >(values);
          }

          const literalValuesEither = values.chainMap((value) =>
            value.toLiteral(),
          );
          if (literalValuesEither.isLeft()) {
            return literalValuesEither;
          }
          const literalValues = literalValuesEither.unsafeCoerce();

          // Return all literals for the first preferredLanguage, then all literals for the second preferredLanguage, etc.
          // Within a preferredLanguage the literals may be in any order.
          let filteredLiteralValues:
            | rdfjsResource.Resource.Values<rdfjs.Literal>
            | undefined;
          for (const preferredLanguage of $preferredLanguages) {
            if (!filteredLiteralValues) {
              filteredLiteralValues = literalValues.filter(
                (value) => value.language === preferredLanguage,
              );
            } else {
              filteredLiteralValues = filteredLiteralValues.concat(
                ...literalValues
                  .filter((value) => value.language === preferredLanguage)
                  .toArray(),
              );
            }
          }

          return purify.Either.of<
            Error,
            rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
          >(
            filteredLiteralValues!.map(
              (literalValue) =>
                new rdfjsResource.Resource.TermValue({
                  focusResource: $resource,
                  predicate:
                    KosResourceStatic.$properties.example["identifier"],
                  term: literalValue,
                }),
            ),
          );
        })
        .chain((values) => values.chainMap((value) => value.toLiteral()))
        .map((values) => values.toArray())
        .map((valuesArray) =>
          rdfjsResource.Resource.Values.fromValue({
            focusResource: $resource,
            predicate: KosResourceStatic.$properties.example["identifier"],
            value: valuesArray,
          }),
        )
        .chain((values) => values.head());
    if (_exampleEither.isLeft()) {
      return _exampleEither;
    }

    const example = _exampleEither.unsafeCoerce();
    const _hiddenLabelEither: purify.Either<Error, readonly rdfjs.Literal[]> =
      purify.Either.of<
        Error,
        rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
      >(
        $resource.values($properties.hiddenLabel["identifier"], {
          unique: true,
        }),
      )
        .chain((values) => {
          if (!$preferredLanguages || $preferredLanguages.length === 0) {
            return purify.Either.of<
              Error,
              rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
            >(values);
          }

          const literalValuesEither = values.chainMap((value) =>
            value.toLiteral(),
          );
          if (literalValuesEither.isLeft()) {
            return literalValuesEither;
          }
          const literalValues = literalValuesEither.unsafeCoerce();

          // Return all literals for the first preferredLanguage, then all literals for the second preferredLanguage, etc.
          // Within a preferredLanguage the literals may be in any order.
          let filteredLiteralValues:
            | rdfjsResource.Resource.Values<rdfjs.Literal>
            | undefined;
          for (const preferredLanguage of $preferredLanguages) {
            if (!filteredLiteralValues) {
              filteredLiteralValues = literalValues.filter(
                (value) => value.language === preferredLanguage,
              );
            } else {
              filteredLiteralValues = filteredLiteralValues.concat(
                ...literalValues
                  .filter((value) => value.language === preferredLanguage)
                  .toArray(),
              );
            }
          }

          return purify.Either.of<
            Error,
            rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
          >(
            filteredLiteralValues!.map(
              (literalValue) =>
                new rdfjsResource.Resource.TermValue({
                  focusResource: $resource,
                  predicate:
                    KosResourceStatic.$properties.hiddenLabel["identifier"],
                  term: literalValue,
                }),
            ),
          );
        })
        .chain((values) => values.chainMap((value) => value.toLiteral()))
        .map((values) => values.toArray())
        .map((valuesArray) =>
          rdfjsResource.Resource.Values.fromValue({
            focusResource: $resource,
            predicate: KosResourceStatic.$properties.hiddenLabel["identifier"],
            value: valuesArray,
          }),
        )
        .chain((values) => values.head());
    if (_hiddenLabelEither.isLeft()) {
      return _hiddenLabelEither;
    }

    const hiddenLabel = _hiddenLabelEither.unsafeCoerce();
    const _hiddenLabelXlEither: purify.Either<Error, readonly Label[]> =
      purify.Either.of<
        Error,
        rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
      >(
        $resource.values($properties.hiddenLabelXl["identifier"], {
          unique: true,
        }),
      )
        .chain((values) =>
          values.chainMap((value) =>
            value.toResource().chain((resource) =>
              Label.$fromRdf(resource, {
                ...$context,
                ignoreRdfType: true,
                objectSet: $objectSet,
                preferredLanguages: $preferredLanguages,
              }),
            ),
          ),
        )
        .map((values) => values.toArray())
        .map((valuesArray) =>
          rdfjsResource.Resource.Values.fromValue({
            focusResource: $resource,
            predicate:
              KosResourceStatic.$properties.hiddenLabelXl["identifier"],
            value: valuesArray,
          }),
        )
        .chain((values) => values.head());
    if (_hiddenLabelXlEither.isLeft()) {
      return _hiddenLabelXlEither;
    }

    const hiddenLabelXl = _hiddenLabelXlEither.unsafeCoerce();
    const _historyNoteEither: purify.Either<Error, readonly rdfjs.Literal[]> =
      purify.Either.of<
        Error,
        rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
      >(
        $resource.values($properties.historyNote["identifier"], {
          unique: true,
        }),
      )
        .chain((values) => {
          if (!$preferredLanguages || $preferredLanguages.length === 0) {
            return purify.Either.of<
              Error,
              rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
            >(values);
          }

          const literalValuesEither = values.chainMap((value) =>
            value.toLiteral(),
          );
          if (literalValuesEither.isLeft()) {
            return literalValuesEither;
          }
          const literalValues = literalValuesEither.unsafeCoerce();

          // Return all literals for the first preferredLanguage, then all literals for the second preferredLanguage, etc.
          // Within a preferredLanguage the literals may be in any order.
          let filteredLiteralValues:
            | rdfjsResource.Resource.Values<rdfjs.Literal>
            | undefined;
          for (const preferredLanguage of $preferredLanguages) {
            if (!filteredLiteralValues) {
              filteredLiteralValues = literalValues.filter(
                (value) => value.language === preferredLanguage,
              );
            } else {
              filteredLiteralValues = filteredLiteralValues.concat(
                ...literalValues
                  .filter((value) => value.language === preferredLanguage)
                  .toArray(),
              );
            }
          }

          return purify.Either.of<
            Error,
            rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
          >(
            filteredLiteralValues!.map(
              (literalValue) =>
                new rdfjsResource.Resource.TermValue({
                  focusResource: $resource,
                  predicate:
                    KosResourceStatic.$properties.historyNote["identifier"],
                  term: literalValue,
                }),
            ),
          );
        })
        .chain((values) => values.chainMap((value) => value.toLiteral()))
        .map((values) => values.toArray())
        .map((valuesArray) =>
          rdfjsResource.Resource.Values.fromValue({
            focusResource: $resource,
            predicate: KosResourceStatic.$properties.historyNote["identifier"],
            value: valuesArray,
          }),
        )
        .chain((values) => values.head());
    if (_historyNoteEither.isLeft()) {
      return _historyNoteEither;
    }

    const historyNote = _historyNoteEither.unsafeCoerce();
    const _modifiedEither: purify.Either<
      Error,
      purify.Maybe<Date>
    > = purify.Either.of<
      Error,
      rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
    >($resource.values($properties.modified["identifier"], { unique: true }))
      .chain((values) => values.chainMap((value) => value.toDate()))
      .map((values) =>
        values.length > 0
          ? values.map((value) => purify.Maybe.of(value))
          : rdfjsResource.Resource.Values.fromValue<purify.Maybe<Date>>({
              focusResource: $resource,
              predicate: KosResourceStatic.$properties.modified["identifier"],
              value: purify.Maybe.empty(),
            }),
      )
      .chain((values) => values.head());
    if (_modifiedEither.isLeft()) {
      return _modifiedEither;
    }

    const modified = _modifiedEither.unsafeCoerce();
    const _notationEither: purify.Either<Error, readonly rdfjs.Literal[]> =
      purify.Either.of<
        Error,
        rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
      >($resource.values($properties.notation["identifier"], { unique: true }))
        .chain((values) => {
          if (!$preferredLanguages || $preferredLanguages.length === 0) {
            return purify.Either.of<
              Error,
              rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
            >(values);
          }

          const literalValuesEither = values.chainMap((value) =>
            value.toLiteral(),
          );
          if (literalValuesEither.isLeft()) {
            return literalValuesEither;
          }
          const literalValues = literalValuesEither.unsafeCoerce();

          // Return all literals for the first preferredLanguage, then all literals for the second preferredLanguage, etc.
          // Within a preferredLanguage the literals may be in any order.
          let filteredLiteralValues:
            | rdfjsResource.Resource.Values<rdfjs.Literal>
            | undefined;
          for (const preferredLanguage of $preferredLanguages) {
            if (!filteredLiteralValues) {
              filteredLiteralValues = literalValues.filter(
                (value) => value.language === preferredLanguage,
              );
            } else {
              filteredLiteralValues = filteredLiteralValues.concat(
                ...literalValues
                  .filter((value) => value.language === preferredLanguage)
                  .toArray(),
              );
            }
          }

          return purify.Either.of<
            Error,
            rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
          >(
            filteredLiteralValues!.map(
              (literalValue) =>
                new rdfjsResource.Resource.TermValue({
                  focusResource: $resource,
                  predicate:
                    KosResourceStatic.$properties.notation["identifier"],
                  term: literalValue,
                }),
            ),
          );
        })
        .chain((values) => values.chainMap((value) => value.toLiteral()))
        .map((values) => values.toArray())
        .map((valuesArray) =>
          rdfjsResource.Resource.Values.fromValue({
            focusResource: $resource,
            predicate: KosResourceStatic.$properties.notation["identifier"],
            value: valuesArray,
          }),
        )
        .chain((values) => values.head());
    if (_notationEither.isLeft()) {
      return _notationEither;
    }

    const notation = _notationEither.unsafeCoerce();
    const _noteEither: purify.Either<Error, readonly rdfjs.Literal[]> =
      purify.Either.of<
        Error,
        rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
      >($resource.values($properties.note["identifier"], { unique: true }))
        .chain((values) => {
          if (!$preferredLanguages || $preferredLanguages.length === 0) {
            return purify.Either.of<
              Error,
              rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
            >(values);
          }

          const literalValuesEither = values.chainMap((value) =>
            value.toLiteral(),
          );
          if (literalValuesEither.isLeft()) {
            return literalValuesEither;
          }
          const literalValues = literalValuesEither.unsafeCoerce();

          // Return all literals for the first preferredLanguage, then all literals for the second preferredLanguage, etc.
          // Within a preferredLanguage the literals may be in any order.
          let filteredLiteralValues:
            | rdfjsResource.Resource.Values<rdfjs.Literal>
            | undefined;
          for (const preferredLanguage of $preferredLanguages) {
            if (!filteredLiteralValues) {
              filteredLiteralValues = literalValues.filter(
                (value) => value.language === preferredLanguage,
              );
            } else {
              filteredLiteralValues = filteredLiteralValues.concat(
                ...literalValues
                  .filter((value) => value.language === preferredLanguage)
                  .toArray(),
              );
            }
          }

          return purify.Either.of<
            Error,
            rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
          >(
            filteredLiteralValues!.map(
              (literalValue) =>
                new rdfjsResource.Resource.TermValue({
                  focusResource: $resource,
                  predicate: KosResourceStatic.$properties.note["identifier"],
                  term: literalValue,
                }),
            ),
          );
        })
        .chain((values) => values.chainMap((value) => value.toLiteral()))
        .map((values) => values.toArray())
        .map((valuesArray) =>
          rdfjsResource.Resource.Values.fromValue({
            focusResource: $resource,
            predicate: KosResourceStatic.$properties.note["identifier"],
            value: valuesArray,
          }),
        )
        .chain((values) => values.head());
    if (_noteEither.isLeft()) {
      return _noteEither;
    }

    const note = _noteEither.unsafeCoerce();
    const _prefLabelEither: purify.Either<Error, readonly rdfjs.Literal[]> =
      purify.Either.of<
        Error,
        rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
      >($resource.values($properties.prefLabel["identifier"], { unique: true }))
        .chain((values) => {
          if (!$preferredLanguages || $preferredLanguages.length === 0) {
            return purify.Either.of<
              Error,
              rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
            >(values);
          }

          const literalValuesEither = values.chainMap((value) =>
            value.toLiteral(),
          );
          if (literalValuesEither.isLeft()) {
            return literalValuesEither;
          }
          const literalValues = literalValuesEither.unsafeCoerce();

          // Return all literals for the first preferredLanguage, then all literals for the second preferredLanguage, etc.
          // Within a preferredLanguage the literals may be in any order.
          let filteredLiteralValues:
            | rdfjsResource.Resource.Values<rdfjs.Literal>
            | undefined;
          for (const preferredLanguage of $preferredLanguages) {
            if (!filteredLiteralValues) {
              filteredLiteralValues = literalValues.filter(
                (value) => value.language === preferredLanguage,
              );
            } else {
              filteredLiteralValues = filteredLiteralValues.concat(
                ...literalValues
                  .filter((value) => value.language === preferredLanguage)
                  .toArray(),
              );
            }
          }

          return purify.Either.of<
            Error,
            rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
          >(
            filteredLiteralValues!.map(
              (literalValue) =>
                new rdfjsResource.Resource.TermValue({
                  focusResource: $resource,
                  predicate:
                    KosResourceStatic.$properties.prefLabel["identifier"],
                  term: literalValue,
                }),
            ),
          );
        })
        .chain((values) => values.chainMap((value) => value.toLiteral()))
        .map((values) => values.toArray())
        .map((valuesArray) =>
          rdfjsResource.Resource.Values.fromValue({
            focusResource: $resource,
            predicate: KosResourceStatic.$properties.prefLabel["identifier"],
            value: valuesArray,
          }),
        )
        .chain((values) => values.head());
    if (_prefLabelEither.isLeft()) {
      return _prefLabelEither;
    }

    const prefLabel = _prefLabelEither.unsafeCoerce();
    const _prefLabelXlEither: purify.Either<Error, readonly Label[]> =
      purify.Either.of<
        Error,
        rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
      >(
        $resource.values($properties.prefLabelXl["identifier"], {
          unique: true,
        }),
      )
        .chain((values) =>
          values.chainMap((value) =>
            value.toResource().chain((resource) =>
              Label.$fromRdf(resource, {
                ...$context,
                ignoreRdfType: true,
                objectSet: $objectSet,
                preferredLanguages: $preferredLanguages,
              }),
            ),
          ),
        )
        .map((values) => values.toArray())
        .map((valuesArray) =>
          rdfjsResource.Resource.Values.fromValue({
            focusResource: $resource,
            predicate: KosResourceStatic.$properties.prefLabelXl["identifier"],
            value: valuesArray,
          }),
        )
        .chain((values) => values.head());
    if (_prefLabelXlEither.isLeft()) {
      return _prefLabelXlEither;
    }

    const prefLabelXl = _prefLabelXlEither.unsafeCoerce();
    const _scopeNoteEither: purify.Either<Error, readonly rdfjs.Literal[]> =
      purify.Either.of<
        Error,
        rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
      >($resource.values($properties.scopeNote["identifier"], { unique: true }))
        .chain((values) => {
          if (!$preferredLanguages || $preferredLanguages.length === 0) {
            return purify.Either.of<
              Error,
              rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
            >(values);
          }

          const literalValuesEither = values.chainMap((value) =>
            value.toLiteral(),
          );
          if (literalValuesEither.isLeft()) {
            return literalValuesEither;
          }
          const literalValues = literalValuesEither.unsafeCoerce();

          // Return all literals for the first preferredLanguage, then all literals for the second preferredLanguage, etc.
          // Within a preferredLanguage the literals may be in any order.
          let filteredLiteralValues:
            | rdfjsResource.Resource.Values<rdfjs.Literal>
            | undefined;
          for (const preferredLanguage of $preferredLanguages) {
            if (!filteredLiteralValues) {
              filteredLiteralValues = literalValues.filter(
                (value) => value.language === preferredLanguage,
              );
            } else {
              filteredLiteralValues = filteredLiteralValues.concat(
                ...literalValues
                  .filter((value) => value.language === preferredLanguage)
                  .toArray(),
              );
            }
          }

          return purify.Either.of<
            Error,
            rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
          >(
            filteredLiteralValues!.map(
              (literalValue) =>
                new rdfjsResource.Resource.TermValue({
                  focusResource: $resource,
                  predicate:
                    KosResourceStatic.$properties.scopeNote["identifier"],
                  term: literalValue,
                }),
            ),
          );
        })
        .chain((values) => values.chainMap((value) => value.toLiteral()))
        .map((values) => values.toArray())
        .map((valuesArray) =>
          rdfjsResource.Resource.Values.fromValue({
            focusResource: $resource,
            predicate: KosResourceStatic.$properties.scopeNote["identifier"],
            value: valuesArray,
          }),
        )
        .chain((values) => values.head());
    if (_scopeNoteEither.isLeft()) {
      return _scopeNoteEither;
    }

    const scopeNote = _scopeNoteEither.unsafeCoerce();
    return purify.Either.of({
      $identifier,
      altLabel,
      altLabelXl,
      changeNote,
      definition,
      editorialNote,
      example,
      hiddenLabel,
      hiddenLabelXl,
      historyNote,
      modified,
      notation,
      note,
      prefLabel,
      prefLabelXl,
      scopeNote,
    });
  }

  export function $sparqlConstructQuery(
    parameters?: {
      ignoreRdfType?: boolean;
      prefixes?: { [prefix: string]: string };
      preferredLanguages?: readonly string[];
      subject?: sparqljs.Triple["subject"];
    } & Omit<sparqljs.ConstructQuery, "prefixes" | "queryType" | "type">,
  ): sparqljs.ConstructQuery {
    const { ignoreRdfType, preferredLanguages, subject, ...queryParameters } =
      parameters ?? {};

    return {
      ...queryParameters,
      prefixes: parameters?.prefixes ?? {},
      queryType: "CONSTRUCT",
      template: (queryParameters.template ?? []).concat(
        KosResourceStatic.$sparqlConstructTemplateTriples({
          ignoreRdfType,
          subject,
        }),
      ),
      type: "query",
      where: (queryParameters.where ?? []).concat(
        KosResourceStatic.$sparqlWherePatterns({
          ignoreRdfType,
          preferredLanguages,
          subject,
        }),
      ),
    };
  }

  export function $sparqlConstructQueryString(
    parameters?: {
      ignoreRdfType?: boolean;
      preferredLanguages?: readonly string[];
      subject?: sparqljs.Triple["subject"];
      variablePrefix?: string;
    } & Omit<sparqljs.ConstructQuery, "prefixes" | "queryType" | "type"> &
      sparqljs.GeneratorOptions,
  ): string {
    return new sparqljs.Generator(parameters).stringify(
      KosResourceStatic.$sparqlConstructQuery(parameters),
    );
  }

  export function $sparqlConstructTemplateTriples(parameters?: {
    ignoreRdfType?: boolean;
    subject?: sparqljs.Triple["subject"];
    variablePrefix?: string;
  }): readonly sparqljs.Triple[] {
    const subject = parameters?.subject ?? dataFactory.variable!("kosResource");
    const triples: sparqljs.Triple[] = [];
    const variablePrefix =
      parameters?.variablePrefix ??
      (subject.termType === "Variable" ? subject.value : "kosResource");
    triples.push({
      object: dataFactory.variable!(`${variablePrefix}AltLabel`),
      predicate: KosResourceStatic.$properties.altLabel["identifier"],
      subject,
    });
    triples.push({
      object: dataFactory.variable!(`${variablePrefix}AltLabelXl`),
      predicate: KosResourceStatic.$properties.altLabelXl["identifier"],
      subject,
    });
    triples.push(
      ...Label.$sparqlConstructTemplateTriples({
        ignoreRdfType: true,
        subject: dataFactory.variable!(`${variablePrefix}AltLabelXl`),
        variablePrefix: `${variablePrefix}AltLabelXl`,
      }),
    );
    triples.push({
      object: dataFactory.variable!(`${variablePrefix}ChangeNote`),
      predicate: KosResourceStatic.$properties.changeNote["identifier"],
      subject,
    });
    triples.push({
      object: dataFactory.variable!(`${variablePrefix}Definition`),
      predicate: KosResourceStatic.$properties.definition["identifier"],
      subject,
    });
    triples.push({
      object: dataFactory.variable!(`${variablePrefix}EditorialNote`),
      predicate: KosResourceStatic.$properties.editorialNote["identifier"],
      subject,
    });
    triples.push({
      object: dataFactory.variable!(`${variablePrefix}Example`),
      predicate: KosResourceStatic.$properties.example["identifier"],
      subject,
    });
    triples.push({
      object: dataFactory.variable!(`${variablePrefix}HiddenLabel`),
      predicate: KosResourceStatic.$properties.hiddenLabel["identifier"],
      subject,
    });
    triples.push({
      object: dataFactory.variable!(`${variablePrefix}HiddenLabelXl`),
      predicate: KosResourceStatic.$properties.hiddenLabelXl["identifier"],
      subject,
    });
    triples.push(
      ...Label.$sparqlConstructTemplateTriples({
        ignoreRdfType: true,
        subject: dataFactory.variable!(`${variablePrefix}HiddenLabelXl`),
        variablePrefix: `${variablePrefix}HiddenLabelXl`,
      }),
    );
    triples.push({
      object: dataFactory.variable!(`${variablePrefix}HistoryNote`),
      predicate: KosResourceStatic.$properties.historyNote["identifier"],
      subject,
    });
    triples.push({
      object: dataFactory.variable!(`${variablePrefix}Modified`),
      predicate: KosResourceStatic.$properties.modified["identifier"],
      subject,
    });
    triples.push({
      object: dataFactory.variable!(`${variablePrefix}Notation`),
      predicate: KosResourceStatic.$properties.notation["identifier"],
      subject,
    });
    triples.push({
      object: dataFactory.variable!(`${variablePrefix}Note`),
      predicate: KosResourceStatic.$properties.note["identifier"],
      subject,
    });
    triples.push({
      object: dataFactory.variable!(`${variablePrefix}PrefLabel`),
      predicate: KosResourceStatic.$properties.prefLabel["identifier"],
      subject,
    });
    triples.push({
      object: dataFactory.variable!(`${variablePrefix}PrefLabelXl`),
      predicate: KosResourceStatic.$properties.prefLabelXl["identifier"],
      subject,
    });
    triples.push(
      ...Label.$sparqlConstructTemplateTriples({
        ignoreRdfType: true,
        subject: dataFactory.variable!(`${variablePrefix}PrefLabelXl`),
        variablePrefix: `${variablePrefix}PrefLabelXl`,
      }),
    );
    triples.push({
      object: dataFactory.variable!(`${variablePrefix}ScopeNote`),
      predicate: KosResourceStatic.$properties.scopeNote["identifier"],
      subject,
    });
    return triples;
  }

  export function $sparqlWherePatterns(parameters?: {
    ignoreRdfType?: boolean;
    preferredLanguages?: readonly string[];
    subject?: sparqljs.Triple["subject"];
    variablePrefix?: string;
  }): readonly sparqljs.Pattern[] {
    const optionalPatterns: sparqljs.OptionalPattern[] = [];
    const requiredPatterns: sparqljs.Pattern[] = [];
    const subject = parameters?.subject ?? dataFactory.variable!("kosResource");
    const variablePrefix =
      parameters?.variablePrefix ??
      (subject.termType === "Variable" ? subject.value : "kosResource");
    const propertyPatterns: readonly sparqljs.Pattern[] = [
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable!(`${variablePrefix}AltLabel`),
                predicate: KosResourceStatic.$properties.altLabel["identifier"],
                subject,
              },
            ],
            type: "bgp",
          },
          ...[parameters?.preferredLanguages ?? []]
            .filter((languages) => languages.length > 0)
            .map((languages) =>
              languages.map((language) => ({
                type: "operation" as const,
                operator: "=",
                args: [
                  {
                    type: "operation" as const,
                    operator: "lang",
                    args: [dataFactory.variable!(`${variablePrefix}AltLabel`)],
                  },
                  dataFactory.literal(language),
                ],
              })),
            )
            .map((langEqualsExpressions) => ({
              type: "filter" as const,
              expression: langEqualsExpressions.reduce(
                (reducedExpression, langEqualsExpression) => {
                  if (reducedExpression === null) {
                    return langEqualsExpression;
                  }
                  return {
                    type: "operation" as const,
                    operator: "||",
                    args: [reducedExpression, langEqualsExpression],
                  };
                },
                null as sparqljs.Expression | null,
              ) as sparqljs.Expression,
            })),
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable!(`${variablePrefix}AltLabelXl`),
                predicate:
                  KosResourceStatic.$properties.altLabelXl["identifier"],
                subject,
              },
            ],
            type: "bgp",
          },
          ...Label.$sparqlWherePatterns({
            ignoreRdfType: true,
            preferredLanguages: parameters?.preferredLanguages,
            subject: dataFactory.variable!(`${variablePrefix}AltLabelXl`),
            variablePrefix: `${variablePrefix}AltLabelXl`,
          }),
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable!(`${variablePrefix}ChangeNote`),
                predicate:
                  KosResourceStatic.$properties.changeNote["identifier"],
                subject,
              },
            ],
            type: "bgp",
          },
          ...[parameters?.preferredLanguages ?? []]
            .filter((languages) => languages.length > 0)
            .map((languages) =>
              languages.map((language) => ({
                type: "operation" as const,
                operator: "=",
                args: [
                  {
                    type: "operation" as const,
                    operator: "lang",
                    args: [
                      dataFactory.variable!(`${variablePrefix}ChangeNote`),
                    ],
                  },
                  dataFactory.literal(language),
                ],
              })),
            )
            .map((langEqualsExpressions) => ({
              type: "filter" as const,
              expression: langEqualsExpressions.reduce(
                (reducedExpression, langEqualsExpression) => {
                  if (reducedExpression === null) {
                    return langEqualsExpression;
                  }
                  return {
                    type: "operation" as const,
                    operator: "||",
                    args: [reducedExpression, langEqualsExpression],
                  };
                },
                null as sparqljs.Expression | null,
              ) as sparqljs.Expression,
            })),
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable!(`${variablePrefix}Definition`),
                predicate:
                  KosResourceStatic.$properties.definition["identifier"],
                subject,
              },
            ],
            type: "bgp",
          },
          ...[parameters?.preferredLanguages ?? []]
            .filter((languages) => languages.length > 0)
            .map((languages) =>
              languages.map((language) => ({
                type: "operation" as const,
                operator: "=",
                args: [
                  {
                    type: "operation" as const,
                    operator: "lang",
                    args: [
                      dataFactory.variable!(`${variablePrefix}Definition`),
                    ],
                  },
                  dataFactory.literal(language),
                ],
              })),
            )
            .map((langEqualsExpressions) => ({
              type: "filter" as const,
              expression: langEqualsExpressions.reduce(
                (reducedExpression, langEqualsExpression) => {
                  if (reducedExpression === null) {
                    return langEqualsExpression;
                  }
                  return {
                    type: "operation" as const,
                    operator: "||",
                    args: [reducedExpression, langEqualsExpression],
                  };
                },
                null as sparqljs.Expression | null,
              ) as sparqljs.Expression,
            })),
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable!(`${variablePrefix}EditorialNote`),
                predicate:
                  KosResourceStatic.$properties.editorialNote["identifier"],
                subject,
              },
            ],
            type: "bgp",
          },
          ...[parameters?.preferredLanguages ?? []]
            .filter((languages) => languages.length > 0)
            .map((languages) =>
              languages.map((language) => ({
                type: "operation" as const,
                operator: "=",
                args: [
                  {
                    type: "operation" as const,
                    operator: "lang",
                    args: [
                      dataFactory.variable!(`${variablePrefix}EditorialNote`),
                    ],
                  },
                  dataFactory.literal(language),
                ],
              })),
            )
            .map((langEqualsExpressions) => ({
              type: "filter" as const,
              expression: langEqualsExpressions.reduce(
                (reducedExpression, langEqualsExpression) => {
                  if (reducedExpression === null) {
                    return langEqualsExpression;
                  }
                  return {
                    type: "operation" as const,
                    operator: "||",
                    args: [reducedExpression, langEqualsExpression],
                  };
                },
                null as sparqljs.Expression | null,
              ) as sparqljs.Expression,
            })),
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable!(`${variablePrefix}Example`),
                predicate: KosResourceStatic.$properties.example["identifier"],
                subject,
              },
            ],
            type: "bgp",
          },
          ...[parameters?.preferredLanguages ?? []]
            .filter((languages) => languages.length > 0)
            .map((languages) =>
              languages.map((language) => ({
                type: "operation" as const,
                operator: "=",
                args: [
                  {
                    type: "operation" as const,
                    operator: "lang",
                    args: [dataFactory.variable!(`${variablePrefix}Example`)],
                  },
                  dataFactory.literal(language),
                ],
              })),
            )
            .map((langEqualsExpressions) => ({
              type: "filter" as const,
              expression: langEqualsExpressions.reduce(
                (reducedExpression, langEqualsExpression) => {
                  if (reducedExpression === null) {
                    return langEqualsExpression;
                  }
                  return {
                    type: "operation" as const,
                    operator: "||",
                    args: [reducedExpression, langEqualsExpression],
                  };
                },
                null as sparqljs.Expression | null,
              ) as sparqljs.Expression,
            })),
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable!(`${variablePrefix}HiddenLabel`),
                predicate:
                  KosResourceStatic.$properties.hiddenLabel["identifier"],
                subject,
              },
            ],
            type: "bgp",
          },
          ...[parameters?.preferredLanguages ?? []]
            .filter((languages) => languages.length > 0)
            .map((languages) =>
              languages.map((language) => ({
                type: "operation" as const,
                operator: "=",
                args: [
                  {
                    type: "operation" as const,
                    operator: "lang",
                    args: [
                      dataFactory.variable!(`${variablePrefix}HiddenLabel`),
                    ],
                  },
                  dataFactory.literal(language),
                ],
              })),
            )
            .map((langEqualsExpressions) => ({
              type: "filter" as const,
              expression: langEqualsExpressions.reduce(
                (reducedExpression, langEqualsExpression) => {
                  if (reducedExpression === null) {
                    return langEqualsExpression;
                  }
                  return {
                    type: "operation" as const,
                    operator: "||",
                    args: [reducedExpression, langEqualsExpression],
                  };
                },
                null as sparqljs.Expression | null,
              ) as sparqljs.Expression,
            })),
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable!(`${variablePrefix}HiddenLabelXl`),
                predicate:
                  KosResourceStatic.$properties.hiddenLabelXl["identifier"],
                subject,
              },
            ],
            type: "bgp",
          },
          ...Label.$sparqlWherePatterns({
            ignoreRdfType: true,
            preferredLanguages: parameters?.preferredLanguages,
            subject: dataFactory.variable!(`${variablePrefix}HiddenLabelXl`),
            variablePrefix: `${variablePrefix}HiddenLabelXl`,
          }),
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable!(`${variablePrefix}HistoryNote`),
                predicate:
                  KosResourceStatic.$properties.historyNote["identifier"],
                subject,
              },
            ],
            type: "bgp",
          },
          ...[parameters?.preferredLanguages ?? []]
            .filter((languages) => languages.length > 0)
            .map((languages) =>
              languages.map((language) => ({
                type: "operation" as const,
                operator: "=",
                args: [
                  {
                    type: "operation" as const,
                    operator: "lang",
                    args: [
                      dataFactory.variable!(`${variablePrefix}HistoryNote`),
                    ],
                  },
                  dataFactory.literal(language),
                ],
              })),
            )
            .map((langEqualsExpressions) => ({
              type: "filter" as const,
              expression: langEqualsExpressions.reduce(
                (reducedExpression, langEqualsExpression) => {
                  if (reducedExpression === null) {
                    return langEqualsExpression;
                  }
                  return {
                    type: "operation" as const,
                    operator: "||",
                    args: [reducedExpression, langEqualsExpression],
                  };
                },
                null as sparqljs.Expression | null,
              ) as sparqljs.Expression,
            })),
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable!(`${variablePrefix}Modified`),
                predicate: KosResourceStatic.$properties.modified["identifier"],
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
                object: dataFactory.variable!(`${variablePrefix}Notation`),
                predicate: KosResourceStatic.$properties.notation["identifier"],
                subject,
              },
            ],
            type: "bgp",
          },
          ...[parameters?.preferredLanguages ?? []]
            .filter((languages) => languages.length > 0)
            .map((languages) =>
              languages.map((language) => ({
                type: "operation" as const,
                operator: "=",
                args: [
                  {
                    type: "operation" as const,
                    operator: "lang",
                    args: [dataFactory.variable!(`${variablePrefix}Notation`)],
                  },
                  dataFactory.literal(language),
                ],
              })),
            )
            .map((langEqualsExpressions) => ({
              type: "filter" as const,
              expression: langEqualsExpressions.reduce(
                (reducedExpression, langEqualsExpression) => {
                  if (reducedExpression === null) {
                    return langEqualsExpression;
                  }
                  return {
                    type: "operation" as const,
                    operator: "||",
                    args: [reducedExpression, langEqualsExpression],
                  };
                },
                null as sparqljs.Expression | null,
              ) as sparqljs.Expression,
            })),
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable!(`${variablePrefix}Note`),
                predicate: KosResourceStatic.$properties.note["identifier"],
                subject,
              },
            ],
            type: "bgp",
          },
          ...[parameters?.preferredLanguages ?? []]
            .filter((languages) => languages.length > 0)
            .map((languages) =>
              languages.map((language) => ({
                type: "operation" as const,
                operator: "=",
                args: [
                  {
                    type: "operation" as const,
                    operator: "lang",
                    args: [dataFactory.variable!(`${variablePrefix}Note`)],
                  },
                  dataFactory.literal(language),
                ],
              })),
            )
            .map((langEqualsExpressions) => ({
              type: "filter" as const,
              expression: langEqualsExpressions.reduce(
                (reducedExpression, langEqualsExpression) => {
                  if (reducedExpression === null) {
                    return langEqualsExpression;
                  }
                  return {
                    type: "operation" as const,
                    operator: "||",
                    args: [reducedExpression, langEqualsExpression],
                  };
                },
                null as sparqljs.Expression | null,
              ) as sparqljs.Expression,
            })),
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable!(`${variablePrefix}PrefLabel`),
                predicate:
                  KosResourceStatic.$properties.prefLabel["identifier"],
                subject,
              },
            ],
            type: "bgp",
          },
          ...[parameters?.preferredLanguages ?? []]
            .filter((languages) => languages.length > 0)
            .map((languages) =>
              languages.map((language) => ({
                type: "operation" as const,
                operator: "=",
                args: [
                  {
                    type: "operation" as const,
                    operator: "lang",
                    args: [dataFactory.variable!(`${variablePrefix}PrefLabel`)],
                  },
                  dataFactory.literal(language),
                ],
              })),
            )
            .map((langEqualsExpressions) => ({
              type: "filter" as const,
              expression: langEqualsExpressions.reduce(
                (reducedExpression, langEqualsExpression) => {
                  if (reducedExpression === null) {
                    return langEqualsExpression;
                  }
                  return {
                    type: "operation" as const,
                    operator: "||",
                    args: [reducedExpression, langEqualsExpression],
                  };
                },
                null as sparqljs.Expression | null,
              ) as sparqljs.Expression,
            })),
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable!(`${variablePrefix}PrefLabelXl`),
                predicate:
                  KosResourceStatic.$properties.prefLabelXl["identifier"],
                subject,
              },
            ],
            type: "bgp",
          },
          ...Label.$sparqlWherePatterns({
            ignoreRdfType: true,
            preferredLanguages: parameters?.preferredLanguages,
            subject: dataFactory.variable!(`${variablePrefix}PrefLabelXl`),
            variablePrefix: `${variablePrefix}PrefLabelXl`,
          }),
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable!(`${variablePrefix}ScopeNote`),
                predicate:
                  KosResourceStatic.$properties.scopeNote["identifier"],
                subject,
              },
            ],
            type: "bgp",
          },
          ...[parameters?.preferredLanguages ?? []]
            .filter((languages) => languages.length > 0)
            .map((languages) =>
              languages.map((language) => ({
                type: "operation" as const,
                operator: "=",
                args: [
                  {
                    type: "operation" as const,
                    operator: "lang",
                    args: [dataFactory.variable!(`${variablePrefix}ScopeNote`)],
                  },
                  dataFactory.literal(language),
                ],
              })),
            )
            .map((langEqualsExpressions) => ({
              type: "filter" as const,
              expression: langEqualsExpressions.reduce(
                (reducedExpression, langEqualsExpression) => {
                  if (reducedExpression === null) {
                    return langEqualsExpression;
                  }
                  return {
                    type: "operation" as const,
                    operator: "||",
                    args: [reducedExpression, langEqualsExpression],
                  };
                },
                null as sparqljs.Expression | null,
              ) as sparqljs.Expression,
            })),
        ],
        type: "optional",
      },
    ];
    for (const pattern of propertyPatterns) {
      if (pattern.type === "optional") {
        optionalPatterns.push(pattern);
      } else {
        requiredPatterns.push(pattern);
      }
    }

    return requiredPatterns.concat(optionalPatterns);
  }

  export function $toRdf(
    _kosResource: KosResource,
    options?: {
      ignoreRdfType?: boolean;
      mutateGraph?: rdfjsResource.MutableResource.MutateGraph;
      resourceSet?: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource<rdfjs.NamedNode> {
    const mutateGraph = options?.mutateGraph;
    const resourceSet =
      options?.resourceSet ??
      new rdfjsResource.MutableResourceSet({
        dataFactory,
        dataset: datasetFactory.dataset(),
      });
    const resource = resourceSet.mutableNamedResource(
      _kosResource.$identifier,
      { mutateGraph },
    );
    resource.add(
      KosResourceStatic.$properties.altLabel["identifier"],
      ..._kosResource.altLabel.flatMap((item) => [item]),
    );
    resource.add(
      KosResourceStatic.$properties.altLabelXl["identifier"],
      ..._kosResource.altLabelXl.flatMap((item) => [
        Label.$toRdf(item, {
          mutateGraph: mutateGraph,
          resourceSet: resourceSet,
        }).identifier,
      ]),
    );
    resource.add(
      KosResourceStatic.$properties.changeNote["identifier"],
      ..._kosResource.changeNote.flatMap((item) => [item]),
    );
    resource.add(
      KosResourceStatic.$properties.definition["identifier"],
      ..._kosResource.definition.flatMap((item) => [item]),
    );
    resource.add(
      KosResourceStatic.$properties.editorialNote["identifier"],
      ..._kosResource.editorialNote.flatMap((item) => [item]),
    );
    resource.add(
      KosResourceStatic.$properties.example["identifier"],
      ..._kosResource.example.flatMap((item) => [item]),
    );
    resource.add(
      KosResourceStatic.$properties.hiddenLabel["identifier"],
      ..._kosResource.hiddenLabel.flatMap((item) => [item]),
    );
    resource.add(
      KosResourceStatic.$properties.hiddenLabelXl["identifier"],
      ..._kosResource.hiddenLabelXl.flatMap((item) => [
        Label.$toRdf(item, {
          mutateGraph: mutateGraph,
          resourceSet: resourceSet,
        }).identifier,
      ]),
    );
    resource.add(
      KosResourceStatic.$properties.historyNote["identifier"],
      ..._kosResource.historyNote.flatMap((item) => [item]),
    );
    resource.add(
      KosResourceStatic.$properties.modified["identifier"],
      ..._kosResource.modified.toList().flatMap((value) => [
        rdfLiteral.toRdf(value, {
          dataFactory,
          datatype: $RdfVocabularies.xsd.dateTime,
        }),
      ]),
    );
    resource.add(
      KosResourceStatic.$properties.notation["identifier"],
      ..._kosResource.notation.flatMap((item) => [item]),
    );
    resource.add(
      KosResourceStatic.$properties.note["identifier"],
      ..._kosResource.note.flatMap((item) => [item]),
    );
    resource.add(
      KosResourceStatic.$properties.prefLabel["identifier"],
      ..._kosResource.prefLabel.flatMap((item) => [item]),
    );
    resource.add(
      KosResourceStatic.$properties.prefLabelXl["identifier"],
      ..._kosResource.prefLabelXl.flatMap((item) => [
        Label.$toRdf(item, {
          mutateGraph: mutateGraph,
          resourceSet: resourceSet,
        }).identifier,
      ]),
    );
    resource.add(
      KosResourceStatic.$properties.scopeNote["identifier"],
      ..._kosResource.scopeNote.flatMap((item) => [item]),
    );
    return resource;
  }
}
export interface Concept extends KosResource {
  readonly $identifier: Concept.$Identifier;
  readonly $type: "Concept";
  readonly broader: readonly ConceptStub[];
  readonly broaderTransitive: readonly ConceptStub[];
  readonly broadMatch: readonly ConceptStub[];
  readonly closeMatch: readonly ConceptStub[];
  readonly exactMatch: readonly ConceptStub[];
  readonly inScheme: readonly ConceptSchemeStub[];
  readonly mappingRelation: readonly ConceptStub[];
  readonly narrower: readonly ConceptStub[];
  readonly narrowerTransitive: readonly ConceptStub[];
  readonly narrowMatch: readonly ConceptStub[];
  readonly related: readonly ConceptStub[];
  readonly relatedMatch: readonly ConceptStub[];
  readonly semanticRelation: readonly ConceptStub[];
  readonly topConceptOf: readonly ConceptSchemeStub[];
}

export namespace Concept {
  export function $create(
    parameters: {
      readonly $identifier: rdfjs.NamedNode | string;
      readonly broader?: readonly ConceptStub[];
      readonly broaderTransitive?: readonly ConceptStub[];
      readonly broadMatch?: readonly ConceptStub[];
      readonly closeMatch?: readonly ConceptStub[];
      readonly exactMatch?: readonly ConceptStub[];
      readonly inScheme?: readonly ConceptSchemeStub[];
      readonly mappingRelation?: readonly ConceptStub[];
      readonly narrower?: readonly ConceptStub[];
      readonly narrowerTransitive?: readonly ConceptStub[];
      readonly narrowMatch?: readonly ConceptStub[];
      readonly related?: readonly ConceptStub[];
      readonly relatedMatch?: readonly ConceptStub[];
      readonly semanticRelation?: readonly ConceptStub[];
      readonly topConceptOf?: readonly ConceptSchemeStub[];
    } & Parameters<typeof KosResourceStatic.$create>[0],
  ): Concept {
    let $identifier: Concept.$Identifier;
    if (typeof parameters.$identifier === "object") {
      $identifier = parameters.$identifier;
    } else if (typeof parameters.$identifier === "string") {
      $identifier = dataFactory.namedNode(parameters.$identifier);
    } else {
      $identifier = parameters.$identifier satisfies never;
    }

    const $type = "Concept" as const;
    let broader: readonly ConceptStub[];
    if (typeof parameters.broader === "undefined") {
      broader = [];
    } else if (typeof parameters.broader === "object") {
      broader = parameters.broader;
    } else {
      broader = parameters.broader satisfies never;
    }

    let broaderTransitive: readonly ConceptStub[];
    if (typeof parameters.broaderTransitive === "undefined") {
      broaderTransitive = [];
    } else if (typeof parameters.broaderTransitive === "object") {
      broaderTransitive = parameters.broaderTransitive;
    } else {
      broaderTransitive = parameters.broaderTransitive satisfies never;
    }

    let broadMatch: readonly ConceptStub[];
    if (typeof parameters.broadMatch === "undefined") {
      broadMatch = [];
    } else if (typeof parameters.broadMatch === "object") {
      broadMatch = parameters.broadMatch;
    } else {
      broadMatch = parameters.broadMatch satisfies never;
    }

    let closeMatch: readonly ConceptStub[];
    if (typeof parameters.closeMatch === "undefined") {
      closeMatch = [];
    } else if (typeof parameters.closeMatch === "object") {
      closeMatch = parameters.closeMatch;
    } else {
      closeMatch = parameters.closeMatch satisfies never;
    }

    let exactMatch: readonly ConceptStub[];
    if (typeof parameters.exactMatch === "undefined") {
      exactMatch = [];
    } else if (typeof parameters.exactMatch === "object") {
      exactMatch = parameters.exactMatch;
    } else {
      exactMatch = parameters.exactMatch satisfies never;
    }

    let inScheme: readonly ConceptSchemeStub[];
    if (typeof parameters.inScheme === "undefined") {
      inScheme = [];
    } else if (typeof parameters.inScheme === "object") {
      inScheme = parameters.inScheme;
    } else {
      inScheme = parameters.inScheme satisfies never;
    }

    let mappingRelation: readonly ConceptStub[];
    if (typeof parameters.mappingRelation === "undefined") {
      mappingRelation = [];
    } else if (typeof parameters.mappingRelation === "object") {
      mappingRelation = parameters.mappingRelation;
    } else {
      mappingRelation = parameters.mappingRelation satisfies never;
    }

    let narrower: readonly ConceptStub[];
    if (typeof parameters.narrower === "undefined") {
      narrower = [];
    } else if (typeof parameters.narrower === "object") {
      narrower = parameters.narrower;
    } else {
      narrower = parameters.narrower satisfies never;
    }

    let narrowerTransitive: readonly ConceptStub[];
    if (typeof parameters.narrowerTransitive === "undefined") {
      narrowerTransitive = [];
    } else if (typeof parameters.narrowerTransitive === "object") {
      narrowerTransitive = parameters.narrowerTransitive;
    } else {
      narrowerTransitive = parameters.narrowerTransitive satisfies never;
    }

    let narrowMatch: readonly ConceptStub[];
    if (typeof parameters.narrowMatch === "undefined") {
      narrowMatch = [];
    } else if (typeof parameters.narrowMatch === "object") {
      narrowMatch = parameters.narrowMatch;
    } else {
      narrowMatch = parameters.narrowMatch satisfies never;
    }

    let related: readonly ConceptStub[];
    if (typeof parameters.related === "undefined") {
      related = [];
    } else if (typeof parameters.related === "object") {
      related = parameters.related;
    } else {
      related = parameters.related satisfies never;
    }

    let relatedMatch: readonly ConceptStub[];
    if (typeof parameters.relatedMatch === "undefined") {
      relatedMatch = [];
    } else if (typeof parameters.relatedMatch === "object") {
      relatedMatch = parameters.relatedMatch;
    } else {
      relatedMatch = parameters.relatedMatch satisfies never;
    }

    let semanticRelation: readonly ConceptStub[];
    if (typeof parameters.semanticRelation === "undefined") {
      semanticRelation = [];
    } else if (typeof parameters.semanticRelation === "object") {
      semanticRelation = parameters.semanticRelation;
    } else {
      semanticRelation = parameters.semanticRelation satisfies never;
    }

    let topConceptOf: readonly ConceptSchemeStub[];
    if (typeof parameters.topConceptOf === "undefined") {
      topConceptOf = [];
    } else if (typeof parameters.topConceptOf === "object") {
      topConceptOf = parameters.topConceptOf;
    } else {
      topConceptOf = parameters.topConceptOf satisfies never;
    }

    return {
      ...KosResourceStatic.$create(parameters),
      $identifier,
      $type,
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
    };
  }

  export function $fromRdf(
    resource: rdfjsResource.Resource,
    options?: {
      [_index: string]: any;
      ignoreRdfType?: boolean;
      objectSet?: $ObjectSet;
      preferredLanguages?: readonly string[];
    },
  ): purify.Either<Error, Concept> {
    let {
      ignoreRdfType = false,
      objectSet,
      preferredLanguages,
      ...context
    } = options ?? {};
    if (!objectSet) {
      objectSet = new $RdfjsDatasetObjectSet({ dataset: resource.dataset });
    }

    return Concept.$propertiesFromRdf({
      ...context,
      ignoreRdfType,
      objectSet,
      preferredLanguages,
      resource,
    });
  }

  export const $fromRdfType: rdfjs.NamedNode<string> = dataFactory.namedNode(
    "http://www.w3.org/2004/02/skos/core#Concept",
  );
  export type $Identifier = KosResourceStatic.$Identifier;
  export const $Identifier = KosResourceStatic.$Identifier;
  export const $properties = {
    ...KosResourceStatic.$properties,
    broader: {
      identifier: dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#broader",
      ),
    },
    broaderTransitive: {
      identifier: dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#broaderTransitive",
      ),
    },
    broadMatch: {
      identifier: dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#broadMatch",
      ),
    },
    closeMatch: {
      identifier: dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#closeMatch",
      ),
    },
    exactMatch: {
      identifier: dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#exactMatch",
      ),
    },
    inScheme: {
      identifier: dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#inScheme",
      ),
    },
    mappingRelation: {
      identifier: dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#mappingRelation",
      ),
    },
    narrower: {
      identifier: dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#narrower",
      ),
    },
    narrowerTransitive: {
      identifier: dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#narrowerTransitive",
      ),
    },
    narrowMatch: {
      identifier: dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#narrowMatch",
      ),
    },
    related: {
      identifier: dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#related",
      ),
    },
    relatedMatch: {
      identifier: dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#relatedMatch",
      ),
    },
    semanticRelation: {
      identifier: dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#semanticRelation",
      ),
    },
    topConceptOf: {
      identifier: dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#topConceptOf",
      ),
    },
  };

  export function $propertiesFromRdf({
    ignoreRdfType: $ignoreRdfType,
    objectSet: $objectSet,
    preferredLanguages: $preferredLanguages,
    resource: $resource,
    // @ts-ignore
    ...$context
  }: {
    [_index: string]: any;
    ignoreRdfType: boolean;
    objectSet: $ObjectSet;
    preferredLanguages?: readonly string[];
    resource: rdfjsResource.Resource;
  }): purify.Either<
    Error,
    {
      $identifier: rdfjs.NamedNode;
      $type: "Concept";
      broader: readonly ConceptStub[];
      broaderTransitive: readonly ConceptStub[];
      broadMatch: readonly ConceptStub[];
      closeMatch: readonly ConceptStub[];
      exactMatch: readonly ConceptStub[];
      inScheme: readonly ConceptSchemeStub[];
      mappingRelation: readonly ConceptStub[];
      narrower: readonly ConceptStub[];
      narrowerTransitive: readonly ConceptStub[];
      narrowMatch: readonly ConceptStub[];
      related: readonly ConceptStub[];
      relatedMatch: readonly ConceptStub[];
      semanticRelation: readonly ConceptStub[];
      topConceptOf: readonly ConceptSchemeStub[];
    } & $UnwrapR<ReturnType<typeof KosResourceStatic.$propertiesFromRdf>>
  > {
    const $super0Either = KosResourceStatic.$propertiesFromRdf({
      ...$context,
      ignoreRdfType: true,
      objectSet: $objectSet,
      preferredLanguages: $preferredLanguages,
      resource: $resource,
    });
    if ($super0Either.isLeft()) {
      return $super0Either;
    }

    const $super0 = $super0Either.unsafeCoerce();
    if (!$ignoreRdfType) {
      const $rdfTypeCheck: purify.Either<Error, true> = $resource
        .value($RdfVocabularies.rdf.type)
        .chain((actualRdfType) => actualRdfType.toIri())
        .chain((actualRdfType) => {
          // Check the expected type and its known subtypes
          switch (actualRdfType.value) {
            case "http://www.w3.org/2004/02/skos/core#Concept":
              return purify.Either.of(true);
          }

          // Check arbitrary rdfs:subClassOf's of the expected type
          if ($resource.isInstanceOf(Concept.$fromRdfType)) {
            return purify.Either.of(true);
          }

          return purify.Left(
            new Error(
              `${rdfjsResource.Resource.Identifier.toString($resource.identifier)} has unexpected RDF type (actual: ${actualRdfType.value}, expected: http://www.w3.org/2004/02/skos/core#Concept)`,
            ),
          );
        });
      if ($rdfTypeCheck.isLeft()) {
        return $rdfTypeCheck;
      }
    }

    if ($resource.identifier.termType !== "NamedNode") {
      return purify.Left(
        new rdfjsResource.Resource.MistypedTermValueError({
          actualValue: $resource.identifier,
          expectedValueType: "(rdfjs.NamedNode)",
          focusResource: $resource,
          predicate: $RdfVocabularies.rdf.subject,
        }),
      );
    }

    const $identifier: Concept.$Identifier = $resource.identifier;
    const $type = "Concept" as const;
    const _broaderEither: purify.Either<Error, readonly ConceptStub[]> =
      purify.Either.of<
        Error,
        rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
      >($resource.values($properties.broader["identifier"], { unique: true }))
        .chain((values) =>
          values.chainMap((value) =>
            value.toResource().chain((resource) =>
              ConceptStub.$fromRdf(resource, {
                ...$context,
                ignoreRdfType: true,
                objectSet: $objectSet,
                preferredLanguages: $preferredLanguages,
              }),
            ),
          ),
        )
        .map((values) => values.toArray())
        .map((valuesArray) =>
          rdfjsResource.Resource.Values.fromValue({
            focusResource: $resource,
            predicate: Concept.$properties.broader["identifier"],
            value: valuesArray,
          }),
        )
        .chain((values) => values.head());
    if (_broaderEither.isLeft()) {
      return _broaderEither;
    }

    const broader = _broaderEither.unsafeCoerce();
    const _broaderTransitiveEither: purify.Either<
      Error,
      readonly ConceptStub[]
    > = purify.Either.of<
      Error,
      rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
    >(
      $resource.values($properties.broaderTransitive["identifier"], {
        unique: true,
      }),
    )
      .chain((values) =>
        values.chainMap((value) =>
          value.toResource().chain((resource) =>
            ConceptStub.$fromRdf(resource, {
              ...$context,
              ignoreRdfType: true,
              objectSet: $objectSet,
              preferredLanguages: $preferredLanguages,
            }),
          ),
        ),
      )
      .map((values) => values.toArray())
      .map((valuesArray) =>
        rdfjsResource.Resource.Values.fromValue({
          focusResource: $resource,
          predicate: Concept.$properties.broaderTransitive["identifier"],
          value: valuesArray,
        }),
      )
      .chain((values) => values.head());
    if (_broaderTransitiveEither.isLeft()) {
      return _broaderTransitiveEither;
    }

    const broaderTransitive = _broaderTransitiveEither.unsafeCoerce();
    const _broadMatchEither: purify.Either<Error, readonly ConceptStub[]> =
      purify.Either.of<
        Error,
        rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
      >(
        $resource.values($properties.broadMatch["identifier"], {
          unique: true,
        }),
      )
        .chain((values) =>
          values.chainMap((value) =>
            value.toResource().chain((resource) =>
              ConceptStub.$fromRdf(resource, {
                ...$context,
                ignoreRdfType: true,
                objectSet: $objectSet,
                preferredLanguages: $preferredLanguages,
              }),
            ),
          ),
        )
        .map((values) => values.toArray())
        .map((valuesArray) =>
          rdfjsResource.Resource.Values.fromValue({
            focusResource: $resource,
            predicate: Concept.$properties.broadMatch["identifier"],
            value: valuesArray,
          }),
        )
        .chain((values) => values.head());
    if (_broadMatchEither.isLeft()) {
      return _broadMatchEither;
    }

    const broadMatch = _broadMatchEither.unsafeCoerce();
    const _closeMatchEither: purify.Either<Error, readonly ConceptStub[]> =
      purify.Either.of<
        Error,
        rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
      >(
        $resource.values($properties.closeMatch["identifier"], {
          unique: true,
        }),
      )
        .chain((values) =>
          values.chainMap((value) =>
            value.toResource().chain((resource) =>
              ConceptStub.$fromRdf(resource, {
                ...$context,
                ignoreRdfType: true,
                objectSet: $objectSet,
                preferredLanguages: $preferredLanguages,
              }),
            ),
          ),
        )
        .map((values) => values.toArray())
        .map((valuesArray) =>
          rdfjsResource.Resource.Values.fromValue({
            focusResource: $resource,
            predicate: Concept.$properties.closeMatch["identifier"],
            value: valuesArray,
          }),
        )
        .chain((values) => values.head());
    if (_closeMatchEither.isLeft()) {
      return _closeMatchEither;
    }

    const closeMatch = _closeMatchEither.unsafeCoerce();
    const _exactMatchEither: purify.Either<Error, readonly ConceptStub[]> =
      purify.Either.of<
        Error,
        rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
      >(
        $resource.values($properties.exactMatch["identifier"], {
          unique: true,
        }),
      )
        .chain((values) =>
          values.chainMap((value) =>
            value.toResource().chain((resource) =>
              ConceptStub.$fromRdf(resource, {
                ...$context,
                ignoreRdfType: true,
                objectSet: $objectSet,
                preferredLanguages: $preferredLanguages,
              }),
            ),
          ),
        )
        .map((values) => values.toArray())
        .map((valuesArray) =>
          rdfjsResource.Resource.Values.fromValue({
            focusResource: $resource,
            predicate: Concept.$properties.exactMatch["identifier"],
            value: valuesArray,
          }),
        )
        .chain((values) => values.head());
    if (_exactMatchEither.isLeft()) {
      return _exactMatchEither;
    }

    const exactMatch = _exactMatchEither.unsafeCoerce();
    const _inSchemeEither: purify.Either<Error, readonly ConceptSchemeStub[]> =
      purify.Either.of<
        Error,
        rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
      >($resource.values($properties.inScheme["identifier"], { unique: true }))
        .chain((values) =>
          values.chainMap((value) =>
            value.toResource().chain((resource) =>
              ConceptSchemeStub.$fromRdf(resource, {
                ...$context,
                ignoreRdfType: true,
                objectSet: $objectSet,
                preferredLanguages: $preferredLanguages,
              }),
            ),
          ),
        )
        .map((values) => values.toArray())
        .map((valuesArray) =>
          rdfjsResource.Resource.Values.fromValue({
            focusResource: $resource,
            predicate: Concept.$properties.inScheme["identifier"],
            value: valuesArray,
          }),
        )
        .chain((values) => values.head());
    if (_inSchemeEither.isLeft()) {
      return _inSchemeEither;
    }

    const inScheme = _inSchemeEither.unsafeCoerce();
    const _mappingRelationEither: purify.Either<Error, readonly ConceptStub[]> =
      purify.Either.of<
        Error,
        rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
      >(
        $resource.values($properties.mappingRelation["identifier"], {
          unique: true,
        }),
      )
        .chain((values) =>
          values.chainMap((value) =>
            value.toResource().chain((resource) =>
              ConceptStub.$fromRdf(resource, {
                ...$context,
                ignoreRdfType: true,
                objectSet: $objectSet,
                preferredLanguages: $preferredLanguages,
              }),
            ),
          ),
        )
        .map((values) => values.toArray())
        .map((valuesArray) =>
          rdfjsResource.Resource.Values.fromValue({
            focusResource: $resource,
            predicate: Concept.$properties.mappingRelation["identifier"],
            value: valuesArray,
          }),
        )
        .chain((values) => values.head());
    if (_mappingRelationEither.isLeft()) {
      return _mappingRelationEither;
    }

    const mappingRelation = _mappingRelationEither.unsafeCoerce();
    const _narrowerEither: purify.Either<Error, readonly ConceptStub[]> =
      purify.Either.of<
        Error,
        rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
      >($resource.values($properties.narrower["identifier"], { unique: true }))
        .chain((values) =>
          values.chainMap((value) =>
            value.toResource().chain((resource) =>
              ConceptStub.$fromRdf(resource, {
                ...$context,
                ignoreRdfType: true,
                objectSet: $objectSet,
                preferredLanguages: $preferredLanguages,
              }),
            ),
          ),
        )
        .map((values) => values.toArray())
        .map((valuesArray) =>
          rdfjsResource.Resource.Values.fromValue({
            focusResource: $resource,
            predicate: Concept.$properties.narrower["identifier"],
            value: valuesArray,
          }),
        )
        .chain((values) => values.head());
    if (_narrowerEither.isLeft()) {
      return _narrowerEither;
    }

    const narrower = _narrowerEither.unsafeCoerce();
    const _narrowerTransitiveEither: purify.Either<
      Error,
      readonly ConceptStub[]
    > = purify.Either.of<
      Error,
      rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
    >(
      $resource.values($properties.narrowerTransitive["identifier"], {
        unique: true,
      }),
    )
      .chain((values) =>
        values.chainMap((value) =>
          value.toResource().chain((resource) =>
            ConceptStub.$fromRdf(resource, {
              ...$context,
              ignoreRdfType: true,
              objectSet: $objectSet,
              preferredLanguages: $preferredLanguages,
            }),
          ),
        ),
      )
      .map((values) => values.toArray())
      .map((valuesArray) =>
        rdfjsResource.Resource.Values.fromValue({
          focusResource: $resource,
          predicate: Concept.$properties.narrowerTransitive["identifier"],
          value: valuesArray,
        }),
      )
      .chain((values) => values.head());
    if (_narrowerTransitiveEither.isLeft()) {
      return _narrowerTransitiveEither;
    }

    const narrowerTransitive = _narrowerTransitiveEither.unsafeCoerce();
    const _narrowMatchEither: purify.Either<Error, readonly ConceptStub[]> =
      purify.Either.of<
        Error,
        rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
      >(
        $resource.values($properties.narrowMatch["identifier"], {
          unique: true,
        }),
      )
        .chain((values) =>
          values.chainMap((value) =>
            value.toResource().chain((resource) =>
              ConceptStub.$fromRdf(resource, {
                ...$context,
                ignoreRdfType: true,
                objectSet: $objectSet,
                preferredLanguages: $preferredLanguages,
              }),
            ),
          ),
        )
        .map((values) => values.toArray())
        .map((valuesArray) =>
          rdfjsResource.Resource.Values.fromValue({
            focusResource: $resource,
            predicate: Concept.$properties.narrowMatch["identifier"],
            value: valuesArray,
          }),
        )
        .chain((values) => values.head());
    if (_narrowMatchEither.isLeft()) {
      return _narrowMatchEither;
    }

    const narrowMatch = _narrowMatchEither.unsafeCoerce();
    const _relatedEither: purify.Either<Error, readonly ConceptStub[]> =
      purify.Either.of<
        Error,
        rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
      >($resource.values($properties.related["identifier"], { unique: true }))
        .chain((values) =>
          values.chainMap((value) =>
            value.toResource().chain((resource) =>
              ConceptStub.$fromRdf(resource, {
                ...$context,
                ignoreRdfType: true,
                objectSet: $objectSet,
                preferredLanguages: $preferredLanguages,
              }),
            ),
          ),
        )
        .map((values) => values.toArray())
        .map((valuesArray) =>
          rdfjsResource.Resource.Values.fromValue({
            focusResource: $resource,
            predicate: Concept.$properties.related["identifier"],
            value: valuesArray,
          }),
        )
        .chain((values) => values.head());
    if (_relatedEither.isLeft()) {
      return _relatedEither;
    }

    const related = _relatedEither.unsafeCoerce();
    const _relatedMatchEither: purify.Either<Error, readonly ConceptStub[]> =
      purify.Either.of<
        Error,
        rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
      >(
        $resource.values($properties.relatedMatch["identifier"], {
          unique: true,
        }),
      )
        .chain((values) =>
          values.chainMap((value) =>
            value.toResource().chain((resource) =>
              ConceptStub.$fromRdf(resource, {
                ...$context,
                ignoreRdfType: true,
                objectSet: $objectSet,
                preferredLanguages: $preferredLanguages,
              }),
            ),
          ),
        )
        .map((values) => values.toArray())
        .map((valuesArray) =>
          rdfjsResource.Resource.Values.fromValue({
            focusResource: $resource,
            predicate: Concept.$properties.relatedMatch["identifier"],
            value: valuesArray,
          }),
        )
        .chain((values) => values.head());
    if (_relatedMatchEither.isLeft()) {
      return _relatedMatchEither;
    }

    const relatedMatch = _relatedMatchEither.unsafeCoerce();
    const _semanticRelationEither: purify.Either<
      Error,
      readonly ConceptStub[]
    > = purify.Either.of<
      Error,
      rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
    >(
      $resource.values($properties.semanticRelation["identifier"], {
        unique: true,
      }),
    )
      .chain((values) =>
        values.chainMap((value) =>
          value.toResource().chain((resource) =>
            ConceptStub.$fromRdf(resource, {
              ...$context,
              ignoreRdfType: true,
              objectSet: $objectSet,
              preferredLanguages: $preferredLanguages,
            }),
          ),
        ),
      )
      .map((values) => values.toArray())
      .map((valuesArray) =>
        rdfjsResource.Resource.Values.fromValue({
          focusResource: $resource,
          predicate: Concept.$properties.semanticRelation["identifier"],
          value: valuesArray,
        }),
      )
      .chain((values) => values.head());
    if (_semanticRelationEither.isLeft()) {
      return _semanticRelationEither;
    }

    const semanticRelation = _semanticRelationEither.unsafeCoerce();
    const _topConceptOfEither: purify.Either<
      Error,
      readonly ConceptSchemeStub[]
    > = purify.Either.of<
      Error,
      rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
    >(
      $resource.values($properties.topConceptOf["identifier"], {
        unique: true,
      }),
    )
      .chain((values) =>
        values.chainMap((value) =>
          value.toResource().chain((resource) =>
            ConceptSchemeStub.$fromRdf(resource, {
              ...$context,
              ignoreRdfType: true,
              objectSet: $objectSet,
              preferredLanguages: $preferredLanguages,
            }),
          ),
        ),
      )
      .map((values) => values.toArray())
      .map((valuesArray) =>
        rdfjsResource.Resource.Values.fromValue({
          focusResource: $resource,
          predicate: Concept.$properties.topConceptOf["identifier"],
          value: valuesArray,
        }),
      )
      .chain((values) => values.head());
    if (_topConceptOfEither.isLeft()) {
      return _topConceptOfEither;
    }

    const topConceptOf = _topConceptOfEither.unsafeCoerce();
    return purify.Either.of({
      ...$super0,
      $identifier,
      $type,
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
    });
  }

  export function $sparqlConstructQuery(
    parameters?: {
      ignoreRdfType?: boolean;
      prefixes?: { [prefix: string]: string };
      preferredLanguages?: readonly string[];
      subject?: sparqljs.Triple["subject"];
    } & Omit<sparqljs.ConstructQuery, "prefixes" | "queryType" | "type">,
  ): sparqljs.ConstructQuery {
    const { ignoreRdfType, preferredLanguages, subject, ...queryParameters } =
      parameters ?? {};

    return {
      ...queryParameters,
      prefixes: parameters?.prefixes ?? {},
      queryType: "CONSTRUCT",
      template: (queryParameters.template ?? []).concat(
        Concept.$sparqlConstructTemplateTriples({ ignoreRdfType, subject }),
      ),
      type: "query",
      where: (queryParameters.where ?? []).concat(
        Concept.$sparqlWherePatterns({
          ignoreRdfType,
          preferredLanguages,
          subject,
        }),
      ),
    };
  }

  export function $sparqlConstructQueryString(
    parameters?: {
      ignoreRdfType?: boolean;
      preferredLanguages?: readonly string[];
      subject?: sparqljs.Triple["subject"];
      variablePrefix?: string;
    } & Omit<sparqljs.ConstructQuery, "prefixes" | "queryType" | "type"> &
      sparqljs.GeneratorOptions,
  ): string {
    return new sparqljs.Generator(parameters).stringify(
      Concept.$sparqlConstructQuery(parameters),
    );
  }

  export function $sparqlConstructTemplateTriples(parameters?: {
    ignoreRdfType?: boolean;
    subject?: sparqljs.Triple["subject"];
    variablePrefix?: string;
  }): readonly sparqljs.Triple[] {
    const subject = parameters?.subject ?? dataFactory.variable!("concept");
    const triples: sparqljs.Triple[] = [];
    const variablePrefix =
      parameters?.variablePrefix ??
      (subject.termType === "Variable" ? subject.value : "concept");
    triples.push(
      ...KosResourceStatic.$sparqlConstructTemplateTriples({
        ignoreRdfType: true,
        subject,
        variablePrefix,
      }),
    );
    if (!parameters?.ignoreRdfType) {
      triples.push(
        {
          subject,
          predicate: $RdfVocabularies.rdf.type,
          object: dataFactory.variable!(`${variablePrefix}RdfType`),
        },
        {
          subject: dataFactory.variable!(`${variablePrefix}RdfType`),
          predicate: $RdfVocabularies.rdfs.subClassOf,
          object: dataFactory.variable!(`${variablePrefix}RdfClass`),
        },
      );
    }

    triples.push({
      object: dataFactory.variable!(`${variablePrefix}Broader`),
      predicate: Concept.$properties.broader["identifier"],
      subject,
    });
    triples.push(
      ...ConceptStub.$sparqlConstructTemplateTriples({
        ignoreRdfType: true,
        subject: dataFactory.variable!(`${variablePrefix}Broader`),
        variablePrefix: `${variablePrefix}Broader`,
      }),
    );
    triples.push({
      object: dataFactory.variable!(`${variablePrefix}BroaderTransitive`),
      predicate: Concept.$properties.broaderTransitive["identifier"],
      subject,
    });
    triples.push(
      ...ConceptStub.$sparqlConstructTemplateTriples({
        ignoreRdfType: true,
        subject: dataFactory.variable!(`${variablePrefix}BroaderTransitive`),
        variablePrefix: `${variablePrefix}BroaderTransitive`,
      }),
    );
    triples.push({
      object: dataFactory.variable!(`${variablePrefix}BroadMatch`),
      predicate: Concept.$properties.broadMatch["identifier"],
      subject,
    });
    triples.push(
      ...ConceptStub.$sparqlConstructTemplateTriples({
        ignoreRdfType: true,
        subject: dataFactory.variable!(`${variablePrefix}BroadMatch`),
        variablePrefix: `${variablePrefix}BroadMatch`,
      }),
    );
    triples.push({
      object: dataFactory.variable!(`${variablePrefix}CloseMatch`),
      predicate: Concept.$properties.closeMatch["identifier"],
      subject,
    });
    triples.push(
      ...ConceptStub.$sparqlConstructTemplateTriples({
        ignoreRdfType: true,
        subject: dataFactory.variable!(`${variablePrefix}CloseMatch`),
        variablePrefix: `${variablePrefix}CloseMatch`,
      }),
    );
    triples.push({
      object: dataFactory.variable!(`${variablePrefix}ExactMatch`),
      predicate: Concept.$properties.exactMatch["identifier"],
      subject,
    });
    triples.push(
      ...ConceptStub.$sparqlConstructTemplateTriples({
        ignoreRdfType: true,
        subject: dataFactory.variable!(`${variablePrefix}ExactMatch`),
        variablePrefix: `${variablePrefix}ExactMatch`,
      }),
    );
    triples.push({
      object: dataFactory.variable!(`${variablePrefix}InScheme`),
      predicate: Concept.$properties.inScheme["identifier"],
      subject,
    });
    triples.push(
      ...ConceptSchemeStub.$sparqlConstructTemplateTriples({
        ignoreRdfType: true,
        subject: dataFactory.variable!(`${variablePrefix}InScheme`),
        variablePrefix: `${variablePrefix}InScheme`,
      }),
    );
    triples.push({
      object: dataFactory.variable!(`${variablePrefix}MappingRelation`),
      predicate: Concept.$properties.mappingRelation["identifier"],
      subject,
    });
    triples.push(
      ...ConceptStub.$sparqlConstructTemplateTriples({
        ignoreRdfType: true,
        subject: dataFactory.variable!(`${variablePrefix}MappingRelation`),
        variablePrefix: `${variablePrefix}MappingRelation`,
      }),
    );
    triples.push({
      object: dataFactory.variable!(`${variablePrefix}Narrower`),
      predicate: Concept.$properties.narrower["identifier"],
      subject,
    });
    triples.push(
      ...ConceptStub.$sparqlConstructTemplateTriples({
        ignoreRdfType: true,
        subject: dataFactory.variable!(`${variablePrefix}Narrower`),
        variablePrefix: `${variablePrefix}Narrower`,
      }),
    );
    triples.push({
      object: dataFactory.variable!(`${variablePrefix}NarrowerTransitive`),
      predicate: Concept.$properties.narrowerTransitive["identifier"],
      subject,
    });
    triples.push(
      ...ConceptStub.$sparqlConstructTemplateTriples({
        ignoreRdfType: true,
        subject: dataFactory.variable!(`${variablePrefix}NarrowerTransitive`),
        variablePrefix: `${variablePrefix}NarrowerTransitive`,
      }),
    );
    triples.push({
      object: dataFactory.variable!(`${variablePrefix}NarrowMatch`),
      predicate: Concept.$properties.narrowMatch["identifier"],
      subject,
    });
    triples.push(
      ...ConceptStub.$sparqlConstructTemplateTriples({
        ignoreRdfType: true,
        subject: dataFactory.variable!(`${variablePrefix}NarrowMatch`),
        variablePrefix: `${variablePrefix}NarrowMatch`,
      }),
    );
    triples.push({
      object: dataFactory.variable!(`${variablePrefix}Related`),
      predicate: Concept.$properties.related["identifier"],
      subject,
    });
    triples.push(
      ...ConceptStub.$sparqlConstructTemplateTriples({
        ignoreRdfType: true,
        subject: dataFactory.variable!(`${variablePrefix}Related`),
        variablePrefix: `${variablePrefix}Related`,
      }),
    );
    triples.push({
      object: dataFactory.variable!(`${variablePrefix}RelatedMatch`),
      predicate: Concept.$properties.relatedMatch["identifier"],
      subject,
    });
    triples.push(
      ...ConceptStub.$sparqlConstructTemplateTriples({
        ignoreRdfType: true,
        subject: dataFactory.variable!(`${variablePrefix}RelatedMatch`),
        variablePrefix: `${variablePrefix}RelatedMatch`,
      }),
    );
    triples.push({
      object: dataFactory.variable!(`${variablePrefix}SemanticRelation`),
      predicate: Concept.$properties.semanticRelation["identifier"],
      subject,
    });
    triples.push(
      ...ConceptStub.$sparqlConstructTemplateTriples({
        ignoreRdfType: true,
        subject: dataFactory.variable!(`${variablePrefix}SemanticRelation`),
        variablePrefix: `${variablePrefix}SemanticRelation`,
      }),
    );
    triples.push({
      object: dataFactory.variable!(`${variablePrefix}TopConceptOf`),
      predicate: Concept.$properties.topConceptOf["identifier"],
      subject,
    });
    triples.push(
      ...ConceptSchemeStub.$sparqlConstructTemplateTriples({
        ignoreRdfType: true,
        subject: dataFactory.variable!(`${variablePrefix}TopConceptOf`),
        variablePrefix: `${variablePrefix}TopConceptOf`,
      }),
    );
    return triples;
  }

  export function $sparqlWherePatterns(parameters?: {
    ignoreRdfType?: boolean;
    preferredLanguages?: readonly string[];
    subject?: sparqljs.Triple["subject"];
    variablePrefix?: string;
  }): readonly sparqljs.Pattern[] {
    const optionalPatterns: sparqljs.OptionalPattern[] = [];
    const requiredPatterns: sparqljs.Pattern[] = [];
    const subject = parameters?.subject ?? dataFactory.variable!("concept");
    const variablePrefix =
      parameters?.variablePrefix ??
      (subject.termType === "Variable" ? subject.value : "concept");
    for (const pattern of KosResourceStatic.$sparqlWherePatterns({
      ignoreRdfType: true,
      subject,
      variablePrefix,
    })) {
      if (pattern.type === "optional") {
        optionalPatterns.push(pattern);
      } else {
        requiredPatterns.push(pattern);
      }
    }

    const rdfTypeVariable = dataFactory.variable!(`${variablePrefix}RdfType`);
    if (!parameters?.ignoreRdfType) {
      requiredPatterns.push(
        $sparqlInstancesOfPattern({ rdfType: Concept.$fromRdfType, subject }),
        {
          triples: [
            {
              subject,
              predicate: $RdfVocabularies.rdf.type,
              object: rdfTypeVariable,
            },
          ],
          type: "bgp" as const,
        },
      );
      optionalPatterns.push({
        patterns: [
          {
            triples: [
              {
                subject: rdfTypeVariable,
                predicate: {
                  items: [$RdfVocabularies.rdfs.subClassOf],
                  pathType: "+" as const,
                  type: "path" as const,
                },
                object: dataFactory.variable!(`${variablePrefix}RdfClass`),
              },
            ],
            type: "bgp" as const,
          },
        ],
        type: "optional" as const,
      });
    }

    const propertyPatterns: readonly sparqljs.Pattern[] = [
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable!(`${variablePrefix}Broader`),
                predicate: Concept.$properties.broader["identifier"],
                subject,
              },
            ],
            type: "bgp",
          },
          ...ConceptStub.$sparqlWherePatterns({
            ignoreRdfType: true,
            preferredLanguages: parameters?.preferredLanguages,
            subject: dataFactory.variable!(`${variablePrefix}Broader`),
            variablePrefix: `${variablePrefix}Broader`,
          }),
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable!(
                  `${variablePrefix}BroaderTransitive`,
                ),
                predicate: Concept.$properties.broaderTransitive["identifier"],
                subject,
              },
            ],
            type: "bgp",
          },
          ...ConceptStub.$sparqlWherePatterns({
            ignoreRdfType: true,
            preferredLanguages: parameters?.preferredLanguages,
            subject: dataFactory.variable!(
              `${variablePrefix}BroaderTransitive`,
            ),
            variablePrefix: `${variablePrefix}BroaderTransitive`,
          }),
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable!(`${variablePrefix}BroadMatch`),
                predicate: Concept.$properties.broadMatch["identifier"],
                subject,
              },
            ],
            type: "bgp",
          },
          ...ConceptStub.$sparqlWherePatterns({
            ignoreRdfType: true,
            preferredLanguages: parameters?.preferredLanguages,
            subject: dataFactory.variable!(`${variablePrefix}BroadMatch`),
            variablePrefix: `${variablePrefix}BroadMatch`,
          }),
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable!(`${variablePrefix}CloseMatch`),
                predicate: Concept.$properties.closeMatch["identifier"],
                subject,
              },
            ],
            type: "bgp",
          },
          ...ConceptStub.$sparqlWherePatterns({
            ignoreRdfType: true,
            preferredLanguages: parameters?.preferredLanguages,
            subject: dataFactory.variable!(`${variablePrefix}CloseMatch`),
            variablePrefix: `${variablePrefix}CloseMatch`,
          }),
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable!(`${variablePrefix}ExactMatch`),
                predicate: Concept.$properties.exactMatch["identifier"],
                subject,
              },
            ],
            type: "bgp",
          },
          ...ConceptStub.$sparqlWherePatterns({
            ignoreRdfType: true,
            preferredLanguages: parameters?.preferredLanguages,
            subject: dataFactory.variable!(`${variablePrefix}ExactMatch`),
            variablePrefix: `${variablePrefix}ExactMatch`,
          }),
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable!(`${variablePrefix}InScheme`),
                predicate: Concept.$properties.inScheme["identifier"],
                subject,
              },
            ],
            type: "bgp",
          },
          ...ConceptSchemeStub.$sparqlWherePatterns({
            ignoreRdfType: true,
            preferredLanguages: parameters?.preferredLanguages,
            subject: dataFactory.variable!(`${variablePrefix}InScheme`),
            variablePrefix: `${variablePrefix}InScheme`,
          }),
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable!(
                  `${variablePrefix}MappingRelation`,
                ),
                predicate: Concept.$properties.mappingRelation["identifier"],
                subject,
              },
            ],
            type: "bgp",
          },
          ...ConceptStub.$sparqlWherePatterns({
            ignoreRdfType: true,
            preferredLanguages: parameters?.preferredLanguages,
            subject: dataFactory.variable!(`${variablePrefix}MappingRelation`),
            variablePrefix: `${variablePrefix}MappingRelation`,
          }),
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable!(`${variablePrefix}Narrower`),
                predicate: Concept.$properties.narrower["identifier"],
                subject,
              },
            ],
            type: "bgp",
          },
          ...ConceptStub.$sparqlWherePatterns({
            ignoreRdfType: true,
            preferredLanguages: parameters?.preferredLanguages,
            subject: dataFactory.variable!(`${variablePrefix}Narrower`),
            variablePrefix: `${variablePrefix}Narrower`,
          }),
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable!(
                  `${variablePrefix}NarrowerTransitive`,
                ),
                predicate: Concept.$properties.narrowerTransitive["identifier"],
                subject,
              },
            ],
            type: "bgp",
          },
          ...ConceptStub.$sparqlWherePatterns({
            ignoreRdfType: true,
            preferredLanguages: parameters?.preferredLanguages,
            subject: dataFactory.variable!(
              `${variablePrefix}NarrowerTransitive`,
            ),
            variablePrefix: `${variablePrefix}NarrowerTransitive`,
          }),
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable!(`${variablePrefix}NarrowMatch`),
                predicate: Concept.$properties.narrowMatch["identifier"],
                subject,
              },
            ],
            type: "bgp",
          },
          ...ConceptStub.$sparqlWherePatterns({
            ignoreRdfType: true,
            preferredLanguages: parameters?.preferredLanguages,
            subject: dataFactory.variable!(`${variablePrefix}NarrowMatch`),
            variablePrefix: `${variablePrefix}NarrowMatch`,
          }),
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable!(`${variablePrefix}Related`),
                predicate: Concept.$properties.related["identifier"],
                subject,
              },
            ],
            type: "bgp",
          },
          ...ConceptStub.$sparqlWherePatterns({
            ignoreRdfType: true,
            preferredLanguages: parameters?.preferredLanguages,
            subject: dataFactory.variable!(`${variablePrefix}Related`),
            variablePrefix: `${variablePrefix}Related`,
          }),
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable!(`${variablePrefix}RelatedMatch`),
                predicate: Concept.$properties.relatedMatch["identifier"],
                subject,
              },
            ],
            type: "bgp",
          },
          ...ConceptStub.$sparqlWherePatterns({
            ignoreRdfType: true,
            preferredLanguages: parameters?.preferredLanguages,
            subject: dataFactory.variable!(`${variablePrefix}RelatedMatch`),
            variablePrefix: `${variablePrefix}RelatedMatch`,
          }),
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable!(
                  `${variablePrefix}SemanticRelation`,
                ),
                predicate: Concept.$properties.semanticRelation["identifier"],
                subject,
              },
            ],
            type: "bgp",
          },
          ...ConceptStub.$sparqlWherePatterns({
            ignoreRdfType: true,
            preferredLanguages: parameters?.preferredLanguages,
            subject: dataFactory.variable!(`${variablePrefix}SemanticRelation`),
            variablePrefix: `${variablePrefix}SemanticRelation`,
          }),
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable!(`${variablePrefix}TopConceptOf`),
                predicate: Concept.$properties.topConceptOf["identifier"],
                subject,
              },
            ],
            type: "bgp",
          },
          ...ConceptSchemeStub.$sparqlWherePatterns({
            ignoreRdfType: true,
            preferredLanguages: parameters?.preferredLanguages,
            subject: dataFactory.variable!(`${variablePrefix}TopConceptOf`),
            variablePrefix: `${variablePrefix}TopConceptOf`,
          }),
        ],
        type: "optional",
      },
    ];
    for (const pattern of propertyPatterns) {
      if (pattern.type === "optional") {
        optionalPatterns.push(pattern);
      } else {
        requiredPatterns.push(pattern);
      }
    }

    return requiredPatterns.concat(optionalPatterns);
  }

  export function $toRdf(
    _concept: Concept,
    options?: {
      ignoreRdfType?: boolean;
      mutateGraph?: rdfjsResource.MutableResource.MutateGraph;
      resourceSet?: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource<rdfjs.NamedNode> {
    const ignoreRdfType = !!options?.ignoreRdfType;
    const mutateGraph = options?.mutateGraph;
    const resourceSet =
      options?.resourceSet ??
      new rdfjsResource.MutableResourceSet({
        dataFactory,
        dataset: datasetFactory.dataset(),
      });
    const resource = KosResourceStatic.$toRdf(_concept, {
      ignoreRdfType: true,
      mutateGraph,
      resourceSet,
    });
    if (!ignoreRdfType) {
      resource.add(
        $RdfVocabularies.rdf.type,
        resource.dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#Concept",
        ),
      );
    }

    resource.add(
      Concept.$properties.broader["identifier"],
      ..._concept.broader.flatMap((item) => [
        ConceptStub.$toRdf(item, {
          mutateGraph: mutateGraph,
          resourceSet: resourceSet,
        }).identifier,
      ]),
    );
    resource.add(
      Concept.$properties.broaderTransitive["identifier"],
      ..._concept.broaderTransitive.flatMap((item) => [
        ConceptStub.$toRdf(item, {
          mutateGraph: mutateGraph,
          resourceSet: resourceSet,
        }).identifier,
      ]),
    );
    resource.add(
      Concept.$properties.broadMatch["identifier"],
      ..._concept.broadMatch.flatMap((item) => [
        ConceptStub.$toRdf(item, {
          mutateGraph: mutateGraph,
          resourceSet: resourceSet,
        }).identifier,
      ]),
    );
    resource.add(
      Concept.$properties.closeMatch["identifier"],
      ..._concept.closeMatch.flatMap((item) => [
        ConceptStub.$toRdf(item, {
          mutateGraph: mutateGraph,
          resourceSet: resourceSet,
        }).identifier,
      ]),
    );
    resource.add(
      Concept.$properties.exactMatch["identifier"],
      ..._concept.exactMatch.flatMap((item) => [
        ConceptStub.$toRdf(item, {
          mutateGraph: mutateGraph,
          resourceSet: resourceSet,
        }).identifier,
      ]),
    );
    resource.add(
      Concept.$properties.inScheme["identifier"],
      ..._concept.inScheme.flatMap((item) => [
        ConceptSchemeStub.$toRdf(item, {
          mutateGraph: mutateGraph,
          resourceSet: resourceSet,
        }).identifier,
      ]),
    );
    resource.add(
      Concept.$properties.mappingRelation["identifier"],
      ..._concept.mappingRelation.flatMap((item) => [
        ConceptStub.$toRdf(item, {
          mutateGraph: mutateGraph,
          resourceSet: resourceSet,
        }).identifier,
      ]),
    );
    resource.add(
      Concept.$properties.narrower["identifier"],
      ..._concept.narrower.flatMap((item) => [
        ConceptStub.$toRdf(item, {
          mutateGraph: mutateGraph,
          resourceSet: resourceSet,
        }).identifier,
      ]),
    );
    resource.add(
      Concept.$properties.narrowerTransitive["identifier"],
      ..._concept.narrowerTransitive.flatMap((item) => [
        ConceptStub.$toRdf(item, {
          mutateGraph: mutateGraph,
          resourceSet: resourceSet,
        }).identifier,
      ]),
    );
    resource.add(
      Concept.$properties.narrowMatch["identifier"],
      ..._concept.narrowMatch.flatMap((item) => [
        ConceptStub.$toRdf(item, {
          mutateGraph: mutateGraph,
          resourceSet: resourceSet,
        }).identifier,
      ]),
    );
    resource.add(
      Concept.$properties.related["identifier"],
      ..._concept.related.flatMap((item) => [
        ConceptStub.$toRdf(item, {
          mutateGraph: mutateGraph,
          resourceSet: resourceSet,
        }).identifier,
      ]),
    );
    resource.add(
      Concept.$properties.relatedMatch["identifier"],
      ..._concept.relatedMatch.flatMap((item) => [
        ConceptStub.$toRdf(item, {
          mutateGraph: mutateGraph,
          resourceSet: resourceSet,
        }).identifier,
      ]),
    );
    resource.add(
      Concept.$properties.semanticRelation["identifier"],
      ..._concept.semanticRelation.flatMap((item) => [
        ConceptStub.$toRdf(item, {
          mutateGraph: mutateGraph,
          resourceSet: resourceSet,
        }).identifier,
      ]),
    );
    resource.add(
      Concept.$properties.topConceptOf["identifier"],
      ..._concept.topConceptOf.flatMap((item) => [
        ConceptSchemeStub.$toRdf(item, {
          mutateGraph: mutateGraph,
          resourceSet: resourceSet,
        }).identifier,
      ]),
    );
    return resource;
  }

  export function isConcept(object: KosResource): object is Concept {
    switch (object.$type) {
      case "Concept":
        return true;
      default:
        return false;
    }
  }
}
export interface KosResourceStub {
  readonly $identifier: KosResourceStubStatic.$Identifier;
  readonly $type: "ConceptSchemeStub" | "ConceptStub";
  readonly prefLabel: readonly rdfjs.Literal[];
  readonly prefLabelXl: readonly LabelStub[];
}

export namespace KosResourceStubStatic {
  export function $create(parameters: {
    readonly $identifier: rdfjs.NamedNode | string;
    readonly prefLabel?:
      | readonly rdfjs.Literal[]
      | readonly boolean[]
      | readonly number[]
      | readonly string[];
    readonly prefLabelXl?: readonly LabelStub[];
  }): Omit<KosResourceStub, "$type"> {
    let $identifier: KosResourceStubStatic.$Identifier;
    if (typeof parameters.$identifier === "object") {
      $identifier = parameters.$identifier;
    } else if (typeof parameters.$identifier === "string") {
      $identifier = dataFactory.namedNode(parameters.$identifier);
    } else {
      $identifier = parameters.$identifier satisfies never;
    }

    let prefLabel: readonly rdfjs.Literal[];
    if (typeof parameters.prefLabel === "undefined") {
      prefLabel = [];
    } else if ($isReadonlyObjectArray(parameters.prefLabel)) {
      prefLabel = parameters.prefLabel;
    } else if ($isReadonlyBooleanArray(parameters.prefLabel)) {
      prefLabel = parameters.prefLabel.map((item) =>
        rdfLiteral.toRdf(item, { dataFactory }),
      );
    } else if ($isReadonlyNumberArray(parameters.prefLabel)) {
      prefLabel = parameters.prefLabel.map((item) =>
        rdfLiteral.toRdf(item, { dataFactory }),
      );
    } else if ($isReadonlyStringArray(parameters.prefLabel)) {
      prefLabel = parameters.prefLabel.map((item) => dataFactory.literal(item));
    } else {
      prefLabel = parameters.prefLabel satisfies never;
    }

    let prefLabelXl: readonly LabelStub[];
    if (typeof parameters.prefLabelXl === "undefined") {
      prefLabelXl = [];
    } else if (typeof parameters.prefLabelXl === "object") {
      prefLabelXl = parameters.prefLabelXl;
    } else {
      prefLabelXl = parameters.prefLabelXl satisfies never;
    }

    return { $identifier, prefLabel, prefLabelXl };
  }

  export type $Identifier = rdfjs.NamedNode;

  export namespace $Identifier {
    export function fromString(
      identifier: string,
    ): purify.Either<Error, rdfjs.NamedNode> {
      return purify.Either.encase(() =>
        rdfjsResource.Resource.Identifier.fromString({
          dataFactory,
          identifier,
        }),
      ).chain((identifier) =>
        identifier.termType === "NamedNode"
          ? purify.Either.of(identifier)
          : purify.Left(new Error("expected identifier to be NamedNode")),
      ) as purify.Either<Error, rdfjs.NamedNode>;
    }

    export const // biome-ignore lint/suspicious/noShadowRestrictedNames:
      toString = rdfjsResource.Resource.Identifier.toString;
  }

  export const $properties = {
    prefLabel: {
      identifier: dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#prefLabel",
      ),
    },
    prefLabelXl: {
      identifier: dataFactory.namedNode(
        "http://www.w3.org/2008/05/skos-xl#prefLabel",
      ),
    },
  };

  export function $propertiesFromRdf({
    ignoreRdfType: $ignoreRdfType,
    objectSet: $objectSet,
    preferredLanguages: $preferredLanguages,
    resource: $resource,
    // @ts-ignore
    ...$context
  }: {
    [_index: string]: any;
    ignoreRdfType: boolean;
    objectSet: $ObjectSet;
    preferredLanguages?: readonly string[];
    resource: rdfjsResource.Resource;
  }): purify.Either<
    Error,
    {
      $identifier: rdfjs.NamedNode;
      prefLabel: readonly rdfjs.Literal[];
      prefLabelXl: readonly LabelStub[];
    }
  > {
    if ($resource.identifier.termType !== "NamedNode") {
      return purify.Left(
        new rdfjsResource.Resource.MistypedTermValueError({
          actualValue: $resource.identifier,
          expectedValueType: "(rdfjs.NamedNode)",
          focusResource: $resource,
          predicate: $RdfVocabularies.rdf.subject,
        }),
      );
    }

    const $identifier: KosResourceStubStatic.$Identifier = $resource.identifier;
    const _prefLabelEither: purify.Either<Error, readonly rdfjs.Literal[]> =
      purify.Either.of<
        Error,
        rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
      >($resource.values($properties.prefLabel["identifier"], { unique: true }))
        .chain((values) => {
          if (!$preferredLanguages || $preferredLanguages.length === 0) {
            return purify.Either.of<
              Error,
              rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
            >(values);
          }

          const literalValuesEither = values.chainMap((value) =>
            value.toLiteral(),
          );
          if (literalValuesEither.isLeft()) {
            return literalValuesEither;
          }
          const literalValues = literalValuesEither.unsafeCoerce();

          // Return all literals for the first preferredLanguage, then all literals for the second preferredLanguage, etc.
          // Within a preferredLanguage the literals may be in any order.
          let filteredLiteralValues:
            | rdfjsResource.Resource.Values<rdfjs.Literal>
            | undefined;
          for (const preferredLanguage of $preferredLanguages) {
            if (!filteredLiteralValues) {
              filteredLiteralValues = literalValues.filter(
                (value) => value.language === preferredLanguage,
              );
            } else {
              filteredLiteralValues = filteredLiteralValues.concat(
                ...literalValues
                  .filter((value) => value.language === preferredLanguage)
                  .toArray(),
              );
            }
          }

          return purify.Either.of<
            Error,
            rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
          >(
            filteredLiteralValues!.map(
              (literalValue) =>
                new rdfjsResource.Resource.TermValue({
                  focusResource: $resource,
                  predicate:
                    KosResourceStubStatic.$properties.prefLabel["identifier"],
                  term: literalValue,
                }),
            ),
          );
        })
        .chain((values) => values.chainMap((value) => value.toLiteral()))
        .map((values) => values.toArray())
        .map((valuesArray) =>
          rdfjsResource.Resource.Values.fromValue({
            focusResource: $resource,
            predicate:
              KosResourceStubStatic.$properties.prefLabel["identifier"],
            value: valuesArray,
          }),
        )
        .chain((values) => values.head());
    if (_prefLabelEither.isLeft()) {
      return _prefLabelEither;
    }

    const prefLabel = _prefLabelEither.unsafeCoerce();
    const _prefLabelXlEither: purify.Either<Error, readonly LabelStub[]> =
      purify.Either.of<
        Error,
        rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
      >(
        $resource.values($properties.prefLabelXl["identifier"], {
          unique: true,
        }),
      )
        .chain((values) =>
          values.chainMap((value) =>
            value.toResource().chain((resource) =>
              LabelStub.$fromRdf(resource, {
                ...$context,
                ignoreRdfType: true,
                objectSet: $objectSet,
                preferredLanguages: $preferredLanguages,
              }),
            ),
          ),
        )
        .map((values) => values.toArray())
        .map((valuesArray) =>
          rdfjsResource.Resource.Values.fromValue({
            focusResource: $resource,
            predicate:
              KosResourceStubStatic.$properties.prefLabelXl["identifier"],
            value: valuesArray,
          }),
        )
        .chain((values) => values.head());
    if (_prefLabelXlEither.isLeft()) {
      return _prefLabelXlEither;
    }

    const prefLabelXl = _prefLabelXlEither.unsafeCoerce();
    return purify.Either.of({ $identifier, prefLabel, prefLabelXl });
  }

  export function $sparqlConstructQuery(
    parameters?: {
      ignoreRdfType?: boolean;
      prefixes?: { [prefix: string]: string };
      preferredLanguages?: readonly string[];
      subject?: sparqljs.Triple["subject"];
    } & Omit<sparqljs.ConstructQuery, "prefixes" | "queryType" | "type">,
  ): sparqljs.ConstructQuery {
    const { ignoreRdfType, preferredLanguages, subject, ...queryParameters } =
      parameters ?? {};

    return {
      ...queryParameters,
      prefixes: parameters?.prefixes ?? {},
      queryType: "CONSTRUCT",
      template: (queryParameters.template ?? []).concat(
        KosResourceStubStatic.$sparqlConstructTemplateTriples({
          ignoreRdfType,
          subject,
        }),
      ),
      type: "query",
      where: (queryParameters.where ?? []).concat(
        KosResourceStubStatic.$sparqlWherePatterns({
          ignoreRdfType,
          preferredLanguages,
          subject,
        }),
      ),
    };
  }

  export function $sparqlConstructQueryString(
    parameters?: {
      ignoreRdfType?: boolean;
      preferredLanguages?: readonly string[];
      subject?: sparqljs.Triple["subject"];
      variablePrefix?: string;
    } & Omit<sparqljs.ConstructQuery, "prefixes" | "queryType" | "type"> &
      sparqljs.GeneratorOptions,
  ): string {
    return new sparqljs.Generator(parameters).stringify(
      KosResourceStubStatic.$sparqlConstructQuery(parameters),
    );
  }

  export function $sparqlConstructTemplateTriples(parameters?: {
    ignoreRdfType?: boolean;
    subject?: sparqljs.Triple["subject"];
    variablePrefix?: string;
  }): readonly sparqljs.Triple[] {
    const subject =
      parameters?.subject ?? dataFactory.variable!("kosResourceStub");
    const triples: sparqljs.Triple[] = [];
    const variablePrefix =
      parameters?.variablePrefix ??
      (subject.termType === "Variable" ? subject.value : "kosResourceStub");
    triples.push({
      object: dataFactory.variable!(`${variablePrefix}PrefLabel`),
      predicate: KosResourceStubStatic.$properties.prefLabel["identifier"],
      subject,
    });
    triples.push({
      object: dataFactory.variable!(`${variablePrefix}PrefLabelXl`),
      predicate: KosResourceStubStatic.$properties.prefLabelXl["identifier"],
      subject,
    });
    triples.push(
      ...LabelStub.$sparqlConstructTemplateTriples({
        ignoreRdfType: true,
        subject: dataFactory.variable!(`${variablePrefix}PrefLabelXl`),
        variablePrefix: `${variablePrefix}PrefLabelXl`,
      }),
    );
    return triples;
  }

  export function $sparqlWherePatterns(parameters?: {
    ignoreRdfType?: boolean;
    preferredLanguages?: readonly string[];
    subject?: sparqljs.Triple["subject"];
    variablePrefix?: string;
  }): readonly sparqljs.Pattern[] {
    const optionalPatterns: sparqljs.OptionalPattern[] = [];
    const requiredPatterns: sparqljs.Pattern[] = [];
    const subject =
      parameters?.subject ?? dataFactory.variable!("kosResourceStub");
    const variablePrefix =
      parameters?.variablePrefix ??
      (subject.termType === "Variable" ? subject.value : "kosResourceStub");
    const propertyPatterns: readonly sparqljs.Pattern[] = [
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable!(`${variablePrefix}PrefLabel`),
                predicate:
                  KosResourceStubStatic.$properties.prefLabel["identifier"],
                subject,
              },
            ],
            type: "bgp",
          },
          ...[parameters?.preferredLanguages ?? []]
            .filter((languages) => languages.length > 0)
            .map((languages) =>
              languages.map((language) => ({
                type: "operation" as const,
                operator: "=",
                args: [
                  {
                    type: "operation" as const,
                    operator: "lang",
                    args: [dataFactory.variable!(`${variablePrefix}PrefLabel`)],
                  },
                  dataFactory.literal(language),
                ],
              })),
            )
            .map((langEqualsExpressions) => ({
              type: "filter" as const,
              expression: langEqualsExpressions.reduce(
                (reducedExpression, langEqualsExpression) => {
                  if (reducedExpression === null) {
                    return langEqualsExpression;
                  }
                  return {
                    type: "operation" as const,
                    operator: "||",
                    args: [reducedExpression, langEqualsExpression],
                  };
                },
                null as sparqljs.Expression | null,
              ) as sparqljs.Expression,
            })),
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable!(`${variablePrefix}PrefLabelXl`),
                predicate:
                  KosResourceStubStatic.$properties.prefLabelXl["identifier"],
                subject,
              },
            ],
            type: "bgp",
          },
          ...LabelStub.$sparqlWherePatterns({
            ignoreRdfType: true,
            preferredLanguages: parameters?.preferredLanguages,
            subject: dataFactory.variable!(`${variablePrefix}PrefLabelXl`),
            variablePrefix: `${variablePrefix}PrefLabelXl`,
          }),
        ],
        type: "optional",
      },
    ];
    for (const pattern of propertyPatterns) {
      if (pattern.type === "optional") {
        optionalPatterns.push(pattern);
      } else {
        requiredPatterns.push(pattern);
      }
    }

    return requiredPatterns.concat(optionalPatterns);
  }

  export function $toRdf(
    _kosResourceStub: KosResourceStub,
    options?: {
      ignoreRdfType?: boolean;
      mutateGraph?: rdfjsResource.MutableResource.MutateGraph;
      resourceSet?: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource<rdfjs.NamedNode> {
    const mutateGraph = options?.mutateGraph;
    const resourceSet =
      options?.resourceSet ??
      new rdfjsResource.MutableResourceSet({
        dataFactory,
        dataset: datasetFactory.dataset(),
      });
    const resource = resourceSet.mutableNamedResource(
      _kosResourceStub.$identifier,
      { mutateGraph },
    );
    resource.add(
      KosResourceStubStatic.$properties.prefLabel["identifier"],
      ..._kosResourceStub.prefLabel.flatMap((item) => [item]),
    );
    resource.add(
      KosResourceStubStatic.$properties.prefLabelXl["identifier"],
      ..._kosResourceStub.prefLabelXl.flatMap((item) => [
        LabelStub.$toRdf(item, {
          mutateGraph: mutateGraph,
          resourceSet: resourceSet,
        }).identifier,
      ]),
    );
    return resource;
  }
}
export interface ConceptStub extends KosResourceStub {
  readonly $identifier: ConceptStub.$Identifier;
  readonly $type: "ConceptStub";
}

export namespace ConceptStub {
  export function $create(
    parameters: { readonly $identifier: rdfjs.NamedNode | string } & Parameters<
      typeof KosResourceStubStatic.$create
    >[0],
  ): ConceptStub {
    let $identifier: ConceptStub.$Identifier;
    if (typeof parameters.$identifier === "object") {
      $identifier = parameters.$identifier;
    } else if (typeof parameters.$identifier === "string") {
      $identifier = dataFactory.namedNode(parameters.$identifier);
    } else {
      $identifier = parameters.$identifier satisfies never;
    }

    const $type = "ConceptStub" as const;
    return { ...KosResourceStubStatic.$create(parameters), $identifier, $type };
  }

  export function $fromRdf(
    resource: rdfjsResource.Resource,
    options?: {
      [_index: string]: any;
      ignoreRdfType?: boolean;
      objectSet?: $ObjectSet;
      preferredLanguages?: readonly string[];
    },
  ): purify.Either<Error, ConceptStub> {
    let {
      ignoreRdfType = false,
      objectSet,
      preferredLanguages,
      ...context
    } = options ?? {};
    if (!objectSet) {
      objectSet = new $RdfjsDatasetObjectSet({ dataset: resource.dataset });
    }

    return ConceptStub.$propertiesFromRdf({
      ...context,
      ignoreRdfType,
      objectSet,
      preferredLanguages,
      resource,
    });
  }

  export const $fromRdfType: rdfjs.NamedNode<string> = dataFactory.namedNode(
    "http://www.w3.org/2004/02/skos/core#Concept",
  );
  export type $Identifier = KosResourceStubStatic.$Identifier;
  export const $Identifier = KosResourceStubStatic.$Identifier;
  export const $properties = { ...KosResourceStubStatic.$properties };

  export function $propertiesFromRdf({
    ignoreRdfType: $ignoreRdfType,
    objectSet: $objectSet,
    preferredLanguages: $preferredLanguages,
    resource: $resource,
    // @ts-ignore
    ...$context
  }: {
    [_index: string]: any;
    ignoreRdfType: boolean;
    objectSet: $ObjectSet;
    preferredLanguages?: readonly string[];
    resource: rdfjsResource.Resource;
  }): purify.Either<
    Error,
    { $identifier: rdfjs.NamedNode; $type: "ConceptStub" } & $UnwrapR<
      ReturnType<typeof KosResourceStubStatic.$propertiesFromRdf>
    >
  > {
    const $super0Either = KosResourceStubStatic.$propertiesFromRdf({
      ...$context,
      ignoreRdfType: true,
      objectSet: $objectSet,
      preferredLanguages: $preferredLanguages,
      resource: $resource,
    });
    if ($super0Either.isLeft()) {
      return $super0Either;
    }

    const $super0 = $super0Either.unsafeCoerce();
    if (!$ignoreRdfType) {
      const $rdfTypeCheck: purify.Either<Error, true> = $resource
        .value($RdfVocabularies.rdf.type)
        .chain((actualRdfType) => actualRdfType.toIri())
        .chain((actualRdfType) => {
          // Check the expected type and its known subtypes
          switch (actualRdfType.value) {
            case "http://www.w3.org/2004/02/skos/core#Concept":
              return purify.Either.of(true);
          }

          // Check arbitrary rdfs:subClassOf's of the expected type
          if ($resource.isInstanceOf(ConceptStub.$fromRdfType)) {
            return purify.Either.of(true);
          }

          return purify.Left(
            new Error(
              `${rdfjsResource.Resource.Identifier.toString($resource.identifier)} has unexpected RDF type (actual: ${actualRdfType.value}, expected: http://www.w3.org/2004/02/skos/core#Concept)`,
            ),
          );
        });
      if ($rdfTypeCheck.isLeft()) {
        return $rdfTypeCheck;
      }
    }

    if ($resource.identifier.termType !== "NamedNode") {
      return purify.Left(
        new rdfjsResource.Resource.MistypedTermValueError({
          actualValue: $resource.identifier,
          expectedValueType: "(rdfjs.NamedNode)",
          focusResource: $resource,
          predicate: $RdfVocabularies.rdf.subject,
        }),
      );
    }

    const $identifier: ConceptStub.$Identifier = $resource.identifier;
    const $type = "ConceptStub" as const;
    return purify.Either.of({ ...$super0, $identifier, $type });
  }

  export function $sparqlConstructQuery(
    parameters?: {
      ignoreRdfType?: boolean;
      prefixes?: { [prefix: string]: string };
      preferredLanguages?: readonly string[];
      subject?: sparqljs.Triple["subject"];
    } & Omit<sparqljs.ConstructQuery, "prefixes" | "queryType" | "type">,
  ): sparqljs.ConstructQuery {
    const { ignoreRdfType, preferredLanguages, subject, ...queryParameters } =
      parameters ?? {};

    return {
      ...queryParameters,
      prefixes: parameters?.prefixes ?? {},
      queryType: "CONSTRUCT",
      template: (queryParameters.template ?? []).concat(
        ConceptStub.$sparqlConstructTemplateTriples({ ignoreRdfType, subject }),
      ),
      type: "query",
      where: (queryParameters.where ?? []).concat(
        ConceptStub.$sparqlWherePatterns({
          ignoreRdfType,
          preferredLanguages,
          subject,
        }),
      ),
    };
  }

  export function $sparqlConstructQueryString(
    parameters?: {
      ignoreRdfType?: boolean;
      preferredLanguages?: readonly string[];
      subject?: sparqljs.Triple["subject"];
      variablePrefix?: string;
    } & Omit<sparqljs.ConstructQuery, "prefixes" | "queryType" | "type"> &
      sparqljs.GeneratorOptions,
  ): string {
    return new sparqljs.Generator(parameters).stringify(
      ConceptStub.$sparqlConstructQuery(parameters),
    );
  }

  export function $sparqlConstructTemplateTriples(parameters?: {
    ignoreRdfType?: boolean;
    subject?: sparqljs.Triple["subject"];
    variablePrefix?: string;
  }): readonly sparqljs.Triple[] {
    const subject = parameters?.subject ?? dataFactory.variable!("conceptStub");
    const triples: sparqljs.Triple[] = [];
    const variablePrefix =
      parameters?.variablePrefix ??
      (subject.termType === "Variable" ? subject.value : "conceptStub");
    triples.push(
      ...KosResourceStubStatic.$sparqlConstructTemplateTriples({
        ignoreRdfType: true,
        subject,
        variablePrefix,
      }),
    );
    if (!parameters?.ignoreRdfType) {
      triples.push(
        {
          subject,
          predicate: $RdfVocabularies.rdf.type,
          object: dataFactory.variable!(`${variablePrefix}RdfType`),
        },
        {
          subject: dataFactory.variable!(`${variablePrefix}RdfType`),
          predicate: $RdfVocabularies.rdfs.subClassOf,
          object: dataFactory.variable!(`${variablePrefix}RdfClass`),
        },
      );
    }

    return triples;
  }

  export function $sparqlWherePatterns(parameters?: {
    ignoreRdfType?: boolean;
    preferredLanguages?: readonly string[];
    subject?: sparqljs.Triple["subject"];
    variablePrefix?: string;
  }): readonly sparqljs.Pattern[] {
    const optionalPatterns: sparqljs.OptionalPattern[] = [];
    const requiredPatterns: sparqljs.Pattern[] = [];
    const subject = parameters?.subject ?? dataFactory.variable!("conceptStub");
    const variablePrefix =
      parameters?.variablePrefix ??
      (subject.termType === "Variable" ? subject.value : "conceptStub");
    for (const pattern of KosResourceStubStatic.$sparqlWherePatterns({
      ignoreRdfType: true,
      subject,
      variablePrefix,
    })) {
      if (pattern.type === "optional") {
        optionalPatterns.push(pattern);
      } else {
        requiredPatterns.push(pattern);
      }
    }

    const rdfTypeVariable = dataFactory.variable!(`${variablePrefix}RdfType`);
    if (!parameters?.ignoreRdfType) {
      requiredPatterns.push(
        $sparqlInstancesOfPattern({
          rdfType: ConceptStub.$fromRdfType,
          subject,
        }),
        {
          triples: [
            {
              subject,
              predicate: $RdfVocabularies.rdf.type,
              object: rdfTypeVariable,
            },
          ],
          type: "bgp" as const,
        },
      );
      optionalPatterns.push({
        patterns: [
          {
            triples: [
              {
                subject: rdfTypeVariable,
                predicate: {
                  items: [$RdfVocabularies.rdfs.subClassOf],
                  pathType: "+" as const,
                  type: "path" as const,
                },
                object: dataFactory.variable!(`${variablePrefix}RdfClass`),
              },
            ],
            type: "bgp" as const,
          },
        ],
        type: "optional" as const,
      });
    }

    return requiredPatterns.concat(optionalPatterns);
  }

  export function $toRdf(
    _conceptStub: ConceptStub,
    options?: {
      ignoreRdfType?: boolean;
      mutateGraph?: rdfjsResource.MutableResource.MutateGraph;
      resourceSet?: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource<rdfjs.NamedNode> {
    const ignoreRdfType = !!options?.ignoreRdfType;
    const mutateGraph = options?.mutateGraph;
    const resourceSet =
      options?.resourceSet ??
      new rdfjsResource.MutableResourceSet({
        dataFactory,
        dataset: datasetFactory.dataset(),
      });
    const resource = KosResourceStubStatic.$toRdf(_conceptStub, {
      ignoreRdfType: true,
      mutateGraph,
      resourceSet,
    });
    if (!ignoreRdfType) {
      resource.add(
        $RdfVocabularies.rdf.type,
        resource.dataFactory.namedNode(
          "http://kos-kit.github.io/ontology#ConceptStub",
        ),
      );
      resource.add(
        $RdfVocabularies.rdf.type,
        resource.dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#Concept",
        ),
      );
    }

    return resource;
  }

  export function isConceptStub(
    object: KosResourceStub,
  ): object is ConceptStub {
    switch (object.$type) {
      case "ConceptStub":
        return true;
      default:
        return false;
    }
  }
}
export interface ConceptScheme extends KosResource {
  readonly $identifier: ConceptScheme.$Identifier;
  readonly $type: "ConceptScheme";
  readonly hasTopConcept: readonly ConceptStub[];
  readonly license: purify.Maybe<rdfjs.NamedNode | rdfjs.Literal>;
  readonly rights: purify.Maybe<rdfjs.Literal>;
  readonly rightsHolder: purify.Maybe<rdfjs.Literal>;
}

export namespace ConceptScheme {
  export function $create(
    parameters: {
      readonly $identifier: rdfjs.NamedNode | string;
      readonly hasTopConcept?: readonly ConceptStub[];
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
    } & Parameters<typeof KosResourceStatic.$create>[0],
  ): ConceptScheme {
    let $identifier: ConceptScheme.$Identifier;
    if (typeof parameters.$identifier === "object") {
      $identifier = parameters.$identifier;
    } else if (typeof parameters.$identifier === "string") {
      $identifier = dataFactory.namedNode(parameters.$identifier);
    } else {
      $identifier = parameters.$identifier satisfies never;
    }

    const $type = "ConceptScheme" as const;
    let hasTopConcept: readonly ConceptStub[];
    if (typeof parameters.hasTopConcept === "undefined") {
      hasTopConcept = [];
    } else if (typeof parameters.hasTopConcept === "object") {
      hasTopConcept = parameters.hasTopConcept;
    } else {
      hasTopConcept = parameters.hasTopConcept satisfies never;
    }

    let license: purify.Maybe<rdfjs.NamedNode | rdfjs.Literal>;
    if (purify.Maybe.isMaybe(parameters.license)) {
      license = parameters.license;
    } else if (typeof parameters.license === "boolean") {
      license = purify.Maybe.of(
        rdfLiteral.toRdf(parameters.license, { dataFactory }),
      );
    } else if (
      typeof parameters.license === "object" &&
      parameters.license instanceof Date
    ) {
      license = purify.Maybe.of(
        rdfLiteral.toRdf(parameters.license, { dataFactory }),
      );
    } else if (typeof parameters.license === "number") {
      license = purify.Maybe.of(
        rdfLiteral.toRdf(parameters.license, { dataFactory }),
      );
    } else if (typeof parameters.license === "string") {
      license = purify.Maybe.of(dataFactory.literal(parameters.license));
    } else if (typeof parameters.license === "object") {
      license = purify.Maybe.of(parameters.license);
    } else if (typeof parameters.license === "undefined") {
      license = purify.Maybe.empty();
    } else {
      license = parameters.license satisfies never;
    }

    let rights: purify.Maybe<rdfjs.Literal>;
    if (purify.Maybe.isMaybe(parameters.rights)) {
      rights = parameters.rights;
    } else if (typeof parameters.rights === "boolean") {
      rights = purify.Maybe.of(
        rdfLiteral.toRdf(parameters.rights, { dataFactory }),
      );
    } else if (
      typeof parameters.rights === "object" &&
      parameters.rights instanceof Date
    ) {
      rights = purify.Maybe.of(
        rdfLiteral.toRdf(parameters.rights, { dataFactory }),
      );
    } else if (typeof parameters.rights === "number") {
      rights = purify.Maybe.of(
        rdfLiteral.toRdf(parameters.rights, { dataFactory }),
      );
    } else if (typeof parameters.rights === "string") {
      rights = purify.Maybe.of(dataFactory.literal(parameters.rights));
    } else if (typeof parameters.rights === "object") {
      rights = purify.Maybe.of(parameters.rights);
    } else if (typeof parameters.rights === "undefined") {
      rights = purify.Maybe.empty();
    } else {
      rights = parameters.rights satisfies never;
    }

    let rightsHolder: purify.Maybe<rdfjs.Literal>;
    if (purify.Maybe.isMaybe(parameters.rightsHolder)) {
      rightsHolder = parameters.rightsHolder;
    } else if (typeof parameters.rightsHolder === "boolean") {
      rightsHolder = purify.Maybe.of(
        rdfLiteral.toRdf(parameters.rightsHolder, { dataFactory }),
      );
    } else if (
      typeof parameters.rightsHolder === "object" &&
      parameters.rightsHolder instanceof Date
    ) {
      rightsHolder = purify.Maybe.of(
        rdfLiteral.toRdf(parameters.rightsHolder, { dataFactory }),
      );
    } else if (typeof parameters.rightsHolder === "number") {
      rightsHolder = purify.Maybe.of(
        rdfLiteral.toRdf(parameters.rightsHolder, { dataFactory }),
      );
    } else if (typeof parameters.rightsHolder === "string") {
      rightsHolder = purify.Maybe.of(
        dataFactory.literal(parameters.rightsHolder),
      );
    } else if (typeof parameters.rightsHolder === "object") {
      rightsHolder = purify.Maybe.of(parameters.rightsHolder);
    } else if (typeof parameters.rightsHolder === "undefined") {
      rightsHolder = purify.Maybe.empty();
    } else {
      rightsHolder = parameters.rightsHolder satisfies never;
    }

    return {
      ...KosResourceStatic.$create(parameters),
      $identifier,
      $type,
      hasTopConcept,
      license,
      rights,
      rightsHolder,
    };
  }

  export function $fromRdf(
    resource: rdfjsResource.Resource,
    options?: {
      [_index: string]: any;
      ignoreRdfType?: boolean;
      objectSet?: $ObjectSet;
      preferredLanguages?: readonly string[];
    },
  ): purify.Either<Error, ConceptScheme> {
    let {
      ignoreRdfType = false,
      objectSet,
      preferredLanguages,
      ...context
    } = options ?? {};
    if (!objectSet) {
      objectSet = new $RdfjsDatasetObjectSet({ dataset: resource.dataset });
    }

    return ConceptScheme.$propertiesFromRdf({
      ...context,
      ignoreRdfType,
      objectSet,
      preferredLanguages,
      resource,
    });
  }

  export const $fromRdfType: rdfjs.NamedNode<string> = dataFactory.namedNode(
    "http://www.w3.org/2004/02/skos/core#ConceptScheme",
  );
  export type $Identifier = KosResourceStatic.$Identifier;
  export const $Identifier = KosResourceStatic.$Identifier;
  export const $properties = {
    ...KosResourceStatic.$properties,
    hasTopConcept: {
      identifier: dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#hasTopConcept",
      ),
    },
    license: {
      identifier: dataFactory.namedNode("http://purl.org/dc/terms/license"),
    },
    rights: {
      identifier: dataFactory.namedNode("http://purl.org/dc/terms/rights"),
    },
    rightsHolder: {
      identifier: dataFactory.namedNode(
        "http://purl.org/dc/terms/rightsHolder",
      ),
    },
  };

  export function $propertiesFromRdf({
    ignoreRdfType: $ignoreRdfType,
    objectSet: $objectSet,
    preferredLanguages: $preferredLanguages,
    resource: $resource,
    // @ts-ignore
    ...$context
  }: {
    [_index: string]: any;
    ignoreRdfType: boolean;
    objectSet: $ObjectSet;
    preferredLanguages?: readonly string[];
    resource: rdfjsResource.Resource;
  }): purify.Either<
    Error,
    {
      $identifier: rdfjs.NamedNode;
      $type: "ConceptScheme";
      hasTopConcept: readonly ConceptStub[];
      license: purify.Maybe<rdfjs.NamedNode | rdfjs.Literal>;
      rights: purify.Maybe<rdfjs.Literal>;
      rightsHolder: purify.Maybe<rdfjs.Literal>;
    } & $UnwrapR<ReturnType<typeof KosResourceStatic.$propertiesFromRdf>>
  > {
    const $super0Either = KosResourceStatic.$propertiesFromRdf({
      ...$context,
      ignoreRdfType: true,
      objectSet: $objectSet,
      preferredLanguages: $preferredLanguages,
      resource: $resource,
    });
    if ($super0Either.isLeft()) {
      return $super0Either;
    }

    const $super0 = $super0Either.unsafeCoerce();
    if (!$ignoreRdfType) {
      const $rdfTypeCheck: purify.Either<Error, true> = $resource
        .value($RdfVocabularies.rdf.type)
        .chain((actualRdfType) => actualRdfType.toIri())
        .chain((actualRdfType) => {
          // Check the expected type and its known subtypes
          switch (actualRdfType.value) {
            case "http://www.w3.org/2004/02/skos/core#ConceptScheme":
              return purify.Either.of(true);
          }

          // Check arbitrary rdfs:subClassOf's of the expected type
          if ($resource.isInstanceOf(ConceptScheme.$fromRdfType)) {
            return purify.Either.of(true);
          }

          return purify.Left(
            new Error(
              `${rdfjsResource.Resource.Identifier.toString($resource.identifier)} has unexpected RDF type (actual: ${actualRdfType.value}, expected: http://www.w3.org/2004/02/skos/core#ConceptScheme)`,
            ),
          );
        });
      if ($rdfTypeCheck.isLeft()) {
        return $rdfTypeCheck;
      }
    }

    if ($resource.identifier.termType !== "NamedNode") {
      return purify.Left(
        new rdfjsResource.Resource.MistypedTermValueError({
          actualValue: $resource.identifier,
          expectedValueType: "(rdfjs.NamedNode)",
          focusResource: $resource,
          predicate: $RdfVocabularies.rdf.subject,
        }),
      );
    }

    const $identifier: ConceptScheme.$Identifier = $resource.identifier;
    const $type = "ConceptScheme" as const;
    const _hasTopConceptEither: purify.Either<Error, readonly ConceptStub[]> =
      purify.Either.of<
        Error,
        rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
      >(
        $resource.values($properties.hasTopConcept["identifier"], {
          unique: true,
        }),
      )
        .chain((values) =>
          values.chainMap((value) =>
            value.toResource().chain((resource) =>
              ConceptStub.$fromRdf(resource, {
                ...$context,
                ignoreRdfType: true,
                objectSet: $objectSet,
                preferredLanguages: $preferredLanguages,
              }),
            ),
          ),
        )
        .map((values) => values.toArray())
        .map((valuesArray) =>
          rdfjsResource.Resource.Values.fromValue({
            focusResource: $resource,
            predicate: ConceptScheme.$properties.hasTopConcept["identifier"],
            value: valuesArray,
          }),
        )
        .chain((values) => values.head());
    if (_hasTopConceptEither.isLeft()) {
      return _hasTopConceptEither;
    }

    const hasTopConcept = _hasTopConceptEither.unsafeCoerce();
    const _licenseEither: purify.Either<
      Error,
      purify.Maybe<rdfjs.NamedNode | rdfjs.Literal>
    > = purify.Either.of<
      Error,
      rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
    >($resource.values($properties.license["identifier"], { unique: true }))
      .chain((values) =>
        values.chainMap((value) =>
          purify.Either.of<
            Error,
            rdfjs.BlankNode | rdfjs.Literal | rdfjs.NamedNode
          >(value.toTerm()).chain((term) => {
            switch (term.termType) {
              case "NamedNode":
              case "Literal":
                return purify.Either.of<Error, rdfjs.NamedNode | rdfjs.Literal>(
                  term,
                );
              default:
                return purify.Left<Error, rdfjs.NamedNode | rdfjs.Literal>(
                  new rdfjsResource.Resource.MistypedTermValueError({
                    actualValue: term,
                    expectedValueType: "(rdfjs.NamedNode | rdfjs.Literal)",
                    focusResource: $resource,
                    predicate: ConceptScheme.$properties.license["identifier"],
                  }),
                );
            }
          }),
        ),
      )
      .map((values) =>
        values.length > 0
          ? values.map((value) => purify.Maybe.of(value))
          : rdfjsResource.Resource.Values.fromValue<
              purify.Maybe<rdfjs.NamedNode | rdfjs.Literal>
            >({
              focusResource: $resource,
              predicate: ConceptScheme.$properties.license["identifier"],
              value: purify.Maybe.empty(),
            }),
      )
      .chain((values) => values.head());
    if (_licenseEither.isLeft()) {
      return _licenseEither;
    }

    const license = _licenseEither.unsafeCoerce();
    const _rightsEither: purify.Either<
      Error,
      purify.Maybe<rdfjs.Literal>
    > = purify.Either.of<
      Error,
      rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
    >($resource.values($properties.rights["identifier"], { unique: true }))
      .chain((values) => {
        if (!$preferredLanguages || $preferredLanguages.length === 0) {
          return purify.Either.of<
            Error,
            rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
          >(values);
        }

        const literalValuesEither = values.chainMap((value) =>
          value.toLiteral(),
        );
        if (literalValuesEither.isLeft()) {
          return literalValuesEither;
        }
        const literalValues = literalValuesEither.unsafeCoerce();

        // Return all literals for the first preferredLanguage, then all literals for the second preferredLanguage, etc.
        // Within a preferredLanguage the literals may be in any order.
        let filteredLiteralValues:
          | rdfjsResource.Resource.Values<rdfjs.Literal>
          | undefined;
        for (const preferredLanguage of $preferredLanguages) {
          if (!filteredLiteralValues) {
            filteredLiteralValues = literalValues.filter(
              (value) => value.language === preferredLanguage,
            );
          } else {
            filteredLiteralValues = filteredLiteralValues.concat(
              ...literalValues
                .filter((value) => value.language === preferredLanguage)
                .toArray(),
            );
          }
        }

        return purify.Either.of<
          Error,
          rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
        >(
          filteredLiteralValues!.map(
            (literalValue) =>
              new rdfjsResource.Resource.TermValue({
                focusResource: $resource,
                predicate: ConceptScheme.$properties.rights["identifier"],
                term: literalValue,
              }),
          ),
        );
      })
      .chain((values) => values.chainMap((value) => value.toLiteral()))
      .map((values) =>
        values.length > 0
          ? values.map((value) => purify.Maybe.of(value))
          : rdfjsResource.Resource.Values.fromValue<
              purify.Maybe<rdfjs.Literal>
            >({
              focusResource: $resource,
              predicate: ConceptScheme.$properties.rights["identifier"],
              value: purify.Maybe.empty(),
            }),
      )
      .chain((values) => values.head());
    if (_rightsEither.isLeft()) {
      return _rightsEither;
    }

    const rights = _rightsEither.unsafeCoerce();
    const _rightsHolderEither: purify.Either<
      Error,
      purify.Maybe<rdfjs.Literal>
    > = purify.Either.of<
      Error,
      rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
    >(
      $resource.values($properties.rightsHolder["identifier"], {
        unique: true,
      }),
    )
      .chain((values) => {
        if (!$preferredLanguages || $preferredLanguages.length === 0) {
          return purify.Either.of<
            Error,
            rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
          >(values);
        }

        const literalValuesEither = values.chainMap((value) =>
          value.toLiteral(),
        );
        if (literalValuesEither.isLeft()) {
          return literalValuesEither;
        }
        const literalValues = literalValuesEither.unsafeCoerce();

        // Return all literals for the first preferredLanguage, then all literals for the second preferredLanguage, etc.
        // Within a preferredLanguage the literals may be in any order.
        let filteredLiteralValues:
          | rdfjsResource.Resource.Values<rdfjs.Literal>
          | undefined;
        for (const preferredLanguage of $preferredLanguages) {
          if (!filteredLiteralValues) {
            filteredLiteralValues = literalValues.filter(
              (value) => value.language === preferredLanguage,
            );
          } else {
            filteredLiteralValues = filteredLiteralValues.concat(
              ...literalValues
                .filter((value) => value.language === preferredLanguage)
                .toArray(),
            );
          }
        }

        return purify.Either.of<
          Error,
          rdfjsResource.Resource.Values<rdfjsResource.Resource.TermValue>
        >(
          filteredLiteralValues!.map(
            (literalValue) =>
              new rdfjsResource.Resource.TermValue({
                focusResource: $resource,
                predicate: ConceptScheme.$properties.rightsHolder["identifier"],
                term: literalValue,
              }),
          ),
        );
      })
      .chain((values) => values.chainMap((value) => value.toLiteral()))
      .map((values) =>
        values.length > 0
          ? values.map((value) => purify.Maybe.of(value))
          : rdfjsResource.Resource.Values.fromValue<
              purify.Maybe<rdfjs.Literal>
            >({
              focusResource: $resource,
              predicate: ConceptScheme.$properties.rightsHolder["identifier"],
              value: purify.Maybe.empty(),
            }),
      )
      .chain((values) => values.head());
    if (_rightsHolderEither.isLeft()) {
      return _rightsHolderEither;
    }

    const rightsHolder = _rightsHolderEither.unsafeCoerce();
    return purify.Either.of({
      ...$super0,
      $identifier,
      $type,
      hasTopConcept,
      license,
      rights,
      rightsHolder,
    });
  }

  export function $sparqlConstructQuery(
    parameters?: {
      ignoreRdfType?: boolean;
      prefixes?: { [prefix: string]: string };
      preferredLanguages?: readonly string[];
      subject?: sparqljs.Triple["subject"];
    } & Omit<sparqljs.ConstructQuery, "prefixes" | "queryType" | "type">,
  ): sparqljs.ConstructQuery {
    const { ignoreRdfType, preferredLanguages, subject, ...queryParameters } =
      parameters ?? {};

    return {
      ...queryParameters,
      prefixes: parameters?.prefixes ?? {},
      queryType: "CONSTRUCT",
      template: (queryParameters.template ?? []).concat(
        ConceptScheme.$sparqlConstructTemplateTriples({
          ignoreRdfType,
          subject,
        }),
      ),
      type: "query",
      where: (queryParameters.where ?? []).concat(
        ConceptScheme.$sparqlWherePatterns({
          ignoreRdfType,
          preferredLanguages,
          subject,
        }),
      ),
    };
  }

  export function $sparqlConstructQueryString(
    parameters?: {
      ignoreRdfType?: boolean;
      preferredLanguages?: readonly string[];
      subject?: sparqljs.Triple["subject"];
      variablePrefix?: string;
    } & Omit<sparqljs.ConstructQuery, "prefixes" | "queryType" | "type"> &
      sparqljs.GeneratorOptions,
  ): string {
    return new sparqljs.Generator(parameters).stringify(
      ConceptScheme.$sparqlConstructQuery(parameters),
    );
  }

  export function $sparqlConstructTemplateTriples(parameters?: {
    ignoreRdfType?: boolean;
    subject?: sparqljs.Triple["subject"];
    variablePrefix?: string;
  }): readonly sparqljs.Triple[] {
    const subject =
      parameters?.subject ?? dataFactory.variable!("conceptScheme");
    const triples: sparqljs.Triple[] = [];
    const variablePrefix =
      parameters?.variablePrefix ??
      (subject.termType === "Variable" ? subject.value : "conceptScheme");
    triples.push(
      ...KosResourceStatic.$sparqlConstructTemplateTriples({
        ignoreRdfType: true,
        subject,
        variablePrefix,
      }),
    );
    if (!parameters?.ignoreRdfType) {
      triples.push(
        {
          subject,
          predicate: $RdfVocabularies.rdf.type,
          object: dataFactory.variable!(`${variablePrefix}RdfType`),
        },
        {
          subject: dataFactory.variable!(`${variablePrefix}RdfType`),
          predicate: $RdfVocabularies.rdfs.subClassOf,
          object: dataFactory.variable!(`${variablePrefix}RdfClass`),
        },
      );
    }

    triples.push({
      object: dataFactory.variable!(`${variablePrefix}HasTopConcept`),
      predicate: ConceptScheme.$properties.hasTopConcept["identifier"],
      subject,
    });
    triples.push(
      ...ConceptStub.$sparqlConstructTemplateTriples({
        ignoreRdfType: true,
        subject: dataFactory.variable!(`${variablePrefix}HasTopConcept`),
        variablePrefix: `${variablePrefix}HasTopConcept`,
      }),
    );
    triples.push({
      object: dataFactory.variable!(`${variablePrefix}License`),
      predicate: ConceptScheme.$properties.license["identifier"],
      subject,
    });
    triples.push({
      object: dataFactory.variable!(`${variablePrefix}Rights`),
      predicate: ConceptScheme.$properties.rights["identifier"],
      subject,
    });
    triples.push({
      object: dataFactory.variable!(`${variablePrefix}RightsHolder`),
      predicate: ConceptScheme.$properties.rightsHolder["identifier"],
      subject,
    });
    return triples;
  }

  export function $sparqlWherePatterns(parameters?: {
    ignoreRdfType?: boolean;
    preferredLanguages?: readonly string[];
    subject?: sparqljs.Triple["subject"];
    variablePrefix?: string;
  }): readonly sparqljs.Pattern[] {
    const optionalPatterns: sparqljs.OptionalPattern[] = [];
    const requiredPatterns: sparqljs.Pattern[] = [];
    const subject =
      parameters?.subject ?? dataFactory.variable!("conceptScheme");
    const variablePrefix =
      parameters?.variablePrefix ??
      (subject.termType === "Variable" ? subject.value : "conceptScheme");
    for (const pattern of KosResourceStatic.$sparqlWherePatterns({
      ignoreRdfType: true,
      subject,
      variablePrefix,
    })) {
      if (pattern.type === "optional") {
        optionalPatterns.push(pattern);
      } else {
        requiredPatterns.push(pattern);
      }
    }

    const rdfTypeVariable = dataFactory.variable!(`${variablePrefix}RdfType`);
    if (!parameters?.ignoreRdfType) {
      requiredPatterns.push(
        $sparqlInstancesOfPattern({
          rdfType: ConceptScheme.$fromRdfType,
          subject,
        }),
        {
          triples: [
            {
              subject,
              predicate: $RdfVocabularies.rdf.type,
              object: rdfTypeVariable,
            },
          ],
          type: "bgp" as const,
        },
      );
      optionalPatterns.push({
        patterns: [
          {
            triples: [
              {
                subject: rdfTypeVariable,
                predicate: {
                  items: [$RdfVocabularies.rdfs.subClassOf],
                  pathType: "+" as const,
                  type: "path" as const,
                },
                object: dataFactory.variable!(`${variablePrefix}RdfClass`),
              },
            ],
            type: "bgp" as const,
          },
        ],
        type: "optional" as const,
      });
    }

    const propertyPatterns: readonly sparqljs.Pattern[] = [
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable!(`${variablePrefix}HasTopConcept`),
                predicate:
                  ConceptScheme.$properties.hasTopConcept["identifier"],
                subject,
              },
            ],
            type: "bgp",
          },
          ...ConceptStub.$sparqlWherePatterns({
            ignoreRdfType: true,
            preferredLanguages: parameters?.preferredLanguages,
            subject: dataFactory.variable!(`${variablePrefix}HasTopConcept`),
            variablePrefix: `${variablePrefix}HasTopConcept`,
          }),
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable!(`${variablePrefix}License`),
                predicate: ConceptScheme.$properties.license["identifier"],
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
                object: dataFactory.variable!(`${variablePrefix}Rights`),
                predicate: ConceptScheme.$properties.rights["identifier"],
                subject,
              },
            ],
            type: "bgp",
          },
          ...[parameters?.preferredLanguages ?? []]
            .filter((languages) => languages.length > 0)
            .map((languages) =>
              languages.map((language) => ({
                type: "operation" as const,
                operator: "=",
                args: [
                  {
                    type: "operation" as const,
                    operator: "lang",
                    args: [dataFactory.variable!(`${variablePrefix}Rights`)],
                  },
                  dataFactory.literal(language),
                ],
              })),
            )
            .map((langEqualsExpressions) => ({
              type: "filter" as const,
              expression: langEqualsExpressions.reduce(
                (reducedExpression, langEqualsExpression) => {
                  if (reducedExpression === null) {
                    return langEqualsExpression;
                  }
                  return {
                    type: "operation" as const,
                    operator: "||",
                    args: [reducedExpression, langEqualsExpression],
                  };
                },
                null as sparqljs.Expression | null,
              ) as sparqljs.Expression,
            })),
        ],
        type: "optional",
      },
      {
        patterns: [
          {
            triples: [
              {
                object: dataFactory.variable!(`${variablePrefix}RightsHolder`),
                predicate: ConceptScheme.$properties.rightsHolder["identifier"],
                subject,
              },
            ],
            type: "bgp",
          },
          ...[parameters?.preferredLanguages ?? []]
            .filter((languages) => languages.length > 0)
            .map((languages) =>
              languages.map((language) => ({
                type: "operation" as const,
                operator: "=",
                args: [
                  {
                    type: "operation" as const,
                    operator: "lang",
                    args: [
                      dataFactory.variable!(`${variablePrefix}RightsHolder`),
                    ],
                  },
                  dataFactory.literal(language),
                ],
              })),
            )
            .map((langEqualsExpressions) => ({
              type: "filter" as const,
              expression: langEqualsExpressions.reduce(
                (reducedExpression, langEqualsExpression) => {
                  if (reducedExpression === null) {
                    return langEqualsExpression;
                  }
                  return {
                    type: "operation" as const,
                    operator: "||",
                    args: [reducedExpression, langEqualsExpression],
                  };
                },
                null as sparqljs.Expression | null,
              ) as sparqljs.Expression,
            })),
        ],
        type: "optional",
      },
    ];
    for (const pattern of propertyPatterns) {
      if (pattern.type === "optional") {
        optionalPatterns.push(pattern);
      } else {
        requiredPatterns.push(pattern);
      }
    }

    return requiredPatterns.concat(optionalPatterns);
  }

  export function $toRdf(
    _conceptScheme: ConceptScheme,
    options?: {
      ignoreRdfType?: boolean;
      mutateGraph?: rdfjsResource.MutableResource.MutateGraph;
      resourceSet?: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource<rdfjs.NamedNode> {
    const ignoreRdfType = !!options?.ignoreRdfType;
    const mutateGraph = options?.mutateGraph;
    const resourceSet =
      options?.resourceSet ??
      new rdfjsResource.MutableResourceSet({
        dataFactory,
        dataset: datasetFactory.dataset(),
      });
    const resource = KosResourceStatic.$toRdf(_conceptScheme, {
      ignoreRdfType: true,
      mutateGraph,
      resourceSet,
    });
    if (!ignoreRdfType) {
      resource.add(
        $RdfVocabularies.rdf.type,
        resource.dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#ConceptScheme",
        ),
      );
    }

    resource.add(
      ConceptScheme.$properties.hasTopConcept["identifier"],
      ..._conceptScheme.hasTopConcept.flatMap((item) => [
        ConceptStub.$toRdf(item, {
          mutateGraph: mutateGraph,
          resourceSet: resourceSet,
        }).identifier,
      ]),
    );
    resource.add(
      ConceptScheme.$properties.license["identifier"],
      ..._conceptScheme.license.toList(),
    );
    resource.add(
      ConceptScheme.$properties.rights["identifier"],
      ..._conceptScheme.rights.toList(),
    );
    resource.add(
      ConceptScheme.$properties.rightsHolder["identifier"],
      ..._conceptScheme.rightsHolder.toList(),
    );
    return resource;
  }

  export function isConceptScheme(
    object: KosResource,
  ): object is ConceptScheme {
    switch (object.$type) {
      case "ConceptScheme":
        return true;
      default:
        return false;
    }
  }
}
export interface ConceptSchemeStub extends KosResourceStub {
  readonly $identifier: ConceptSchemeStub.$Identifier;
  readonly $type: "ConceptSchemeStub";
}

export namespace ConceptSchemeStub {
  export function $create(
    parameters: { readonly $identifier: rdfjs.NamedNode | string } & Parameters<
      typeof KosResourceStubStatic.$create
    >[0],
  ): ConceptSchemeStub {
    let $identifier: ConceptSchemeStub.$Identifier;
    if (typeof parameters.$identifier === "object") {
      $identifier = parameters.$identifier;
    } else if (typeof parameters.$identifier === "string") {
      $identifier = dataFactory.namedNode(parameters.$identifier);
    } else {
      $identifier = parameters.$identifier satisfies never;
    }

    const $type = "ConceptSchemeStub" as const;
    return { ...KosResourceStubStatic.$create(parameters), $identifier, $type };
  }

  export function $fromRdf(
    resource: rdfjsResource.Resource,
    options?: {
      [_index: string]: any;
      ignoreRdfType?: boolean;
      objectSet?: $ObjectSet;
      preferredLanguages?: readonly string[];
    },
  ): purify.Either<Error, ConceptSchemeStub> {
    let {
      ignoreRdfType = false,
      objectSet,
      preferredLanguages,
      ...context
    } = options ?? {};
    if (!objectSet) {
      objectSet = new $RdfjsDatasetObjectSet({ dataset: resource.dataset });
    }

    return ConceptSchemeStub.$propertiesFromRdf({
      ...context,
      ignoreRdfType,
      objectSet,
      preferredLanguages,
      resource,
    });
  }

  export const $fromRdfType: rdfjs.NamedNode<string> = dataFactory.namedNode(
    "http://www.w3.org/2004/02/skos/core#ConceptScheme",
  );
  export type $Identifier = KosResourceStubStatic.$Identifier;
  export const $Identifier = KosResourceStubStatic.$Identifier;
  export const $properties = { ...KosResourceStubStatic.$properties };

  export function $propertiesFromRdf({
    ignoreRdfType: $ignoreRdfType,
    objectSet: $objectSet,
    preferredLanguages: $preferredLanguages,
    resource: $resource,
    // @ts-ignore
    ...$context
  }: {
    [_index: string]: any;
    ignoreRdfType: boolean;
    objectSet: $ObjectSet;
    preferredLanguages?: readonly string[];
    resource: rdfjsResource.Resource;
  }): purify.Either<
    Error,
    { $identifier: rdfjs.NamedNode; $type: "ConceptSchemeStub" } & $UnwrapR<
      ReturnType<typeof KosResourceStubStatic.$propertiesFromRdf>
    >
  > {
    const $super0Either = KosResourceStubStatic.$propertiesFromRdf({
      ...$context,
      ignoreRdfType: true,
      objectSet: $objectSet,
      preferredLanguages: $preferredLanguages,
      resource: $resource,
    });
    if ($super0Either.isLeft()) {
      return $super0Either;
    }

    const $super0 = $super0Either.unsafeCoerce();
    if (!$ignoreRdfType) {
      const $rdfTypeCheck: purify.Either<Error, true> = $resource
        .value($RdfVocabularies.rdf.type)
        .chain((actualRdfType) => actualRdfType.toIri())
        .chain((actualRdfType) => {
          // Check the expected type and its known subtypes
          switch (actualRdfType.value) {
            case "http://www.w3.org/2004/02/skos/core#ConceptScheme":
              return purify.Either.of(true);
          }

          // Check arbitrary rdfs:subClassOf's of the expected type
          if ($resource.isInstanceOf(ConceptSchemeStub.$fromRdfType)) {
            return purify.Either.of(true);
          }

          return purify.Left(
            new Error(
              `${rdfjsResource.Resource.Identifier.toString($resource.identifier)} has unexpected RDF type (actual: ${actualRdfType.value}, expected: http://www.w3.org/2004/02/skos/core#ConceptScheme)`,
            ),
          );
        });
      if ($rdfTypeCheck.isLeft()) {
        return $rdfTypeCheck;
      }
    }

    if ($resource.identifier.termType !== "NamedNode") {
      return purify.Left(
        new rdfjsResource.Resource.MistypedTermValueError({
          actualValue: $resource.identifier,
          expectedValueType: "(rdfjs.NamedNode)",
          focusResource: $resource,
          predicate: $RdfVocabularies.rdf.subject,
        }),
      );
    }

    const $identifier: ConceptSchemeStub.$Identifier = $resource.identifier;
    const $type = "ConceptSchemeStub" as const;
    return purify.Either.of({ ...$super0, $identifier, $type });
  }

  export function $sparqlConstructQuery(
    parameters?: {
      ignoreRdfType?: boolean;
      prefixes?: { [prefix: string]: string };
      preferredLanguages?: readonly string[];
      subject?: sparqljs.Triple["subject"];
    } & Omit<sparqljs.ConstructQuery, "prefixes" | "queryType" | "type">,
  ): sparqljs.ConstructQuery {
    const { ignoreRdfType, preferredLanguages, subject, ...queryParameters } =
      parameters ?? {};

    return {
      ...queryParameters,
      prefixes: parameters?.prefixes ?? {},
      queryType: "CONSTRUCT",
      template: (queryParameters.template ?? []).concat(
        ConceptSchemeStub.$sparqlConstructTemplateTriples({
          ignoreRdfType,
          subject,
        }),
      ),
      type: "query",
      where: (queryParameters.where ?? []).concat(
        ConceptSchemeStub.$sparqlWherePatterns({
          ignoreRdfType,
          preferredLanguages,
          subject,
        }),
      ),
    };
  }

  export function $sparqlConstructQueryString(
    parameters?: {
      ignoreRdfType?: boolean;
      preferredLanguages?: readonly string[];
      subject?: sparqljs.Triple["subject"];
      variablePrefix?: string;
    } & Omit<sparqljs.ConstructQuery, "prefixes" | "queryType" | "type"> &
      sparqljs.GeneratorOptions,
  ): string {
    return new sparqljs.Generator(parameters).stringify(
      ConceptSchemeStub.$sparqlConstructQuery(parameters),
    );
  }

  export function $sparqlConstructTemplateTriples(parameters?: {
    ignoreRdfType?: boolean;
    subject?: sparqljs.Triple["subject"];
    variablePrefix?: string;
  }): readonly sparqljs.Triple[] {
    const subject =
      parameters?.subject ?? dataFactory.variable!("conceptSchemeStub");
    const triples: sparqljs.Triple[] = [];
    const variablePrefix =
      parameters?.variablePrefix ??
      (subject.termType === "Variable" ? subject.value : "conceptSchemeStub");
    triples.push(
      ...KosResourceStubStatic.$sparqlConstructTemplateTriples({
        ignoreRdfType: true,
        subject,
        variablePrefix,
      }),
    );
    if (!parameters?.ignoreRdfType) {
      triples.push(
        {
          subject,
          predicate: $RdfVocabularies.rdf.type,
          object: dataFactory.variable!(`${variablePrefix}RdfType`),
        },
        {
          subject: dataFactory.variable!(`${variablePrefix}RdfType`),
          predicate: $RdfVocabularies.rdfs.subClassOf,
          object: dataFactory.variable!(`${variablePrefix}RdfClass`),
        },
      );
    }

    return triples;
  }

  export function $sparqlWherePatterns(parameters?: {
    ignoreRdfType?: boolean;
    preferredLanguages?: readonly string[];
    subject?: sparqljs.Triple["subject"];
    variablePrefix?: string;
  }): readonly sparqljs.Pattern[] {
    const optionalPatterns: sparqljs.OptionalPattern[] = [];
    const requiredPatterns: sparqljs.Pattern[] = [];
    const subject =
      parameters?.subject ?? dataFactory.variable!("conceptSchemeStub");
    const variablePrefix =
      parameters?.variablePrefix ??
      (subject.termType === "Variable" ? subject.value : "conceptSchemeStub");
    for (const pattern of KosResourceStubStatic.$sparqlWherePatterns({
      ignoreRdfType: true,
      subject,
      variablePrefix,
    })) {
      if (pattern.type === "optional") {
        optionalPatterns.push(pattern);
      } else {
        requiredPatterns.push(pattern);
      }
    }

    const rdfTypeVariable = dataFactory.variable!(`${variablePrefix}RdfType`);
    if (!parameters?.ignoreRdfType) {
      requiredPatterns.push(
        $sparqlInstancesOfPattern({
          rdfType: ConceptSchemeStub.$fromRdfType,
          subject,
        }),
        {
          triples: [
            {
              subject,
              predicate: $RdfVocabularies.rdf.type,
              object: rdfTypeVariable,
            },
          ],
          type: "bgp" as const,
        },
      );
      optionalPatterns.push({
        patterns: [
          {
            triples: [
              {
                subject: rdfTypeVariable,
                predicate: {
                  items: [$RdfVocabularies.rdfs.subClassOf],
                  pathType: "+" as const,
                  type: "path" as const,
                },
                object: dataFactory.variable!(`${variablePrefix}RdfClass`),
              },
            ],
            type: "bgp" as const,
          },
        ],
        type: "optional" as const,
      });
    }

    return requiredPatterns.concat(optionalPatterns);
  }

  export function $toRdf(
    _conceptSchemeStub: ConceptSchemeStub,
    options?: {
      ignoreRdfType?: boolean;
      mutateGraph?: rdfjsResource.MutableResource.MutateGraph;
      resourceSet?: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource<rdfjs.NamedNode> {
    const ignoreRdfType = !!options?.ignoreRdfType;
    const mutateGraph = options?.mutateGraph;
    const resourceSet =
      options?.resourceSet ??
      new rdfjsResource.MutableResourceSet({
        dataFactory,
        dataset: datasetFactory.dataset(),
      });
    const resource = KosResourceStubStatic.$toRdf(_conceptSchemeStub, {
      ignoreRdfType: true,
      mutateGraph,
      resourceSet,
    });
    if (!ignoreRdfType) {
      resource.add(
        $RdfVocabularies.rdf.type,
        resource.dataFactory.namedNode(
          "http://kos-kit.github.io/ontology#ConceptSchemeStub",
        ),
      );
      resource.add(
        $RdfVocabularies.rdf.type,
        resource.dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#ConceptScheme",
        ),
      );
    }

    return resource;
  }

  export function isConceptSchemeStub(
    object: KosResourceStub,
  ): object is ConceptSchemeStub {
    switch (object.$type) {
      case "ConceptSchemeStub":
        return true;
      default:
        return false;
    }
  }
}
export interface $ObjectSet {
  concept(
    identifier: Concept.$Identifier,
  ): Promise<purify.Either<Error, Concept>>;
  conceptIdentifiers(
    query?: $ObjectSet.Query<Concept.$Identifier>,
  ): Promise<purify.Either<Error, readonly Concept.$Identifier[]>>;
  concepts(
    query?: $ObjectSet.Query<Concept.$Identifier>,
  ): Promise<purify.Either<Error, readonly Concept[]>>;
  conceptsCount(
    query?: Pick<$ObjectSet.Query<Concept.$Identifier>, "where">,
  ): Promise<purify.Either<Error, number>>;
  conceptScheme(
    identifier: ConceptScheme.$Identifier,
  ): Promise<purify.Either<Error, ConceptScheme>>;
  conceptSchemeIdentifiers(
    query?: $ObjectSet.Query<ConceptScheme.$Identifier>,
  ): Promise<purify.Either<Error, readonly ConceptScheme.$Identifier[]>>;
  conceptSchemes(
    query?: $ObjectSet.Query<ConceptScheme.$Identifier>,
  ): Promise<purify.Either<Error, readonly ConceptScheme[]>>;
  conceptSchemesCount(
    query?: Pick<$ObjectSet.Query<ConceptScheme.$Identifier>, "where">,
  ): Promise<purify.Either<Error, number>>;
  conceptSchemeStub(
    identifier: ConceptSchemeStub.$Identifier,
  ): Promise<purify.Either<Error, ConceptSchemeStub>>;
  conceptSchemeStubIdentifiers(
    query?: $ObjectSet.Query<ConceptSchemeStub.$Identifier>,
  ): Promise<purify.Either<Error, readonly ConceptSchemeStub.$Identifier[]>>;
  conceptSchemeStubs(
    query?: $ObjectSet.Query<ConceptSchemeStub.$Identifier>,
  ): Promise<purify.Either<Error, readonly ConceptSchemeStub[]>>;
  conceptSchemeStubsCount(
    query?: Pick<$ObjectSet.Query<ConceptSchemeStub.$Identifier>, "where">,
  ): Promise<purify.Either<Error, number>>;
  conceptStub(
    identifier: ConceptStub.$Identifier,
  ): Promise<purify.Either<Error, ConceptStub>>;
  conceptStubIdentifiers(
    query?: $ObjectSet.Query<ConceptStub.$Identifier>,
  ): Promise<purify.Either<Error, readonly ConceptStub.$Identifier[]>>;
  conceptStubs(
    query?: $ObjectSet.Query<ConceptStub.$Identifier>,
  ): Promise<purify.Either<Error, readonly ConceptStub[]>>;
  conceptStubsCount(
    query?: Pick<$ObjectSet.Query<ConceptStub.$Identifier>, "where">,
  ): Promise<purify.Either<Error, number>>;
  label(identifier: Label.$Identifier): Promise<purify.Either<Error, Label>>;
  labelIdentifiers(
    query?: $ObjectSet.Query<Label.$Identifier>,
  ): Promise<purify.Either<Error, readonly Label.$Identifier[]>>;
  labels(
    query?: $ObjectSet.Query<Label.$Identifier>,
  ): Promise<purify.Either<Error, readonly Label[]>>;
  labelsCount(
    query?: Pick<$ObjectSet.Query<Label.$Identifier>, "where">,
  ): Promise<purify.Either<Error, number>>;
  labelStub(
    identifier: LabelStub.$Identifier,
  ): Promise<purify.Either<Error, LabelStub>>;
  labelStubIdentifiers(
    query?: $ObjectSet.Query<LabelStub.$Identifier>,
  ): Promise<purify.Either<Error, readonly LabelStub.$Identifier[]>>;
  labelStubs(
    query?: $ObjectSet.Query<LabelStub.$Identifier>,
  ): Promise<purify.Either<Error, readonly LabelStub[]>>;
  labelStubsCount(
    query?: Pick<$ObjectSet.Query<LabelStub.$Identifier>, "where">,
  ): Promise<purify.Either<Error, number>>;
}

export namespace $ObjectSet {
  export type Query<
    ObjectIdentifierT extends rdfjs.BlankNode | rdfjs.NamedNode,
  > = {
    readonly limit?: number;
    readonly offset?: number;
    readonly where?: Where<ObjectIdentifierT>;
  };
  export type Where<
    ObjectIdentifierT extends rdfjs.BlankNode | rdfjs.NamedNode,
  > =
    | {
        readonly identifiers: readonly ObjectIdentifierT[];
        readonly type: "identifiers";
      }
    | {
        readonly objectTermType?: "NamedNode";
        readonly predicate: rdfjs.NamedNode;
        readonly subject?: rdfjs.BlankNode | rdfjs.NamedNode;
        readonly type: "triple-objects";
      }
    | {
        readonly object?: rdfjs.BlankNode | rdfjs.Literal | rdfjs.NamedNode;
        readonly predicate: rdfjs.NamedNode;
        readonly subjectTermType?: "NamedNode";
        readonly type: "triple-subjects";
      }
    | { readonly identifierType?: "NamedNode"; readonly type: "type" };
}

export abstract class $ForwardingObjectSet implements $ObjectSet {
  protected abstract get $delegate(): $ObjectSet;

  concept(
    identifier: Concept.$Identifier,
  ): Promise<purify.Either<Error, Concept>> {
    return this.$delegate.concept(identifier);
  }

  conceptIdentifiers(
    query?: $ObjectSet.Query<Concept.$Identifier>,
  ): Promise<purify.Either<Error, readonly Concept.$Identifier[]>> {
    return this.$delegate.conceptIdentifiers(query);
  }

  concepts(
    query?: $ObjectSet.Query<Concept.$Identifier>,
  ): Promise<purify.Either<Error, readonly Concept[]>> {
    return this.$delegate.concepts(query);
  }

  conceptsCount(
    query?: Pick<$ObjectSet.Query<Concept.$Identifier>, "where">,
  ): Promise<purify.Either<Error, number>> {
    return this.$delegate.conceptsCount(query);
  }

  conceptScheme(
    identifier: ConceptScheme.$Identifier,
  ): Promise<purify.Either<Error, ConceptScheme>> {
    return this.$delegate.conceptScheme(identifier);
  }

  conceptSchemeIdentifiers(
    query?: $ObjectSet.Query<ConceptScheme.$Identifier>,
  ): Promise<purify.Either<Error, readonly ConceptScheme.$Identifier[]>> {
    return this.$delegate.conceptSchemeIdentifiers(query);
  }

  conceptSchemes(
    query?: $ObjectSet.Query<ConceptScheme.$Identifier>,
  ): Promise<purify.Either<Error, readonly ConceptScheme[]>> {
    return this.$delegate.conceptSchemes(query);
  }

  conceptSchemesCount(
    query?: Pick<$ObjectSet.Query<ConceptScheme.$Identifier>, "where">,
  ): Promise<purify.Either<Error, number>> {
    return this.$delegate.conceptSchemesCount(query);
  }

  conceptSchemeStub(
    identifier: ConceptSchemeStub.$Identifier,
  ): Promise<purify.Either<Error, ConceptSchemeStub>> {
    return this.$delegate.conceptSchemeStub(identifier);
  }

  conceptSchemeStubIdentifiers(
    query?: $ObjectSet.Query<ConceptSchemeStub.$Identifier>,
  ): Promise<purify.Either<Error, readonly ConceptSchemeStub.$Identifier[]>> {
    return this.$delegate.conceptSchemeStubIdentifiers(query);
  }

  conceptSchemeStubs(
    query?: $ObjectSet.Query<ConceptSchemeStub.$Identifier>,
  ): Promise<purify.Either<Error, readonly ConceptSchemeStub[]>> {
    return this.$delegate.conceptSchemeStubs(query);
  }

  conceptSchemeStubsCount(
    query?: Pick<$ObjectSet.Query<ConceptSchemeStub.$Identifier>, "where">,
  ): Promise<purify.Either<Error, number>> {
    return this.$delegate.conceptSchemeStubsCount(query);
  }

  conceptStub(
    identifier: ConceptStub.$Identifier,
  ): Promise<purify.Either<Error, ConceptStub>> {
    return this.$delegate.conceptStub(identifier);
  }

  conceptStubIdentifiers(
    query?: $ObjectSet.Query<ConceptStub.$Identifier>,
  ): Promise<purify.Either<Error, readonly ConceptStub.$Identifier[]>> {
    return this.$delegate.conceptStubIdentifiers(query);
  }

  conceptStubs(
    query?: $ObjectSet.Query<ConceptStub.$Identifier>,
  ): Promise<purify.Either<Error, readonly ConceptStub[]>> {
    return this.$delegate.conceptStubs(query);
  }

  conceptStubsCount(
    query?: Pick<$ObjectSet.Query<ConceptStub.$Identifier>, "where">,
  ): Promise<purify.Either<Error, number>> {
    return this.$delegate.conceptStubsCount(query);
  }

  label(identifier: Label.$Identifier): Promise<purify.Either<Error, Label>> {
    return this.$delegate.label(identifier);
  }

  labelIdentifiers(
    query?: $ObjectSet.Query<Label.$Identifier>,
  ): Promise<purify.Either<Error, readonly Label.$Identifier[]>> {
    return this.$delegate.labelIdentifiers(query);
  }

  labels(
    query?: $ObjectSet.Query<Label.$Identifier>,
  ): Promise<purify.Either<Error, readonly Label[]>> {
    return this.$delegate.labels(query);
  }

  labelsCount(
    query?: Pick<$ObjectSet.Query<Label.$Identifier>, "where">,
  ): Promise<purify.Either<Error, number>> {
    return this.$delegate.labelsCount(query);
  }

  labelStub(
    identifier: LabelStub.$Identifier,
  ): Promise<purify.Either<Error, LabelStub>> {
    return this.$delegate.labelStub(identifier);
  }

  labelStubIdentifiers(
    query?: $ObjectSet.Query<LabelStub.$Identifier>,
  ): Promise<purify.Either<Error, readonly LabelStub.$Identifier[]>> {
    return this.$delegate.labelStubIdentifiers(query);
  }

  labelStubs(
    query?: $ObjectSet.Query<LabelStub.$Identifier>,
  ): Promise<purify.Either<Error, readonly LabelStub[]>> {
    return this.$delegate.labelStubs(query);
  }

  labelStubsCount(
    query?: Pick<$ObjectSet.Query<LabelStub.$Identifier>, "where">,
  ): Promise<purify.Either<Error, number>> {
    return this.$delegate.labelStubsCount(query);
  }
}

export class $RdfjsDatasetObjectSet implements $ObjectSet {
  readonly resourceSet: rdfjsResource.ResourceSet;

  constructor({ dataset }: { dataset: rdfjs.DatasetCore }) {
    this.resourceSet = new rdfjsResource.ResourceSet({ dataset });
  }

  async concept(
    identifier: Concept.$Identifier,
  ): Promise<purify.Either<Error, Concept>> {
    return this.conceptSync(identifier);
  }

  conceptSync(identifier: Concept.$Identifier): purify.Either<Error, Concept> {
    return this.conceptsSync({
      where: { identifiers: [identifier], type: "identifiers" },
    }).map((objects) => objects[0]);
  }

  async conceptIdentifiers(
    query?: $ObjectSet.Query<Concept.$Identifier>,
  ): Promise<purify.Either<Error, readonly Concept.$Identifier[]>> {
    return this.conceptIdentifiersSync(query);
  }

  conceptIdentifiersSync(
    query?: $ObjectSet.Query<Concept.$Identifier>,
  ): purify.Either<Error, readonly Concept.$Identifier[]> {
    return this.$objectIdentifiersSync<Concept, Concept.$Identifier>(
      [{ $fromRdf: Concept.$fromRdf, $fromRdfTypes: [Concept.$fromRdfType] }],
      query,
    );
  }

  async concepts(
    query?: $ObjectSet.Query<Concept.$Identifier>,
  ): Promise<purify.Either<Error, readonly Concept[]>> {
    return this.conceptsSync(query);
  }

  conceptsSync(
    query?: $ObjectSet.Query<Concept.$Identifier>,
  ): purify.Either<Error, readonly Concept[]> {
    return this.$objectsSync<Concept, Concept.$Identifier>(
      [{ $fromRdf: Concept.$fromRdf, $fromRdfTypes: [Concept.$fromRdfType] }],
      query,
    );
  }

  async conceptsCount(
    query?: Pick<$ObjectSet.Query<Concept.$Identifier>, "where">,
  ): Promise<purify.Either<Error, number>> {
    return this.conceptsCountSync(query);
  }

  conceptsCountSync(
    query?: Pick<$ObjectSet.Query<Concept.$Identifier>, "where">,
  ): purify.Either<Error, number> {
    return this.$objectsCountSync<Concept, Concept.$Identifier>(
      [{ $fromRdf: Concept.$fromRdf, $fromRdfTypes: [Concept.$fromRdfType] }],
      query,
    );
  }

  async conceptScheme(
    identifier: ConceptScheme.$Identifier,
  ): Promise<purify.Either<Error, ConceptScheme>> {
    return this.conceptSchemeSync(identifier);
  }

  conceptSchemeSync(
    identifier: ConceptScheme.$Identifier,
  ): purify.Either<Error, ConceptScheme> {
    return this.conceptSchemesSync({
      where: { identifiers: [identifier], type: "identifiers" },
    }).map((objects) => objects[0]);
  }

  async conceptSchemeIdentifiers(
    query?: $ObjectSet.Query<ConceptScheme.$Identifier>,
  ): Promise<purify.Either<Error, readonly ConceptScheme.$Identifier[]>> {
    return this.conceptSchemeIdentifiersSync(query);
  }

  conceptSchemeIdentifiersSync(
    query?: $ObjectSet.Query<ConceptScheme.$Identifier>,
  ): purify.Either<Error, readonly ConceptScheme.$Identifier[]> {
    return this.$objectIdentifiersSync<
      ConceptScheme,
      ConceptScheme.$Identifier
    >(
      [
        {
          $fromRdf: ConceptScheme.$fromRdf,
          $fromRdfTypes: [ConceptScheme.$fromRdfType],
        },
      ],
      query,
    );
  }

  async conceptSchemes(
    query?: $ObjectSet.Query<ConceptScheme.$Identifier>,
  ): Promise<purify.Either<Error, readonly ConceptScheme[]>> {
    return this.conceptSchemesSync(query);
  }

  conceptSchemesSync(
    query?: $ObjectSet.Query<ConceptScheme.$Identifier>,
  ): purify.Either<Error, readonly ConceptScheme[]> {
    return this.$objectsSync<ConceptScheme, ConceptScheme.$Identifier>(
      [
        {
          $fromRdf: ConceptScheme.$fromRdf,
          $fromRdfTypes: [ConceptScheme.$fromRdfType],
        },
      ],
      query,
    );
  }

  async conceptSchemesCount(
    query?: Pick<$ObjectSet.Query<ConceptScheme.$Identifier>, "where">,
  ): Promise<purify.Either<Error, number>> {
    return this.conceptSchemesCountSync(query);
  }

  conceptSchemesCountSync(
    query?: Pick<$ObjectSet.Query<ConceptScheme.$Identifier>, "where">,
  ): purify.Either<Error, number> {
    return this.$objectsCountSync<ConceptScheme, ConceptScheme.$Identifier>(
      [
        {
          $fromRdf: ConceptScheme.$fromRdf,
          $fromRdfTypes: [ConceptScheme.$fromRdfType],
        },
      ],
      query,
    );
  }

  async conceptSchemeStub(
    identifier: ConceptSchemeStub.$Identifier,
  ): Promise<purify.Either<Error, ConceptSchemeStub>> {
    return this.conceptSchemeStubSync(identifier);
  }

  conceptSchemeStubSync(
    identifier: ConceptSchemeStub.$Identifier,
  ): purify.Either<Error, ConceptSchemeStub> {
    return this.conceptSchemeStubsSync({
      where: { identifiers: [identifier], type: "identifiers" },
    }).map((objects) => objects[0]);
  }

  async conceptSchemeStubIdentifiers(
    query?: $ObjectSet.Query<ConceptSchemeStub.$Identifier>,
  ): Promise<purify.Either<Error, readonly ConceptSchemeStub.$Identifier[]>> {
    return this.conceptSchemeStubIdentifiersSync(query);
  }

  conceptSchemeStubIdentifiersSync(
    query?: $ObjectSet.Query<ConceptSchemeStub.$Identifier>,
  ): purify.Either<Error, readonly ConceptSchemeStub.$Identifier[]> {
    return this.$objectIdentifiersSync<
      ConceptSchemeStub,
      ConceptSchemeStub.$Identifier
    >(
      [
        {
          $fromRdf: ConceptSchemeStub.$fromRdf,
          $fromRdfTypes: [ConceptSchemeStub.$fromRdfType],
        },
      ],
      query,
    );
  }

  async conceptSchemeStubs(
    query?: $ObjectSet.Query<ConceptSchemeStub.$Identifier>,
  ): Promise<purify.Either<Error, readonly ConceptSchemeStub[]>> {
    return this.conceptSchemeStubsSync(query);
  }

  conceptSchemeStubsSync(
    query?: $ObjectSet.Query<ConceptSchemeStub.$Identifier>,
  ): purify.Either<Error, readonly ConceptSchemeStub[]> {
    return this.$objectsSync<ConceptSchemeStub, ConceptSchemeStub.$Identifier>(
      [
        {
          $fromRdf: ConceptSchemeStub.$fromRdf,
          $fromRdfTypes: [ConceptSchemeStub.$fromRdfType],
        },
      ],
      query,
    );
  }

  async conceptSchemeStubsCount(
    query?: Pick<$ObjectSet.Query<ConceptSchemeStub.$Identifier>, "where">,
  ): Promise<purify.Either<Error, number>> {
    return this.conceptSchemeStubsCountSync(query);
  }

  conceptSchemeStubsCountSync(
    query?: Pick<$ObjectSet.Query<ConceptSchemeStub.$Identifier>, "where">,
  ): purify.Either<Error, number> {
    return this.$objectsCountSync<
      ConceptSchemeStub,
      ConceptSchemeStub.$Identifier
    >(
      [
        {
          $fromRdf: ConceptSchemeStub.$fromRdf,
          $fromRdfTypes: [ConceptSchemeStub.$fromRdfType],
        },
      ],
      query,
    );
  }

  async conceptStub(
    identifier: ConceptStub.$Identifier,
  ): Promise<purify.Either<Error, ConceptStub>> {
    return this.conceptStubSync(identifier);
  }

  conceptStubSync(
    identifier: ConceptStub.$Identifier,
  ): purify.Either<Error, ConceptStub> {
    return this.conceptStubsSync({
      where: { identifiers: [identifier], type: "identifiers" },
    }).map((objects) => objects[0]);
  }

  async conceptStubIdentifiers(
    query?: $ObjectSet.Query<ConceptStub.$Identifier>,
  ): Promise<purify.Either<Error, readonly ConceptStub.$Identifier[]>> {
    return this.conceptStubIdentifiersSync(query);
  }

  conceptStubIdentifiersSync(
    query?: $ObjectSet.Query<ConceptStub.$Identifier>,
  ): purify.Either<Error, readonly ConceptStub.$Identifier[]> {
    return this.$objectIdentifiersSync<ConceptStub, ConceptStub.$Identifier>(
      [
        {
          $fromRdf: ConceptStub.$fromRdf,
          $fromRdfTypes: [ConceptStub.$fromRdfType],
        },
      ],
      query,
    );
  }

  async conceptStubs(
    query?: $ObjectSet.Query<ConceptStub.$Identifier>,
  ): Promise<purify.Either<Error, readonly ConceptStub[]>> {
    return this.conceptStubsSync(query);
  }

  conceptStubsSync(
    query?: $ObjectSet.Query<ConceptStub.$Identifier>,
  ): purify.Either<Error, readonly ConceptStub[]> {
    return this.$objectsSync<ConceptStub, ConceptStub.$Identifier>(
      [
        {
          $fromRdf: ConceptStub.$fromRdf,
          $fromRdfTypes: [ConceptStub.$fromRdfType],
        },
      ],
      query,
    );
  }

  async conceptStubsCount(
    query?: Pick<$ObjectSet.Query<ConceptStub.$Identifier>, "where">,
  ): Promise<purify.Either<Error, number>> {
    return this.conceptStubsCountSync(query);
  }

  conceptStubsCountSync(
    query?: Pick<$ObjectSet.Query<ConceptStub.$Identifier>, "where">,
  ): purify.Either<Error, number> {
    return this.$objectsCountSync<ConceptStub, ConceptStub.$Identifier>(
      [
        {
          $fromRdf: ConceptStub.$fromRdf,
          $fromRdfTypes: [ConceptStub.$fromRdfType],
        },
      ],
      query,
    );
  }

  async label(
    identifier: Label.$Identifier,
  ): Promise<purify.Either<Error, Label>> {
    return this.labelSync(identifier);
  }

  labelSync(identifier: Label.$Identifier): purify.Either<Error, Label> {
    return this.labelsSync({
      where: { identifiers: [identifier], type: "identifiers" },
    }).map((objects) => objects[0]);
  }

  async labelIdentifiers(
    query?: $ObjectSet.Query<Label.$Identifier>,
  ): Promise<purify.Either<Error, readonly Label.$Identifier[]>> {
    return this.labelIdentifiersSync(query);
  }

  labelIdentifiersSync(
    query?: $ObjectSet.Query<Label.$Identifier>,
  ): purify.Either<Error, readonly Label.$Identifier[]> {
    return this.$objectIdentifiersSync<Label, Label.$Identifier>(
      [{ $fromRdf: Label.$fromRdf, $fromRdfTypes: [Label.$fromRdfType] }],
      query,
    );
  }

  async labels(
    query?: $ObjectSet.Query<Label.$Identifier>,
  ): Promise<purify.Either<Error, readonly Label[]>> {
    return this.labelsSync(query);
  }

  labelsSync(
    query?: $ObjectSet.Query<Label.$Identifier>,
  ): purify.Either<Error, readonly Label[]> {
    return this.$objectsSync<Label, Label.$Identifier>(
      [{ $fromRdf: Label.$fromRdf, $fromRdfTypes: [Label.$fromRdfType] }],
      query,
    );
  }

  async labelsCount(
    query?: Pick<$ObjectSet.Query<Label.$Identifier>, "where">,
  ): Promise<purify.Either<Error, number>> {
    return this.labelsCountSync(query);
  }

  labelsCountSync(
    query?: Pick<$ObjectSet.Query<Label.$Identifier>, "where">,
  ): purify.Either<Error, number> {
    return this.$objectsCountSync<Label, Label.$Identifier>(
      [{ $fromRdf: Label.$fromRdf, $fromRdfTypes: [Label.$fromRdfType] }],
      query,
    );
  }

  async labelStub(
    identifier: LabelStub.$Identifier,
  ): Promise<purify.Either<Error, LabelStub>> {
    return this.labelStubSync(identifier);
  }

  labelStubSync(
    identifier: LabelStub.$Identifier,
  ): purify.Either<Error, LabelStub> {
    return this.labelStubsSync({
      where: { identifiers: [identifier], type: "identifiers" },
    }).map((objects) => objects[0]);
  }

  async labelStubIdentifiers(
    query?: $ObjectSet.Query<LabelStub.$Identifier>,
  ): Promise<purify.Either<Error, readonly LabelStub.$Identifier[]>> {
    return this.labelStubIdentifiersSync(query);
  }

  labelStubIdentifiersSync(
    query?: $ObjectSet.Query<LabelStub.$Identifier>,
  ): purify.Either<Error, readonly LabelStub.$Identifier[]> {
    return this.$objectIdentifiersSync<LabelStub, LabelStub.$Identifier>(
      [
        {
          $fromRdf: LabelStub.$fromRdf,
          $fromRdfTypes: [LabelStub.$fromRdfType],
        },
      ],
      query,
    );
  }

  async labelStubs(
    query?: $ObjectSet.Query<LabelStub.$Identifier>,
  ): Promise<purify.Either<Error, readonly LabelStub[]>> {
    return this.labelStubsSync(query);
  }

  labelStubsSync(
    query?: $ObjectSet.Query<LabelStub.$Identifier>,
  ): purify.Either<Error, readonly LabelStub[]> {
    return this.$objectsSync<LabelStub, LabelStub.$Identifier>(
      [
        {
          $fromRdf: LabelStub.$fromRdf,
          $fromRdfTypes: [LabelStub.$fromRdfType],
        },
      ],
      query,
    );
  }

  async labelStubsCount(
    query?: Pick<$ObjectSet.Query<LabelStub.$Identifier>, "where">,
  ): Promise<purify.Either<Error, number>> {
    return this.labelStubsCountSync(query);
  }

  labelStubsCountSync(
    query?: Pick<$ObjectSet.Query<LabelStub.$Identifier>, "where">,
  ): purify.Either<Error, number> {
    return this.$objectsCountSync<LabelStub, LabelStub.$Identifier>(
      [
        {
          $fromRdf: LabelStub.$fromRdf,
          $fromRdfTypes: [LabelStub.$fromRdfType],
        },
      ],
      query,
    );
  }

  protected $objectIdentifiersSync<
    ObjectT extends { readonly $identifier: ObjectIdentifierT },
    ObjectIdentifierT extends rdfjs.BlankNode | rdfjs.NamedNode,
  >(
    objectTypes: readonly {
      $fromRdf: (
        resource: rdfjsResource.Resource,
        options: { objectSet: $ObjectSet },
      ) => purify.Either<Error, ObjectT>;
      $fromRdfTypes: readonly rdfjs.NamedNode[];
    }[],
    query?: $ObjectSet.Query<ObjectIdentifierT>,
  ): purify.Either<Error, readonly ObjectIdentifierT[]> {
    return this.$objectsSync<ObjectT, ObjectIdentifierT>(
      objectTypes,
      query,
    ).map((objects) => objects.map((object) => object.$identifier));
  }

  protected $objectsSync<
    ObjectT extends { readonly $identifier: ObjectIdentifierT },
    ObjectIdentifierT extends rdfjs.BlankNode | rdfjs.NamedNode,
  >(
    objectTypes: readonly {
      $fromRdf: (
        resource: rdfjsResource.Resource,
        options: { objectSet: $ObjectSet },
      ) => purify.Either<Error, ObjectT>;
      $fromRdfTypes: readonly rdfjs.NamedNode[];
    }[],
    query?: $ObjectSet.Query<ObjectIdentifierT>,
  ): purify.Either<Error, readonly ObjectT[]> {
    const limit = query?.limit ?? Number.MAX_SAFE_INTEGER;
    if (limit <= 0) {
      return purify.Either.of([]);
    }

    let offset = query?.offset ?? 0;
    if (offset < 0) {
      offset = 0;
    }

    // First pass: gather all resources that meet the where filters.
    // We don't limit + offset here because the resources aren't sorted and limit + offset should be deterministic.
    const resources: {
      objectType?: {
        $fromRdf: (
          resource: rdfjsResource.Resource,
          options: { objectSet: $ObjectSet },
        ) => purify.Either<Error, ObjectT>;
        $fromRdfTypes: readonly rdfjs.NamedNode[];
      };
      resource: rdfjsResource.Resource;
    }[] = [];
    const where = query?.where ?? { type: "type" };
    switch (where.type) {
      case "identifiers": {
        for (const identifier of where.identifiers) {
          // Don't deduplicate
          resources.push({ resource: this.resourceSet.resource(identifier) });
        }
        break;
      }

      case "triple-objects": {
        for (const quad of this.resourceSet.dataset.match(
          where.subject,
          where.predicate,
          null,
        )) {
          if (
            where.objectTermType &&
            quad.object.termType !== where.objectTermType
          ) {
            continue;
          }

          switch (quad.object.termType) {
            case "BlankNode":
            case "NamedNode":
              break;
            default:
              return purify.Left(
                new Error(
                  `subject=${where.subject?.value} predicate=${where.predicate.value} pattern matches non-identifier (${quad.object.termType}) object`,
                ),
              );
          }

          const resource = this.resourceSet.resource(quad.object);
          if (
            !resources.some(({ resource: existingResource }) =>
              existingResource.identifier.equals(resource.identifier),
            )
          ) {
            resources.push({ resource });
          }
        }
        break;
      }

      case "triple-subjects": {
        for (const quad of this.resourceSet.dataset.match(
          null,
          where.predicate,
          where.object,
        )) {
          if (
            where.subjectTermType &&
            quad.subject.termType !== where.subjectTermType
          ) {
            continue;
          }

          switch (quad.subject.termType) {
            case "BlankNode":
            case "NamedNode":
              break;
            default:
              return purify.Left(
                new Error(
                  `predicate=${where.predicate.value} object=${where.object?.value} pattern matches non-identifier (${quad.subject.termType}) subject`,
                ),
              );
          }

          const resource = this.resourceSet.resource(quad.subject);
          if (
            !resources.some(({ resource: existingResource }) =>
              existingResource.identifier.equals(resource.identifier),
            )
          ) {
            resources.push({ resource });
          }
        }
        break;
      }

      case "type": {
        for (const objectType of objectTypes) {
          if (objectType.$fromRdfTypes.length === 0) {
            continue;
          }

          for (const fromRdfType of objectType.$fromRdfTypes) {
            for (const resource of where.identifierType === "NamedNode"
              ? this.resourceSet.namedInstancesOf(fromRdfType)
              : this.resourceSet.instancesOf(fromRdfType)) {
              if (
                !resources.some(({ resource: existingResource }) =>
                  existingResource.identifier.equals(resource.identifier),
                )
              ) {
                resources.push({ objectType, resource });
              }
            }
          }
        }

        break;
      }
    }

    // Sort resources by identifier so limit and offset are deterministic
    resources.sort((left, right) =>
      left.resource.identifier.value.localeCompare(
        right.resource.identifier.value,
      ),
    );

    let objectI = 0;
    const objects: ObjectT[] = [];
    for (let { objectType, resource } of resources) {
      let objectEither: purify.Either<Error, ObjectT>;
      if (objectType) {
        objectEither = objectType.$fromRdf(resource, { objectSet: this });
      } else {
        for (const tryObjectType of objectTypes) {
          objectEither = tryObjectType.$fromRdf(resource, { objectSet: this });
          if (objectEither.isRight()) {
            objectType = tryObjectType;
            break;
          }
        }
      }

      if (objectEither!.isLeft()) {
        // Doesn't appear to belong to any of the known object types, just assume the first
        return objectEither as unknown as purify.Either<
          Error,
          readonly ObjectT[]
        >;
      }
      const object = objectEither!.unsafeCoerce();
      if (objectI++ >= offset) {
        objects.push(object);
        if (objects.length === limit) {
          return purify.Either.of(objects);
        }
      }
    }

    return purify.Either.of(objects);
  }

  protected $objectsCountSync<
    ObjectT extends { readonly $identifier: ObjectIdentifierT },
    ObjectIdentifierT extends rdfjs.BlankNode | rdfjs.NamedNode,
  >(
    objectTypes: readonly {
      $fromRdf: (
        resource: rdfjsResource.Resource,
        options: { objectSet: $ObjectSet },
      ) => purify.Either<Error, ObjectT>;
      $fromRdfTypes: readonly rdfjs.NamedNode[];
    }[],
    query?: $ObjectSet.Query<ObjectIdentifierT>,
  ): purify.Either<Error, number> {
    return this.$objectsSync<ObjectT, ObjectIdentifierT>(
      objectTypes,
      query,
    ).map((objects) => objects.length);
  }
}

export class $SparqlObjectSet implements $ObjectSet {
  protected readonly $countVariable = dataFactory.variable!("count");
  protected readonly $objectVariable = dataFactory.variable!("object");
  protected readonly $sparqlClient: {
    queryBindings: (
      query: string,
    ) => Promise<
      readonly Record<
        string,
        rdfjs.BlankNode | rdfjs.Literal | rdfjs.NamedNode
      >[]
    >;
    queryQuads: (query: string) => Promise<readonly rdfjs.Quad[]>;
  };
  protected readonly $sparqlGenerator = new sparqljs.Generator();

  constructor({
    sparqlClient,
  }: { sparqlClient: $SparqlObjectSet["$sparqlClient"] }) {
    this.$sparqlClient = sparqlClient;
  }

  async concept(
    identifier: Concept.$Identifier,
  ): Promise<purify.Either<Error, Concept>> {
    return (
      await this.concepts({
        where: { identifiers: [identifier], type: "identifiers" },
      })
    ).map((objects) => objects[0]);
  }

  async conceptIdentifiers(
    query?: $SparqlObjectSet.Query<Concept.$Identifier>,
  ): Promise<purify.Either<Error, readonly Concept.$Identifier[]>> {
    return this.$objectIdentifiers<Concept.$Identifier>(Concept, query);
  }

  async concepts(
    query?: $SparqlObjectSet.Query<Concept.$Identifier>,
  ): Promise<purify.Either<Error, readonly Concept[]>> {
    return this.$objects<Concept, Concept.$Identifier>(Concept, query);
  }

  async conceptsCount(
    query?: Pick<$SparqlObjectSet.Query<Concept.$Identifier>, "where">,
  ): Promise<purify.Either<Error, number>> {
    return this.$objectsCount<Concept.$Identifier>(Concept, query);
  }

  async conceptScheme(
    identifier: ConceptScheme.$Identifier,
  ): Promise<purify.Either<Error, ConceptScheme>> {
    return (
      await this.conceptSchemes({
        where: { identifiers: [identifier], type: "identifiers" },
      })
    ).map((objects) => objects[0]);
  }

  async conceptSchemeIdentifiers(
    query?: $SparqlObjectSet.Query<ConceptScheme.$Identifier>,
  ): Promise<purify.Either<Error, readonly ConceptScheme.$Identifier[]>> {
    return this.$objectIdentifiers<ConceptScheme.$Identifier>(
      ConceptScheme,
      query,
    );
  }

  async conceptSchemes(
    query?: $SparqlObjectSet.Query<ConceptScheme.$Identifier>,
  ): Promise<purify.Either<Error, readonly ConceptScheme[]>> {
    return this.$objects<ConceptScheme, ConceptScheme.$Identifier>(
      ConceptScheme,
      query,
    );
  }

  async conceptSchemesCount(
    query?: Pick<$SparqlObjectSet.Query<ConceptScheme.$Identifier>, "where">,
  ): Promise<purify.Either<Error, number>> {
    return this.$objectsCount<ConceptScheme.$Identifier>(ConceptScheme, query);
  }

  async conceptSchemeStub(
    identifier: ConceptSchemeStub.$Identifier,
  ): Promise<purify.Either<Error, ConceptSchemeStub>> {
    return (
      await this.conceptSchemeStubs({
        where: { identifiers: [identifier], type: "identifiers" },
      })
    ).map((objects) => objects[0]);
  }

  async conceptSchemeStubIdentifiers(
    query?: $SparqlObjectSet.Query<ConceptSchemeStub.$Identifier>,
  ): Promise<purify.Either<Error, readonly ConceptSchemeStub.$Identifier[]>> {
    return this.$objectIdentifiers<ConceptSchemeStub.$Identifier>(
      ConceptSchemeStub,
      query,
    );
  }

  async conceptSchemeStubs(
    query?: $SparqlObjectSet.Query<ConceptSchemeStub.$Identifier>,
  ): Promise<purify.Either<Error, readonly ConceptSchemeStub[]>> {
    return this.$objects<ConceptSchemeStub, ConceptSchemeStub.$Identifier>(
      ConceptSchemeStub,
      query,
    );
  }

  async conceptSchemeStubsCount(
    query?: Pick<
      $SparqlObjectSet.Query<ConceptSchemeStub.$Identifier>,
      "where"
    >,
  ): Promise<purify.Either<Error, number>> {
    return this.$objectsCount<ConceptSchemeStub.$Identifier>(
      ConceptSchemeStub,
      query,
    );
  }

  async conceptStub(
    identifier: ConceptStub.$Identifier,
  ): Promise<purify.Either<Error, ConceptStub>> {
    return (
      await this.conceptStubs({
        where: { identifiers: [identifier], type: "identifiers" },
      })
    ).map((objects) => objects[0]);
  }

  async conceptStubIdentifiers(
    query?: $SparqlObjectSet.Query<ConceptStub.$Identifier>,
  ): Promise<purify.Either<Error, readonly ConceptStub.$Identifier[]>> {
    return this.$objectIdentifiers<ConceptStub.$Identifier>(ConceptStub, query);
  }

  async conceptStubs(
    query?: $SparqlObjectSet.Query<ConceptStub.$Identifier>,
  ): Promise<purify.Either<Error, readonly ConceptStub[]>> {
    return this.$objects<ConceptStub, ConceptStub.$Identifier>(
      ConceptStub,
      query,
    );
  }

  async conceptStubsCount(
    query?: Pick<$SparqlObjectSet.Query<ConceptStub.$Identifier>, "where">,
  ): Promise<purify.Either<Error, number>> {
    return this.$objectsCount<ConceptStub.$Identifier>(ConceptStub, query);
  }

  async label(
    identifier: Label.$Identifier,
  ): Promise<purify.Either<Error, Label>> {
    return (
      await this.labels({
        where: { identifiers: [identifier], type: "identifiers" },
      })
    ).map((objects) => objects[0]);
  }

  async labelIdentifiers(
    query?: $SparqlObjectSet.Query<Label.$Identifier>,
  ): Promise<purify.Either<Error, readonly Label.$Identifier[]>> {
    return this.$objectIdentifiers<Label.$Identifier>(Label, query);
  }

  async labels(
    query?: $SparqlObjectSet.Query<Label.$Identifier>,
  ): Promise<purify.Either<Error, readonly Label[]>> {
    return this.$objects<Label, Label.$Identifier>(Label, query);
  }

  async labelsCount(
    query?: Pick<$SparqlObjectSet.Query<Label.$Identifier>, "where">,
  ): Promise<purify.Either<Error, number>> {
    return this.$objectsCount<Label.$Identifier>(Label, query);
  }

  async labelStub(
    identifier: LabelStub.$Identifier,
  ): Promise<purify.Either<Error, LabelStub>> {
    return (
      await this.labelStubs({
        where: { identifiers: [identifier], type: "identifiers" },
      })
    ).map((objects) => objects[0]);
  }

  async labelStubIdentifiers(
    query?: $SparqlObjectSet.Query<LabelStub.$Identifier>,
  ): Promise<purify.Either<Error, readonly LabelStub.$Identifier[]>> {
    return this.$objectIdentifiers<LabelStub.$Identifier>(LabelStub, query);
  }

  async labelStubs(
    query?: $SparqlObjectSet.Query<LabelStub.$Identifier>,
  ): Promise<purify.Either<Error, readonly LabelStub[]>> {
    return this.$objects<LabelStub, LabelStub.$Identifier>(LabelStub, query);
  }

  async labelStubsCount(
    query?: Pick<$SparqlObjectSet.Query<LabelStub.$Identifier>, "where">,
  ): Promise<purify.Either<Error, number>> {
    return this.$objectsCount<LabelStub.$Identifier>(LabelStub, query);
  }

  protected $mapBindingsToCount(
    bindings: readonly Record<
      string,
      rdfjs.BlankNode | rdfjs.Literal | rdfjs.NamedNode
    >[],
    variable: string,
  ): purify.Either<Error, number> {
    if (bindings.length === 0) {
      return purify.Left(new Error("empty result rows"));
    }
    if (bindings.length > 1) {
      return purify.Left(new Error("more than one result row"));
    }
    const count = bindings[0][variable];
    if (typeof count === "undefined") {
      return purify.Left(new Error("no 'count' variable in result row"));
    }
    if (count.termType !== "Literal") {
      return purify.Left(new Error("'count' variable is not a Literal"));
    }
    const parsedCount = Number.parseInt(count.value);
    if (Number.isNaN(parsedCount)) {
      return purify.Left(new Error("'count' variable is NaN"));
    }
    return purify.Either.of(parsedCount);
  }

  protected $mapBindingsToIdentifiers(
    bindings: readonly Record<
      string,
      rdfjs.BlankNode | rdfjs.Literal | rdfjs.NamedNode
    >[],
    variable: string,
  ): readonly rdfjs.NamedNode[] {
    const identifiers: rdfjs.NamedNode[] = [];
    for (const bindings_ of bindings) {
      const identifier = bindings_[variable];
      if (
        typeof identifier !== "undefined" &&
        identifier.termType === "NamedNode"
      ) {
        identifiers.push(identifier);
      }
    }
    return identifiers;
  }

  protected async $objectIdentifiers<
    ObjectIdentifierT extends rdfjs.BlankNode | rdfjs.NamedNode,
  >(
    objectType: {
      $sparqlWherePatterns: (parameters?: {
        subject?: sparqljs.Triple["subject"];
      }) => readonly sparqljs.Pattern[];
    },
    query?: $SparqlObjectSet.Query<ObjectIdentifierT>,
  ): Promise<purify.Either<Error, readonly ObjectIdentifierT[]>> {
    const limit = query?.limit ?? Number.MAX_SAFE_INTEGER;
    if (limit <= 0) {
      return purify.Either.of([]);
    }

    let offset = query?.offset ?? 0;
    if (offset < 0) {
      offset = 0;
    }

    const wherePatterns = this.$wherePatterns(objectType, query?.where).filter(
      (pattern) => pattern.type !== "optional",
    );
    if (wherePatterns.length === 0) {
      return purify.Left(
        new Error("no required SPARQL WHERE patterns for identifiers"),
      );
    }

    const selectQueryString = this.$sparqlGenerator.stringify({
      distinct: true,
      limit: limit < Number.MAX_SAFE_INTEGER ? limit : undefined,
      offset,
      order: query?.order
        ? query.order(this.$objectVariable).concat()
        : [{ expression: this.$objectVariable }],
      prefixes: {},
      queryType: "SELECT",
      type: "query",
      variables: [this.$objectVariable],
      where: wherePatterns,
    });

    return purify.EitherAsync(
      async () =>
        this.$mapBindingsToIdentifiers(
          await this.$sparqlClient.queryBindings(selectQueryString),
          this.$objectVariable.value,
        ) as readonly ObjectIdentifierT[],
    );
  }

  async $objects<
    ObjectT,
    ObjectIdentifierT extends rdfjs.BlankNode | rdfjs.NamedNode,
  >(
    objectType: {
      $fromRdf: (
        resource: rdfjsResource.Resource,
        options: { objectSet: $ObjectSet },
      ) => purify.Either<Error, ObjectT>;
      $sparqlConstructQueryString: (
        parameters?: { subject?: sparqljs.Triple["subject"] } & Omit<
          sparqljs.ConstructQuery,
          "prefixes" | "queryType" | "type"
        > &
          sparqljs.GeneratorOptions,
      ) => string;
      $sparqlWherePatterns: (parameters?: {
        subject?: sparqljs.Triple["subject"];
      }) => readonly sparqljs.Pattern[];
    },
    query?: $SparqlObjectSet.Query<ObjectIdentifierT>,
  ): Promise<purify.Either<Error, readonly ObjectT[]>> {
    const identifiersEither = await this.$objectIdentifiers<ObjectIdentifierT>(
      objectType,
      query,
    );
    if (identifiersEither.isLeft()) {
      return identifiersEither;
    }
    const identifiers = identifiersEither.unsafeCoerce();
    if (identifiers.length === 0) {
      return purify.Either.of([]);
    }

    const constructQueryString = objectType.$sparqlConstructQueryString({
      subject: this.$objectVariable,
      where: [
        {
          type: "values" as const,
          values: identifiers.map((identifier) => {
            const valuePatternRow: sparqljs.ValuePatternRow = {};
            valuePatternRow["?object"] = identifier as rdfjs.NamedNode;
            return valuePatternRow;
          }),
        },
      ],
    });

    let quads: readonly rdfjs.Quad[];
    try {
      quads = await this.$sparqlClient.queryQuads(constructQueryString);
    } catch (e) {
      return purify.Left(e as Error);
    }

    const dataset = datasetFactory.dataset(quads.concat());
    const objects: ObjectT[] = [];
    for (const identifier of identifiers) {
      const objectEither = objectType.$fromRdf(
        new rdfjsResource.Resource<rdfjs.NamedNode>({
          dataset,
          identifier: identifier as rdfjs.NamedNode,
        }),
        { objectSet: this },
      );
      if (objectEither.isLeft()) {
        return objectEither;
      }
      objects.push(objectEither.unsafeCoerce());
    }
    return purify.Either.of(objects);
  }

  protected async $objectsCount<
    ObjectIdentifierT extends rdfjs.BlankNode | rdfjs.NamedNode,
  >(
    objectType: {
      $sparqlWherePatterns: (parameters?: {
        subject?: sparqljs.Triple["subject"];
      }) => readonly sparqljs.Pattern[];
    },
    query?: $SparqlObjectSet.Query<ObjectIdentifierT>,
  ): Promise<purify.Either<Error, number>> {
    const wherePatterns = this.$wherePatterns(objectType, query?.where).filter(
      (pattern) => pattern.type !== "optional",
    );
    if (wherePatterns.length === 0) {
      return purify.Left(
        new Error("no required SPARQL WHERE patterns for count"),
      );
    }

    const selectQueryString = this.$sparqlGenerator.stringify({
      prefixes: {},
      queryType: "SELECT",
      type: "query",
      variables: [
        {
          expression: {
            aggregation: "COUNT",
            distinct: true,
            expression: this.$objectVariable,
            type: "aggregate",
          },
          variable: this.$countVariable,
        },
      ],
      where: wherePatterns,
    });

    return purify.EitherAsync(async ({ liftEither }) =>
      liftEither(
        this.$mapBindingsToCount(
          await this.$sparqlClient.queryBindings(selectQueryString),
          this.$countVariable.value,
        ),
      ),
    );
  }

  protected $wherePatterns<
    ObjectIdentifierT extends rdfjs.BlankNode | rdfjs.NamedNode,
  >(
    objectType: {
      $sparqlWherePatterns: (parameters?: {
        subject?: sparqljs.Triple["subject"];
      }) => readonly sparqljs.Pattern[];
    },
    where?: $SparqlObjectSet.Where<ObjectIdentifierT>,
  ): sparqljs.Pattern[] {
    // Patterns should be most to least specific.
    const patterns: sparqljs.Pattern[] = [];

    const where_ = where ?? { type: "type" };
    switch (where_.type) {
      case "identifiers": {
        const valuePatternRowKey = `?${this.$objectVariable.value}`;
        patterns.push({
          type: "values" as const,
          values: where_.identifiers.map((identifier) => {
            const valuePatternRow: sparqljs.ValuePatternRow = {};
            valuePatternRow[valuePatternRowKey] = identifier as rdfjs.NamedNode;
            return valuePatternRow;
          }),
        });
        break;
      }

      case "sparql-patterns": {
        patterns.push(...where_.sparqlPatterns(this.$objectVariable));
        break;
      }

      case "triple-objects": {
        patterns.push({
          triples: [
            {
              subject: where_.subject ?? dataFactory.blankNode(),
              predicate: where_.predicate,
              object: this.$objectVariable,
            },
          ],
          type: "bgp",
        });

        if (where_.objectTermType === "NamedNode") {
          patterns.push({
            type: "filter" as const,
            expression: {
              type: "operation" as const,
              operator: "isIRI",
              args: [this.$objectVariable],
            },
          });
        }

        break;
      }

      case "triple-subjects": {
        patterns.push({
          triples: [
            {
              subject: this.$objectVariable,
              predicate: where_.predicate,
              object: where_.object ?? dataFactory.blankNode(),
            },
          ],
          type: "bgp",
        });

        if (where_.subjectTermType === "NamedNode") {
          patterns.push({
            type: "filter" as const,
            expression: {
              type: "operation" as const,
              operator: "isIRI",
              args: [this.$objectVariable],
            },
          });
        }

        break;
      }

      case "type": {
        // The type patterns are always added below.

        if (where_.identifierType === "NamedNode") {
          patterns.push({
            type: "filter" as const,
            expression: {
              type: "operation" as const,
              operator: "isIRI",
              args: [this.$objectVariable],
            },
          });
        }
        break;
      }
    }

    patterns.push(
      ...objectType.$sparqlWherePatterns({ subject: this.$objectVariable }),
    );

    return patterns;
  }
}

export namespace $SparqlObjectSet {
  export type Query<
    ObjectIdentifierT extends rdfjs.BlankNode | rdfjs.NamedNode,
  > = Omit<$ObjectSet.Query<ObjectIdentifierT>, "where"> & {
    readonly order?: (
      objectVariable: rdfjs.Variable,
    ) => readonly sparqljs.Ordering[];
    readonly where?: Where<ObjectIdentifierT>;
  };
  export type Where<
    ObjectIdentifierT extends rdfjs.BlankNode | rdfjs.NamedNode,
  > =
    | $ObjectSet.Where<ObjectIdentifierT>
    | {
        readonly sparqlPatterns: (
          objectVariable: rdfjs.Variable,
        ) => readonly sparqljs.Pattern[];
        readonly type: "sparql-patterns";
      };
}
