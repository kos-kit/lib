import { URLSearchParams } from "node:url";
import { NamedNode } from "@rdfjs/types";
import { HttpSparqlBaseClient } from "./HttpSparqlBaseClient.js";
import { SparqlUpdateClient } from "./SparqlUpdateClient.js";

export class HttpSparqlUpdateClient
  extends HttpSparqlBaseClient<HttpSparqlUpdateClient.RequestOptions>
  implements SparqlUpdateClient
{
  async update(
    update: string,
    options?: HttpSparqlUpdateClient.RequestOptions,
  ): Promise<void> {
    const method =
      options?.method ?? this.defaultRequestOptions?.method ?? "POSTDirectly";

    const url = new URL(this.endpointUrl);
    switch (method) {
      case "POSTDirectly": {
        const headers = this.requestHeaders(
          {
            contentType: "application/sparql-update; charset=utf-8",
          },
          options,
        );

        this.requestOptionsToUrlSearchParams(url.searchParams, options);

        await this.fetch(url, {
          body: update,
          headers,
          method: "POST",
        });
        return;
      }
      case "POSTWithUrlEncodedParameters": {
        const headers = this.requestHeaders(
          {
            contentType: "application/x-www-form-urlencoded",
          },
          options,
        );

        const urlEncodedParameters = new URLSearchParams();
        this.requestOptionsToUrlSearchParams(urlEncodedParameters, options);
        urlEncodedParameters.set("update", update);

        await this.fetch(url, {
          body: urlEncodedParameters,
          headers,
          method: "POST",
        });
      }
    }
  }

  private requestOptionsToUrlSearchParams(
    urlSearchParams: URLSearchParams,
    requestOptions?: HttpSparqlUpdateClient.RequestOptions,
  ): void {
    for (const usingGraphUri of requestOptions?.usingGraphUris ??
      this.defaultRequestOptions?.usingGraphUris ??
      []) {
      urlSearchParams.append("using-graph-uri", usingGraphUri.value);
    }

    for (const usingNamedGraphUri of requestOptions?.usingNamedGraphUris ??
      this.defaultRequestOptions?.usingNamedGraphUris ??
      []) {
      urlSearchParams.append("using-named-graph-uri", usingNamedGraphUri.value);
    }

    if (
      requestOptions?.usingUnionGraph ??
      this.defaultRequestOptions?.usingUnionGraph ??
      false
    ) {
      urlSearchParams.append("using-union-graph", "");
    }
  }
}

export namespace HttpSparqlUpdateClient {
  export type Parameters = HttpSparqlBaseClient.Parameters<RequestOptions>;

  export interface RequestOptions extends HttpSparqlBaseClient.RequestOptions {
    method?: "POSTDirectly" | "POSTWithUrlEncodedParameters";
    usingGraphUris?: readonly NamedNode[];
    usingNamedGraphUris?: readonly NamedNode[];
    usingUnionGraph?: boolean; // Oxigraph extension
  }
}
