export interface SparqlUpdateClient {
  update(update: string): Promise<void>;
}
