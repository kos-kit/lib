import { describe, it } from "vitest";
import { encodeFileName } from "../encodeFileName.js";
import { safeFileStems } from "./safeFileStems.js";
import { unsafeFileStems } from "./unsafeFileStems.js";
import { decodeFileName } from "../decodeFileName.js";

describe("encodeFileName", () => {
  for (const fileStem of safeFileStems.concat(unsafeFileStems)) {
    it(`should encode and decode '${fileStem}'`, ({ expect }) => {
      expect(decodeFileName(encodeFileName(fileStem))).toStrictEqual(fileStem);
    });
  }
});
