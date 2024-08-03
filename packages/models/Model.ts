/**
 * Models are implemented in the spirit of Labeled Property Graphs:
 * - "properties" such as labels (skos:prefLabel, et al.), rights, et al. should be available as instance members in memory / without asynchronous calls.
 * - "relationships" such as broader concepts, in-concept scheme, et al. should be retrieved via asynchronous calls.
 *
 * That means that creating a new instance of a model, such as a Concept, entails retrieving all of its instance "properties" first with e.g., a SPARQL query.
 *
 * The line between "properties" and "relationships" can be intentionally blurred. For example:
 * - Not all literals attached to an instance have to be "properties". Literals that would take up significant space (long strings, large arrays, etc.) can be retrieved via asynchronous methods instead.
 * - Related RDF resources such as skosxl:Label instances can be retrieved as "properties".
 */
export interface Model {
  readonly displayLabel: string;
}
