import { dispatch } from "d3-dispatch";
import debounce from "../utils/debounce";

export default () => {
  let triggered = 0;

  const events = dispatch("change");

  function change() {
    events.apply("change", this, arguments);
    triggered += 1;
  }

  return {
    change,
    on(typename, callback) {
      if (arguments.length < 2) return events.on(typename);
      events.on(typename, callback);
      return this;
    },
    trigger: debounce(change),
    triggered() {
      return triggered;
    }
  };
};
