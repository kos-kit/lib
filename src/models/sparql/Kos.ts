import { AbstractKos } from "../AbstractKos";
import { Identifier } from "../Identifier";
import { rdf, rdfs, skos } from "../../vocabularies";
import { Concept } from "./Concept";
import { ConceptScheme } from "./ConceptScheme";
import { SparqlClient } from "../../SparqlClient";

export class Kos extends AbstractKos {
  constructor(private readonly sparqlClient: SparqlClient) {
    super();
  }

  conceptByIdentifier(identifier: Identifier): Promise<Concept> {
    return new Promise((resolve) =>
      resolve(
        new Concept({
          identifier,
          sparqlClient: this.sparqlClient,
        }),
      ),
    );
  }

  async conceptsPage({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]> {
    const concepts: Concept[] = [];

    const query = `
SELECT ?concept
WHERE {
  ?concept <${rdf.type.value}>/<${rdfs.subClassOf.value}>* <${skos.Concept.value}> .
}
LIMIT ${limit}
OFFSET ${offset}
`;

    for (const resultRow of await this.sparqlClient.query.select(query)) {
      const conceptIdentifier = resultRow["concept"];
      if (
        conceptIdentifier &&
        conceptIdentifier &&
        (conceptIdentifier.termType === "BlankNode" ||
          conceptIdentifier.termType === "NamedNode")
      ) {
        concepts.push(
          new Concept({
            identifier: conceptIdentifier,
            sparqlClient: this.sparqlClient,
          }),
        );
      }
    }

    return concepts;
  }

  async conceptsCount(): Promise<number> {
    const query = `
SELECT (COUNT(?concept) AS ?count)
WHERE {
  ?concept <${rdf.type.value}>/<${rdfs.subClassOf.value}>* <${skos.Concept.value}> .
}
    `;

    for (const resultRow of await this.sparqlClient.query.select(query)) {
      const count = resultRow["count"];
      if (count?.termType === "Literal") {
        return parseInt(count.value);
      }
    }
    throw new Error("should never get here");
  }

  conceptSchemeByIdentifier(identifier: Identifier): Promise<ConceptScheme> {
    return new Promise((resolve) =>
      resolve(
        new ConceptScheme({
          identifier,
          sparqlClient: this.sparqlClient,
        }),
      ),
    );
  }

  async conceptSchemes(): Promise<readonly ConceptScheme[]> {
    const conceptSchemes: ConceptScheme[] = [];

    const query = `
SELECT ?conceptScheme
WHERE {
  ?conceptScheme <${rdf.type.value}>/<${rdfs.subClassOf.value}>* <${skos.ConceptScheme.value}> .
}
`;

    for (const resultRow of await this.sparqlClient.query.select(query)) {
      const conceptSchemeIdentifier = resultRow["conceptScheme"];
      if (
        conceptSchemeIdentifier &&
        (conceptSchemeIdentifier.termType === "BlankNode" ||
          conceptSchemeIdentifier.termType === "NamedNode")
      ) {
        conceptSchemes.push(
          new ConceptScheme({
            identifier: conceptSchemeIdentifier,
            sparqlClient: this.sparqlClient,
          }),
        );
      }
    }

    return conceptSchemes;
  }
}
