import basex from "base-x";

export const fileStemCodec = basex(
  // [0-9A-Za-z_]+
  // Should match isSafeFileStem
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_",
);
