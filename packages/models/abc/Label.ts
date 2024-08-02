import { Label as ILabel } from "../Label.js";

export namespace Label {
  export function equals(left: ILabel, right: ILabel): boolean {
    if (left.type.type !== right.type.type) {
      return false;
    }

    if (!left.literalForm.equals(right.literalForm)) {
      return false;
    }

    return true;
  }
}
