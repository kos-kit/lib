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
  readonly query: SparqlClient.Query;
  readonly store: SparqlClient.Store | null;
  readonly update: SparqlClient.Update | null;

  constructor({
    dataFactoryConstructor,
    datasetCoreFactoryConstructor,
    queryEndpointUrl,
    storeEndpointUrl,
    updateEndpointUrl,
    ...queryOptions
  }: {
    dataFactoryConstructor: new () => DataFactory;
    datasetCoreFactoryConstructor: new () => DatasetCoreFactory;
    queryEndpointUrl: string;
    storeEndpointUrl: string | null;
    updateEndpointUrl: string | null;
  } & QueryOptions) {
    const factory = new Environment([
      dataFactoryConstructor,
      datasetCoreFactoryConstructor,
    ]);

    const queryDelegate = new ParsingDelegate({
      endpointUrl: queryEndpointUrl,
    });
    this.query = {
      ask: (query: string) => queryDelegate.query.ask(query, queryOptions),
      construct: (query: string) =>
        queryDelegate.query.construct(query, queryOptions),
      select: (query: string) =>
        queryDelegate.query.select(query, queryOptions),
    };

    if (storeEndpointUrl) {
      const storeDelegate = new SimpleDelegate<RawQuery, StreamStore>({
        factory,
        Store: StreamStore,
        storeUrl: storeEndpointUrl,
      });

      this.store = {
        post: (
          stream: Stream,
          options?: { graph?: Quad_Graph },
        ): Promise<void> => {
          return storeDelegate.store.post(stream, options);
        },

        put: async (
          stream: Stream,
          options?: { graph?: Quad_Graph },
        ): Promise<void> => {
          return storeDelegate.store.put(stream, options);
        },
      };
    } else {
      this.store = null;
    }

    if (updateEndpointUrl) {
      const updateDelegate = new SimpleDelegate({
        factory,
        updateUrl: updateEndpointUrl,
      });
      this.update = {
        update: async (query: string) => {
          await updateDelegate.query.update(query, queryOptions);
        },
      };
    } else {
      this.update = null;
    }
  }
}
