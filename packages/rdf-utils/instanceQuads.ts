import { DatasetCore, NamedNode, Quad } from "@rdfjs/types";
import TermSet from "@rdfjs/term-set";
import { rdf, rdfs } from "@tpluscode/rdf-ns-builders";

/**
 * Get all unique RDF instanceQuads of a given class in the given dataset.
 *
 * Returns the quads declaring an instance to be of the given class or one of its subclasses.
 */
export function* instanceQuads({
  class_,
  dataset,
  includeSubclasses,
  instanceOfPredicate,
  subClassOfPredicate,
}: {
  class_: NamedNode;
  dataset: DatasetCore;
  includeSubclasses: boolean;
  instanceOfPredicate?: NamedNode;
  subClassOfPredicate?: NamedNode;
}): Iterable<Quad> {
  yield* instanceQuadsRecursive({
    class_,
    dataset,
    includeSubclasses,
    instanceOfPredicate: instanceOfPredicate ?? rdf.type,
    instanceQuads: new TermSet<Quad>(),
    subClassOfPredicate: subClassOfPredicate ?? rdfs.subClassOf,
    visitedClasses: new TermSet<NamedNode>(),
  });
}

function* instanceQuadsRecursive({
  class_,
  dataset,
  includeSubclasses,
  instanceOfPredicate,
  instanceQuads,
  subClassOfPredicate,
  visitedClasses,
}: {
  class_: NamedNode;
  dataset: DatasetCore;
  includeSubclasses: boolean;
  instanceOfPredicate: NamedNode;
  instanceQuads: TermSet<Quad>;
  subClassOfPredicate: NamedNode;
  visitedClasses: TermSet<NamedNode>;
}): Iterable<Quad> {
  // Get instanceQuads of the class
  for (const quad of dataset.match(null, instanceOfPredicate, class_)) {
    switch (quad.subject.termType) {
      case "BlankNode":
      case "NamedNode":
        if (!instanceQuads.has(quad)) {
          yield quad;
          instanceQuads.add(quad);
        }
        break;
      default:
        break;
    }
  }

  visitedClasses.add(class_);

  if (!includeSubclasses) {
    return;
  }

  // Recurse into class's sub-classes that haven't been visited yet.
  for (const quad of dataset.match(null, subClassOfPredicate, class_, null)) {
    if (quad.subject.termType !== "NamedNode") {
      continue;
    } else if (visitedClasses.has(quad.subject)) {
      continue;
    }
    yield* instanceQuadsRecursive({
      class_: quad.subject,
      dataset,
      includeSubclasses,
      instanceOfPredicate,
      instanceQuads,
      subClassOfPredicate,
      visitedClasses,
    });
  }
}