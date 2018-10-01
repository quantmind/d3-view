//
//  d3-if
//  =============
//
//  Show or hide an element
//
export default {
  mount(model) {
    var sel = this.sel;
    this.display = sel.style("display");
    this.opacity = +sel.style("opacity") || 1;
    if (!this.display || this.display === "none") this.display = "block";
    return model;
  },

  refresh(model, value) {
    var sel = this.sel,
      transition = this.passes ? this.transition(sel) : null;

    if (value) sel.style("display", this.display);
    else if (!transition) sel.style("display", "none");

    if (transition) {
      if (value) transition.style("opacity", 1);
      else
        transition
          .style("opacity", 0)
          .on("end", () => sel.style("display", "none"));
    } else sel.style("opacity", value ? this.opacity : 0);
  }
};
