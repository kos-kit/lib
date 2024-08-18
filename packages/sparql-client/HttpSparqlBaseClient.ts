import { Logger, pino } from "pino";

/**
 * Abstract base class for HTTP-based SPARQL clients.
 */
export abstract class HttpSparqlBaseClient<
  RequestOptionsT extends HttpSparqlBaseClient.RequestOptions,
> {
  protected defaultRequestOptions?: RequestOptionsT;
  protected readonly endpointUrl: string;
  protected readonly logger: Logger;

  constructor({
    defaultRequestOptions,
    endpointUrl,
    logger,
  }: HttpSparqlBaseClient.Parameters<RequestOptionsT>) {
    this.defaultRequestOptions = defaultRequestOptions;
    this.endpointUrl = endpointUrl;
    this.logger =
      logger ??
      pino({
        level: "silent",
      });
  }

  protected async fetch(input: URL, init?: RequestInit): Promise<Response> {
    this.logger.debug("fetching %s", input);
    if (this.logger.isLevelEnabled("trace")) {
      this.logger.trace("request method: %s", init?.method ?? "GET");
      if (init?.headers && init.headers instanceof Headers) {
        for (const [name, value] of init.headers.entries()) {
          this.logger.trace("request header: %s: %s", name, value);
        }
      }
      if (init?.body && typeof init.body === "string") {
        this.logger.trace(
          "request body (length=%s):\n%s",
          init.body.length,
          init.body,
        );
      }
    }

    const response = await fetch(input, init);

    if (response.ok) {
      return response;
    }

    throw new Error(
      `${response.status} ${response.statusText}: ${await response.text()}`,
    );
  }

  /**
   * Merge headers from requestOptions and defaultRequestOptions.
   *
   * Does a defensive copy as necessary, so the return value can be mutated.
   */
  protected requestHeaders(
    {
      accept,
      contentType,
    }: {
      accept?: string;
      contentType?: string;
    },
    requestOptions?: RequestOptionsT,
  ) {
    const mergedHeaders = new Headers();

    // Keep track of which headers should be set vs. appended
    // This is used to enforce the semantics that:
    // - requestOptions headers overwrite (set) defaultRequestOptions headers
    // - requestOptions headers don't overwrite (set) each other, but append
    const setHeaderNames = new Set<string>();
    if (this.defaultRequestOptions?.headers) {
      for (const [
        name,
        value,
      ] of this.defaultRequestOptions.headers.entries()) {
        mergedHeaders.append(name, value);
        setHeaderNames.add(name);
      }
    }

    if (requestOptions?.headers) {
      for (const [name, value] of requestOptions.headers.entries()) {
        if (setHeaderNames.has(name)) {
          mergedHeaders.set(name, value);
          setHeaderNames.delete(name); // Append if we see another header with that name.
        } else {
          mergedHeaders.append(name, value);
        }
      }
    }

    if (accept) {
      // Enforce our preference on accept
      mergedHeaders.set("accept", accept);
    }

    if (contentType) {
      mergedHeaders.append("content-type", contentType);
    } else {
      mergedHeaders.delete("content-type");
    }

    return mergedHeaders;
  }
}

export namespace HttpSparqlBaseClient {
  export interface Parameters<RequestOptionsT extends RequestOptions> {
    defaultRequestOptions?: RequestOptionsT;
    endpointUrl: string;
    logger?: Logger;
  }

  export interface RequestOptions {
    headers?: Headers;
  }
}
