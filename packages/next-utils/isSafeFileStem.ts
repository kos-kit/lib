export function isSafeFileStem(fileStem: string): boolean {
  return fileStem.match(/^[0-9A-Za-z]+$/) !== null;
}
