import { GraphPattern } from "../GraphPattern.js";
import { testGraphPatterns } from "./testGraphPatterns.js";

export function testGraphPattern(
  inputTtl: string,
  graphPattern: GraphPattern,
  options?: {
    expectedOutputTtl?: string;
  },
): void {
  testGraphPatterns(inputTtl, [graphPattern], options);
}
