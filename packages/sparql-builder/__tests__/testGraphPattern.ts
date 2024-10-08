import { GraphPattern } from "../GraphPattern.js";
import { ArrayGraphPatterns } from "../GraphPatterns";
import { testGraphPatterns } from "./testGraphPatterns";

export function testGraphPattern(
  inputTtl: string,
  graphPattern: GraphPattern,
  options?: {
    expectedOutputTtl?: string;
  },
): void {
  testGraphPatterns(inputTtl, new ArrayGraphPatterns([graphPattern]), options);
}
