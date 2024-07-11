import { describe, expect, it } from "vitest";
import { isSafeFileStem } from "../isSafeFileStem.js";

describe("isSafeFileStem", () => {
  for (const fileStem of ["test", "0test", "testA"]) {
    it(`should consider '${fileStem}' safe`, () => {
      expect(isSafeFileStem(fileStem)).toStrictEqual(true);
    });
  }

  for (const fileStem of ["test.", "test-", "test+"]) {
    it(`should consider '${fileStem}' unsafe`, () => {
      expect(isSafeFileStem(fileStem)).toStrictEqual(false);
    });
  }
});
