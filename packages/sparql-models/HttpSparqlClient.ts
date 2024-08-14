import Environment from "@rdfjs/environment";
import {
  DataFactory,
  DatasetCoreFactory,
  Quad_Graph,
  Stream,
} from "@rdfjs/types";
import { QueryOptions, RawQuery, StreamStore } from "sparql-http-client";
import ParsingDelegate from "sparql-http-client/ParsingClient.js";
import SimpleDelegate from "sparql-http-client/SimpleClient.js";
import { SparqlClient } from "./SparqlClient.js";

export class HttpSparqlClient implements SparqlClient {
  private readonly queryOptions?: QueryOptions;
  private readonly queryDelegate: ParsingDelegate;
  private readonly storeDelegate: SimpleDelegate<RawQuery, StreamStore> | null;
  private readonly updateDelegate: SimpleDelegate | null;

  constructor({
    dataFactoryConstructor,
    datasetFactoryConstructor,
    queryEndpointUrl,
    storeEndpointUrl,
    updateEndpointUrl,
    ...queryOptions
  }: {
    dataFactoryConstructor: new () => DataFactory;
    datasetFactoryConstructor: new () => DatasetCoreFactory;
    queryEndpointUrl: string;
    storeEndpointUrl?: string;
    updateEndpointUrl?: string;
  } & QueryOptions) {
    const factory = new Environment([
      dataFactoryConstructor,
      datasetFactoryConstructor,
    ]);
    this.queryDelegate = new ParsingDelegate({
      endpointUrl: queryEndpointUrl,
    });
    this.queryOptions = queryOptions;
    this.storeDelegate = storeEndpointUrl
      ? new SimpleDelegate({
          factory,
          Store: StreamStore,
          storeUrl: storeEndpointUrl,
        })
      : null;
    this.updateDelegate = updateEndpointUrl
      ? new SimpleDelegate({
          factory,
          updateUrl: updateEndpointUrl,
        })
      : null;
  }

  readonly query: SparqlClient.Query = {
    ask: (query: string) =>
      this.queryDelegate.query.ask(query, this.queryOptions),
    construct: (query: string) =>
      this.queryDelegate.query.construct(query, this.queryOptions),
    select: (query: string) =>
      this.queryDelegate.query.select(query, this.queryOptions),
  };

  readonly store: SparqlClient.Store = {
    post: (stream: Stream, options?: { graph?: Quad_Graph }): Promise<void> => {
      if (this.storeDelegate === null) {
        throw new Error("no store endpoint configured");
      }
      return this.storeDelegate.store.post(stream, options);
    },

    put: async (
      stream: Stream,
      options?: { graph?: Quad_Graph },
    ): Promise<void> => {
      if (this.storeDelegate === null) {
        throw new Error("no store endpoint configured");
      }
      return this.storeDelegate.store.put(stream, options);
    },
  };

  readonly update: SparqlClient.Update = {
    update: async (query: string) => {
      if (this.updateDelegate === null) {
        throw new Error("no update endpoint configured");
      }
      await this.updateDelegate.query.update(query, this.queryOptions);
    },
  };
}
