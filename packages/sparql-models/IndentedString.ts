export interface IndentedString {
  indent: number;
  string: string;
}

export namespace IndentedString {
  // biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
  export function toString({ indent, string }: IndentedString): string {
    return " ".repeat(indent) + string;
  }
}

export const TAB_SPACES = 2;
