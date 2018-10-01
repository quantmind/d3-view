import providers from "../utils/providers";
import base from "./base";

providers.transition = {
  duration: 0
};

export default Object.assign(base, {
  //
  // return a transition object if possible
  transition(sel) {
    if (!arguments.length) sel = this.sel;
    var duration = this.transitionDuration(sel);
    if (duration > 0) return sel.transition(this.uid).duration(duration);
  },

  transitionDuration(sel) {
    if (!arguments.length) sel = this.sel;
    if (sel && sel.size()) {
      var duration = sel.attr("data-transition-duration");
      return +(duration || providers.transition.duration);
    }
    return 0;
  }
});
