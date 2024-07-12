import { describe, it } from "vitest";
import { encodeFileName } from "../encodeFileName.js";
import { safeFileStems } from "./safeFileStems.js";
import { unsafeFileStems } from "./unsafeFileStems.js";

describe("encodeFileName", () => {
  for (const fileStem of safeFileStems.concat(unsafeFileStems)) {
    it(`should encode '${fileStem}'`, ({ expect }) => {
      expect(encodeFileName(fileStem)).not.toEqual(fileStem);
    });
  }
});
