export function isSafeFileStem(fileStem: string): boolean {
  // Should match fileNameCodec
  return fileStem.match(/^[0-9A-Za-z_]+$/) !== null;
}
