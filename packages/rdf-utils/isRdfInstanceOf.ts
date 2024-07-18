import TermSet from "@rdfjs/term-set";
import { BlankNode, DatasetCore, NamedNode } from "@rdfjs/types";
import { rdf, rdfs } from "@tpluscode/rdf-ns-builders";

export function isRdfInstanceOf({
  class_,
  instance,
  dataset,
  includeSubclasses,
  instanceOfPredicate,
  subClassOfPredicate,
}: {
  class_: NamedNode;
  dataset: DatasetCore;
  includeSubclasses?: boolean;
  instance: BlankNode | NamedNode;
  instanceOfPredicate?: NamedNode;
  subClassOfPredicate?: NamedNode;
}): boolean {
  return isRdfInstanceOfRecursive({
    class_,
    dataset,
    includeSubclasses: includeSubclasses ?? true,
    instance,
    instanceOfPredicate: instanceOfPredicate ?? rdf.type,
    subClassOfPredicate: subClassOfPredicate ?? rdfs.subClassOf,
    visitedClasses: new TermSet<NamedNode>(),
  });
}

function isRdfInstanceOfRecursive({
  class_,
  dataset,
  includeSubclasses,
  instance,
  instanceOfPredicate,
  subClassOfPredicate,
  visitedClasses,
}: {
  class_: NamedNode;
  dataset: DatasetCore;
  includeSubclasses: boolean;
  instance: BlankNode | NamedNode;
  instanceOfPredicate: NamedNode;
  subClassOfPredicate: NamedNode;
  visitedClasses: TermSet<NamedNode>;
}): boolean {
  for (const _ of dataset.match(instance, instanceOfPredicate, class_)) {
    return true;
  }

  visitedClasses.add(class_);

  if (!includeSubclasses) {
    return false;
  }

  // Recurse into class's sub-classes that haven't been visited yet.
  for (const quad of dataset.match(null, subClassOfPredicate, class_, null)) {
    if (quad.subject.termType !== "NamedNode") {
      continue;
    } else if (visitedClasses.has(quad.subject)) {
      continue;
    }
    if (
      isRdfInstanceOfRecursive({
        class_: quad.subject,
        dataset,
        includeSubclasses,
        instance,
        instanceOfPredicate,
        subClassOfPredicate,
        visitedClasses,
      })
    ) {
      return true;
    }
  }

  return false;
}
