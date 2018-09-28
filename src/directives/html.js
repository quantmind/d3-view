import { isNumber, isString } from "d3-let";
//
//  d3-html
//  =============
//  attach html or text to the innerHtml property and mount components if required
//
//  Usage:
//      <div id="foo" d3-html="output"></div>
export default {
  refresh(model, html) {
    if (isNumber(html)) html = "" + html;
    if (isString(html)) {
      var dir = this,
        sel = this.sel,
        transition = this.passes ? this.transition(sel) : null;
      if (transition) {
        transition.style("opacity", 0).on("end", () => {
          sel.html(html);
          dir.selectChildren().mount();
          dir.transition(sel).style("opacity", 1);
        });
      } else {
        sel.html(html);
        this.selectChildren().mount();
      }
    }
  }
};
