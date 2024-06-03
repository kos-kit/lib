import { Identifier } from "../Identifier";
import { rdf, rdfs, skos } from "../../vocabularies";
import { Concept } from "./Concept";
import { ConceptScheme } from "./ConceptScheme";
import SparqlClient from "sparql-http-client/ParsingClient";
import { LanguageTagSet } from "../LanguageTagSet";
import { ConstructQueryBuilder } from "./ConstructQueryBuilder";
import { mem } from "..";
import { GraphPatternVariable } from "./GraphPattern";

export class Kos {
  private static readonly CONCEPT_IDENTIFIER_GRAPH_PATTERN = `?concept <${rdf.type.value}>/<${rdfs.subClassOf.value}>* <${skos.Concept.value}> .`;
  private static readonly CONCEPT_SCHEME_IDENTIFIER_GRAPH_PATTERN = `?conceptScheme <${rdf.type.value}>/<${rdfs.subClassOf.value}>* <${skos.ConceptScheme.value}> .`;

  private readonly includeLanguageTags: LanguageTagSet;
  private readonly sparqlClient: SparqlClient;

  constructor({
    includeLanguageTags,
    sparqlClient,
  }: {
    includeLanguageTags: LanguageTagSet;
    sparqlClient: SparqlClient;
  }) {
    this.includeLanguageTags = includeLanguageTags;
    this.sparqlClient = sparqlClient;
  }

  async conceptByIdentifier(identifier: Identifier): Promise<Concept> {
    const includeLanguageTags = this.includeLanguageTags;
    return new Concept({
      memModel: new mem.Concept({
        dataset: await this.sparqlClient.query.construct(
          new ConstructQueryBuilder({ includeLanguageTags })
            .addGraphPatterns(...Concept.propertyGraphPatterns(identifier))
            .build(),
        ),
        identifier,
        includeLanguageTags,
      }),
      sparqlClient: this.sparqlClient,
    });
  }

  async *concepts(): AsyncGenerator<Concept, any, unknown> {
    const conceptsCount = await this.conceptsCount();
    const limit = 100;
    let offset = 0;
    while (offset < conceptsCount) {
      for (const concept of await this.conceptsPage({ limit, offset })) {
        yield concept;
        offset++;
      }
    }
  }

  private async conceptIdentifiersPage({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<readonly Identifier[]> {
    const conceptIdentifiers: Identifier[] = [];
    for (const resultRow of await this.sparqlClient.query.select(`\
SELECT ?concept
WHERE {
  ${Kos.CONCEPT_IDENTIFIER_GRAPH_PATTERN}
}
LIMIT ${limit}
OFFSET ${offset}`)) {
      const conceptIdentifier = resultRow["concept"];
      if (
        conceptIdentifier &&
        (conceptIdentifier.termType === "BlankNode" ||
          conceptIdentifier.termType === "NamedNode")
      ) {
        conceptIdentifiers.push(conceptIdentifier);
      }
    }
    return conceptIdentifiers;
  }

  // eslint-disable-next-line no-empty-pattern
  async conceptsPage({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]> {
    const conceptIdentifiers = await this.conceptIdentifiersPage({
      limit,
      offset,
    });

    const conceptVariable: GraphPatternVariable = {
      termType: "Variable",
      value: "concept",
    };
    const includeLanguageTags = this.includeLanguageTags;
    const dataset = await this.sparqlClient.query.construct(
      new ConstructQueryBuilder({
        includeLanguageTags,
      })
        .addGraphPatterns(...Concept.propertyGraphPatterns(conceptVariable))
        .addValues(conceptVariable, ...conceptIdentifiers)
        .build(),
    );
    return conceptIdentifiers.map(
      (identifier) =>
        new Concept({
          memModel: new mem.Concept({
            dataset,
            identifier,
            includeLanguageTags,
          }),
          sparqlClient: this.sparqlClient,
        }),
    );
  }

  async conceptsCount(): Promise<number> {
    const query = `\
SELECT (COUNT(?concept) AS ?count)
WHERE {
  ${Kos.CONCEPT_IDENTIFIER_GRAPH_PATTERN}
}`;

    for (const resultRow of await this.sparqlClient.query.select(query)) {
      const count = resultRow["count"];
      if (count?.termType === "Literal") {
        return parseInt(count.value);
      }
    }
    throw new Error("should never get here");
  }

  async conceptSchemeByIdentifier(
    identifier: Identifier,
  ): Promise<ConceptScheme> {
    const includeLanguageTags = this.includeLanguageTags;
    return new ConceptScheme({
      memModel: new mem.ConceptScheme({
        dataset: await this.sparqlClient.query.construct(
          new ConstructQueryBuilder({ includeLanguageTags })
            .addGraphPatterns(
              ...ConceptScheme.propertyGraphPatterns(identifier),
            )
            .build(),
        ),
        identifier,
        includeLanguageTags,
      }),
      sparqlClient: this.sparqlClient,
    });
  }

  private async conceptSchemeIdentifiers(): Promise<readonly Identifier[]> {
    const conceptSchemeIdentifiers: Identifier[] = [];
    for (const resultRow of await this.sparqlClient.query.select(`\
SELECT ?concept
WHERE {
  ${Kos.CONCEPT_SCHEME_IDENTIFIER_GRAPH_PATTERN}
}`)) {
      const conceptSchemeIdentifier = resultRow["concept"];
      if (
        conceptSchemeIdentifier &&
        (conceptSchemeIdentifier.termType === "BlankNode" ||
          conceptSchemeIdentifier.termType === "NamedNode")
      ) {
        conceptSchemeIdentifiers.push(conceptSchemeIdentifier);
      }
    }
    return conceptSchemeIdentifiers;
  }

  async conceptSchemes(): Promise<readonly ConceptScheme[]> {
    const conceptSchemeIdentifiers = await this.conceptSchemeIdentifiers();

    const conceptSchemeVariable: GraphPatternVariable = {
      termType: "Variable",
      value: "conceptScheme",
    };
    const includeLanguageTags = this.includeLanguageTags;
    const dataset = await this.sparqlClient.query.construct(
      new ConstructQueryBuilder({
        includeLanguageTags,
      })
        .addGraphPatterns(
          ...ConceptScheme.propertyGraphPatterns(conceptSchemeVariable),
        )
        .addValues(conceptSchemeVariable, ...conceptSchemeIdentifiers)
        .build(),
    );
    return conceptSchemeIdentifiers.map(
      (identifier) =>
        new ConceptScheme({
          memModel: new mem.ConceptScheme({
            dataset,
            identifier,
            includeLanguageTags,
          }),
          sparqlClient: this.sparqlClient,
        }),
    );
  }
}
