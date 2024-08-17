import { URLSearchParams } from "node:url";
import {
  BlankNode,
  DataFactory,
  DatasetCore,
  DatasetCoreFactory,
  Literal,
  NamedNode,
} from "@rdfjs/types";
import N3 from "n3";
import { HttpSparqlProtocolClient } from "./HttpSparqlProtocolClient.js";
import { SparqlQueryClient } from "./SparqlQueryClient.js";

export class HttpSparqlQueryClient
  extends HttpSparqlProtocolClient<HttpSparqlQueryClient.RequestOptions>
  implements SparqlQueryClient
{
  private readonly dataFactory: DataFactory;
  private readonly datasetCoreFactory: DatasetCoreFactory;

  constructor({
    dataFactory,
    datasetCoreFactory,
    ...superParameters
  }: HttpSparqlQueryClient.Parameters) {
    super(superParameters);
    this.dataFactory = dataFactory;
    this.datasetCoreFactory = datasetCoreFactory;
  }

  async queryBindings(
    query: string,
    options?: HttpSparqlQueryClient.RequestOptions,
  ): Promise<readonly Record<string, BlankNode | Literal | NamedNode>[]> {
    const response = await this.request(
      query,
      {
        accept: "application/sparql-results+json",
      },
      options,
    );
    // https://www.w3.org/TR/sparql11-results-json/
    const json = (await response.json()) as {
      readonly head: {
        readonly vars: readonly string[];
      };
      readonly results: {
        readonly bindings: readonly Record<
          string,
          | {
              type: "bnode";
              value: string;
            }
          | {
              datatype?: string;
              type: "literal" | "typed-literal";
              value: string;
              "xml:lang"?: string;
            }
          | {
              type: "uri";
              value: string;
            }
        >[];
      };
    };
    return json.results.bindings.map((jsonResultsBindings) => {
      const rdfjsBinding: Record<string, BlankNode | Literal | NamedNode> = {};
      for (const [key, value] of Object.entries(jsonResultsBindings)) {
        switch (value.type) {
          case "bnode":
            rdfjsBinding[key] = this.dataFactory.blankNode(value.value);
            break;
          case "literal":
            if (value.datatype) {
              rdfjsBinding[key] = this.dataFactory.literal(
                value.value,
                this.dataFactory.namedNode(value.datatype),
              );
            } else {
              rdfjsBinding[key] = this.dataFactory.literal(
                value.value,
                value["xml:lang"],
              );
            }
            break;
          case "uri":
            rdfjsBinding[key] = this.dataFactory.namedNode(value.value);
            break;
        }
      }
      return rdfjsBinding;
    });
  }

  async queryBoolean(
    query: string,
    options?: HttpSparqlQueryClient.RequestOptions,
  ): Promise<boolean> {
    const response = await this.request(
      query,
      {
        accept: "application/sparql-results+json",
      },
      options,
    );
    return (await response.json()).boolean;
  }

  async queryDataset(
    query: string,
    options?: HttpSparqlQueryClient.RequestOptions,
  ): Promise<DatasetCore> {
    const response = await this.request(
      query,
      {
        accept: "application/n-triples",
      },
      options,
    );
    return this.datasetCoreFactory.dataset(
      new N3.Parser({
        factory: this.dataFactory,
        format: "application/n-triples",
      }).parse(await response.text()),
    );
  }

  private async request(
    query: string,
    { accept }: { accept: string },
    options?: HttpSparqlQueryClient.RequestOptions,
  ): Promise<Response> {
    const method =
      options?.method ?? this.defaultRequestOptions?.method ?? "GET";

    const url = new URL(this.endpointUrl);
    switch (method) {
      case "GET": {
        const headers = this.requestHeaders({ accept }, options);

        url.searchParams.set("query", query);
        this.requestOptionsToUrlSearchParams(url.searchParams, options);

        return this.checkResponse(
          await fetch(url, {
            headers,
            method: "GET",
          }),
        );
      }
      case "POSTDirectly": {
        const headers = this.requestHeaders(
          {
            accept,
            contentType: "application/sparql-query; charset=utf-8",
          },
          options,
        );

        this.requestOptionsToUrlSearchParams(url.searchParams, options);

        return this.checkResponse(
          await fetch(url, {
            body: query,
            headers,
            method: "POST",
          }),
        );
      }
      case "POSTWithUrlEncodedParameters": {
        const headers = this.requestHeaders(
          {
            accept,
            contentType: "application/x-www-form-urlencoded",
          },
          options,
        );

        const urlEncodedParameters = new URLSearchParams();
        this.requestOptionsToUrlSearchParams(urlEncodedParameters, options);
        urlEncodedParameters.set("query", query);

        return this.checkResponse(
          await fetch(url, {
            body: urlEncodedParameters,
            headers,
            method: "POST",
          }),
        );
      }
    }
  }
}

export namespace HttpSparqlQueryClient {
  export interface Parameters
    extends HttpSparqlProtocolClient.Parameters<RequestOptions> {
    dataFactory: DataFactory;
    datasetCoreFactory: DatasetCoreFactory;
  }

  export interface RequestOptions
    extends HttpSparqlProtocolClient.RequestOptions {
    method?: "GET" | "POSTDirectly" | "POSTWithUrlEncodedParameters";
  }
}
