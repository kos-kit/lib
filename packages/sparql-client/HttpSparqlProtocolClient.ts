import { NamedNode } from "@rdfjs/types";
import { HttpSparqlBaseClient } from "./HttpSparqlBaseClient.js";

/**
 * Abstract base class for SPARQL 1.1 Protocol clients (query and update).
 */
export abstract class HttpSparqlProtocolClient<
  RequestOptionsT extends HttpSparqlProtocolClient.RequestOptions,
> extends HttpSparqlBaseClient<RequestOptionsT> {
  protected requestOptionsToUrlSearchParams(
    urlSearchParams: URLSearchParams,
    requestOptions?: RequestOptionsT,
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

export namespace HttpSparqlProtocolClient {
  export interface Parameters<RequestOptionsT extends RequestOptions>
    extends HttpSparqlBaseClient.Parameters<RequestOptionsT> {}

  export interface RequestOptions extends HttpSparqlBaseClient.RequestOptions {
    usingDefaultGraphAsUnion?: boolean;
    usingGraphUris?: readonly NamedNode[];
    usingNamedGraphUris?: readonly NamedNode[];
    usingUnionGraph?: boolean; // Oxigraph extension
  }
}
