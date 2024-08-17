import { URLSearchParams } from "node:url";
import { HttpSparqlProtocolClient } from "./HttpSparqlProtocolClient.js";
import { SparqlUpdateClient } from "./SparqlUpdateClient.js";

export class HttpSparqlUpdateClient
  extends HttpSparqlProtocolClient<HttpSparqlUpdateClient.RequestOptions>
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

        await this.checkResponse(
          await fetch(url, {
            body: update,
            headers,
            method: "POST",
          }),
        );
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

        await this.checkResponse(
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

export namespace HttpSparqlUpdateClient {
  export type Parameters = HttpSparqlProtocolClient.Parameters<RequestOptions>;

  export interface RequestOptions
    extends HttpSparqlProtocolClient.RequestOptions {
    method?: "POSTDirectly" | "POSTWithUrlEncodedParameters";
  }
}
