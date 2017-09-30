import {select} from 'd3-selection';
import {inBrowser} from 'd3-let';


if (inBrowser) {
    // DOM observer
    // Check for changes in the DOM that leads to visual actions
    const observer = new MutationObserver(visualManager);
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
}

//
//  Clears visualisation going out of scope
function visualManager (records) {
    records.forEach(record => {
        var nodes = record.removedNodes;
        let sel;
        if (!nodes || !nodes.length) return;  // phantomJs hack
        nodes.forEach(node => {
            if (node.nodeName !== '#text') {
                sel = select(node);
                if (sel.view()) {
                    sel.selectAll('*').each(destroy);
                    destroy.call(node);
                }
            }
        });
    });
}


function destroy () {
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
