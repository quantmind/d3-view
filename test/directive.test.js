import { isString } from "d3-let";
import view, { getWaiter, logger, nextTick } from "./utils";

describe("directive -", () => {
  test("custom", async () => {
    var vm = view({
      directives: {
        dummy: {}
      }
    });

    vm.addDirective("random", {
      refresh() {
        this.sel.html("" + Math.random());
      }
    });
    await vm.mount(vm.viewElement("<div d3-random d3-dummy></div>"));

    var dirs = vm.sel.directives();
    expect(dirs).toBeTruthy();
    expect(dirs.all.length).toBe(2);
    var mdir = new Map();
    dirs.all.forEach(d => {
      mdir.set(d.name, d);
    });
    var dir = mdir.get("d3-random");
    expect(dir.uid).toBeTruthy();
    expect(dir.name).toBe("d3-random");
    expect(dir.sel.node()).toBe(vm.el);
    expect(dir.active).toBe(true);
    expect(dir.identifiers.length).toBe(1);
    var num = +vm.sel.html();
    expect(num > 0).toBe(true);
    //
    vm.model.$change();
    await nextTick();
    var num2 = +vm.sel.html();
    expect(num2 > 0).toBe(true);
    expect(num2 !== num).toBe(true);
  });

  test("active", async () => {
    var vm = view(),
      el = vm
        .select("body")
        .append("div")
        .html(
          '<div id="target"></div><div id="key" d3-collapse="#target"></div>'
        ),
      gone = getWaiter();

    vm.addDirective("collapse", {
      // set target and set active
      create(expr) {
        this.target = expr;
        this.active = true;
      },
      refresh(model) {
        // the model is the root model
        expect(model.parent).toBe(undefined);
        model.testingFlag = true;
        if (isString(this.target)) this.target = this.select(this.target);
        this.target.classed("foo", true);
      },
      destroy(model) {
        gone.resolve();
        expect(model.parent).toBe(undefined);
        expect(model.testingFlag).toBe(true);
      }
    });
    await vm.mount(el);

    var dirs = vm.sel.select("#key").directives();
    expect(dirs).toBeTruthy();
    expect(dirs.all.length).toBe(1);
    var dir = dirs.all[0];
    expect(dir.uid).toBeTruthy();
    expect(dir.name).toBe("d3-collapse");
    expect(dir.active).toBe(true);
    expect(dir.target).toBeTruthy();
    expect(dir.target.attr("id")).toBe("target");
    expect(dir.expression).toBe(undefined);
    //
    // remove element
    vm.sel.remove();
    //await gone.promise;
  });

  // d3-if='$active(show, rootShow)'
  test("issue#21", async () => {
    var vm = view({
      model: {
        show: true
      },
      components: {
        simple: {
          model: {
            tabs: [
              {
                show: true,
                label: "test"
              }
            ],
            $active(s1, s2) {
              return s1 && s2;
            }
          },
          render() {
            return `<ul><li d3-for='tab in tabs' d3-if='parent.$active(tab.show, root.show)' d3-html='tab.label' style="display: inline;"></li></ul>`;
          }
        }
      }
    });
    await vm.mount(vm.viewElement("<div><simple></simple></div>"));
    var tab = vm.sel.selectAll("li");
    expect(tab.size()).toBe(1);
    expect(tab.style("display")).toBe("inline");
    var model = tab.model();
    expect(model.tab.$isReactive("show")).toBe(true);
    model.tab.show = false;
    await nextTick();
    expect(tab.style("display")).toBe("none");
    model.tab.show = true;
    await nextTick();
    expect(tab.style("display")).toBe("inline");
    vm.model.show = false;
    await nextTick();
    expect(tab.style("display")).toBe("none");
    vm.model.show = true;
    await nextTick();
    expect(tab.style("display")).toBe("inline");
  });

  test("unreactive identifier", async () => {
    logger.pop();
    var vm = view(),
      el = vm.viewElement('<div id="target" d3-html="xxxx.docs"></div>');

    await vm.mount(el);
    var logs = logger.pop();
    expect(logs.length).toBe(1);
    expect(logs[0]).toBe(
      '[d3-html] "xxxx" is not an object, cannot bind to "xxxx.docs" identifier'
    );
  });

  test("json data", async () => {
    var vm = view();

    vm.addDirective("random", {
      refresh(model, options) {
        var min = options ? options.min || 0 : 0;
        this.sel.html("" + (min + Math.random()));
      }
    });
    await vm.mount(vm.viewElement(`<div d3-random='{"min": 5}'></div>`));
    var dirs = vm.sel.directives();
    expect(dirs).toBeTruthy();
    expect(dirs.all.length).toBe(1);
    var dir = dirs.all[0];
    expect(dir.data).toBeTruthy();
    expect(dir.data.min).toBe(5);
    var num = +vm.sel.html();
    expect(num > 5).toBe(true);
  });
});
