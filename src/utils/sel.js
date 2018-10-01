import { select } from "d3-selection";
import "d3-transition";

export default function(o) {
  Object.defineProperty(o, "sel", {
    get() {
      return select(this.el);
    }
  });

  return o;
}
