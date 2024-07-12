import { describe, it } from "vitest";
import { encodeFileName } from "../encodeFileName.js";
import { safeFileNames } from "./safeFileNames.js";
import { unsafeFileNames } from "./unsafeFileNames.js";
import { decodeFileName } from "../decodeFileName.js";

describe("decodeFileName", () => {
  for (const fileName of safeFileNames.concat(unsafeFileNames)) {
    it(`should encode and decode '${fileName}'`, ({ expect }) => {
      expect(decodeFileName(encodeFileName(fileName))).toStrictEqual(fileName);
    });
  }
});
