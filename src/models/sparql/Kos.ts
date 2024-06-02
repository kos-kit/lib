import { Identifier } from "../Identifier";
import { rdf, rdfs, skos } from "../../vocabularies";
import { Concept } from "./Concept";
import { ConceptScheme } from "./ConceptScheme";
import SparqlClient from "sparql-http-client/ParsingClient";
import { LanguageTagSet } from "../LanguageTagSet";
import { graphPatternsToConstructQuery } from "./graphPatternsToConstructQuery";
import { mem } from "..";

export class Kos {
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
          graphPatternsToConstructQuery(
            Concept.propertyGraphPatterns(identifier),
            { includeLanguageTags },
          ),
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
    for (const resultRow of await this.sparqlClient.query.select(`
        SELECT ?concept
        WHERE {
          ?concept <${rdf.type.value}>/<${rdfs.subClassOf.value}>* <${skos.Concept.value}> .
        }
        LIMIT ${limit}
        OFFSET ${offset}
        `)) {
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
  async conceptsPage({}: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]> {
    throw new Error("not implemented yet");
    //     const concepts: Concept[] = [];

    //         concepts.push(
    //           new Concept({
    //             identifier: conceptIdentifier,
    //             includeLanguageTags: this.includeLanguageTags,
    //             sparqlClient: this.sparqlClient,
    //           }),
    //         );
    //       }
    //     }

    //     return concepts;
  }

  async conceptsCount(): Promise<number> {
    const query = `
SELECT (COUNT(?concept) AS ?count)
WHERE {
  ?concept <${rdf.type.value}>/<${rdfs.subClassOf.value}>* <${skos.Concept.value}> .
}`;

    for (const resultRow of await this.sparqlClient.query.select(query)) {
      const count = resultRow["count"];
      if (count?.termType === "Literal") {
        return parseInt(count.value);
      }
    }
    throw new Error("should never get here");
  }

  conceptSchemeByIdentifier(_identifier: Identifier): Promise<ConceptScheme> {
    throw new Error("not implemented yet");
    // return new Promise((resolve) =>
    //   resolve(
    //     new ConceptScheme({
    //       identifier,
    //       includeLanguageTags: this.includeLanguageTags,
    //       sparqlClient: this.sparqlClient,
    //     }),
    //   ),
    // );
  }

  async conceptSchemes(): Promise<readonly ConceptScheme[]> {
    throw new Error("not implemented yet");
    //     const conceptSchemes: ConceptScheme[] = [];

    //     const query = `
    // SELECT ?conceptScheme
    // WHERE {
    //   ?conceptScheme <${rdf.type.value}>/<${rdfs.subClassOf.value}>* <${skos.ConceptScheme.value}> .
    // }
    // `;

    //     for (const resultRow of await this.sparqlClient.query.select(query)) {
    //       const conceptSchemeIdentifier = resultRow["conceptScheme"];
    //       if (
    //         conceptSchemeIdentifier &&
    //         (conceptSchemeIdentifier.termType === "BlankNode" ||
    //           conceptSchemeIdentifier.termType === "NamedNode")
    //       ) {
    //         conceptSchemes.push(
    //           new ConceptScheme({
    //             identifier: conceptSchemeIdentifier,
    //             sparqlClient: this.sparqlClient,
    //           }),
    //         );
    //       }
    //     }

    //     return conceptSchemes;
  }
}
