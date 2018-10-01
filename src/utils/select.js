import { isFunction } from "d3-let";
import { select } from "d3-selection";

export default el => (!el || !isFunction(el.size) ? select(el) : el);
