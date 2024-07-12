import { describe, it } from "vitest";
import { isSafeFileStem } from "../isSafeFileStem.js";
import { safeFileStems } from "./safeFileStems.js";
import { unsafeFileStems } from "./unsafeFileStems.js";

describe("isSafeFileStem", () => {
  for (const fileStem of safeFileStems) {
    it(`should consider '${fileStem}' safe`, ({ expect }) => {
      expect(isSafeFileStem(fileStem)).toStrictEqual(true);
    });
  }

  for (const fileStem of unsafeFileStems) {
    it(`should consider '${fileStem}' unsafe`, ({ expect }) => {
      expect(isSafeFileStem(fileStem)).toStrictEqual(false);
    });
  }
});
