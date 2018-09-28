import "./core/clean";
import { createComponent, extendDirectives, protoView } from "./core/component";
import directives from "./directives/index";

// Core Directives
const coreDirectives = extendDirectives(new Map(), directives);

// the root view constructor
export default config =>
  createComponent("view", protoView, coreDirectives)(config);
