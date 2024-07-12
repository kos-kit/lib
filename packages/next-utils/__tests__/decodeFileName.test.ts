import { describe, it } from "vitest";
import { encodeFileName } from "../encodeFileName.js";
import { safeFileNames } from "./safeFileNames.js";
import { unsafeFileNames } from "./unsafeFileNames.js";
import { decodeFileName } from "../decodeFileName.js";

describe("decodeFileName", () => {
  for (const fileName of unsafeFileNames.concat(safeFileNames)) {
    it(`should encode and decode '${fileName}'`, ({ expect }) => {
      const encodedFileName = encodeFileName(fileName);
      const decodedFileName = decodeFileName(encodedFileName);
      expect(decodedFileName).toStrictEqual(fileName);
    });
  }
});
