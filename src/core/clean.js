import { inBrowser } from "d3-let";
import { select } from "d3-selection";

if (inBrowser && window.MutationObserver) {
  // DOM observer
  // Check for changes in the DOM that leads to visual actions
  const observer = new window.MutationObserver(Manager);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}

//
//  Clears element going out of scope
function Manager(records) {
  let sel, nodes, node, vm;

  records.forEach(record => {
    nodes = record.removedNodes;
    if (!nodes || !nodes.length) return;
    vm = record.target ? select(record.target).view() : null;

    for (let i = 0; i < nodes.length; ++i) {
      node = nodes[i];
      if (!node.querySelectorAll || node.__d3_component__) continue;
      sel = select(node);
      if (vm || sel.view()) {
        sel.selectAll("*").each(destroy);
        destroy.call(nodes[i]);
      }
    }
  });
}

function destroy() {
  var dirs = this.__d3_directives__,
    view = this.__d3_view__;
  if (dirs) {
    dirs.all.forEach(d => d.destroy());
    delete this.__d3_directives__;
  }
  if (view) {
    view.destroy();
    delete this.__d3_view__;
  }
}
