import view, { getWaiter, trigger } from "./utils";

describe("d3-on -", function() {
  test("no expression", async () => {
    var ev,
      waiter = getWaiter(),
      vm = view({
        model: {
          $test: test
        }
      });
    await vm.mount(
      vm
        .select("body")
        .append("div")
        .html('<p d3-on="$test($event)">Bla</p>')
    );

    var sel = vm.sel.select("p");

    expect(sel.attr("d3-on")).toBe(null);
    var d = sel.directives().all[0];
    expect(d).toBeTruthy();
    expect(d.name).toBe("d3-on");

    trigger(sel.node(), "click");
    await waiter.promise;
    expect(ev).toBeTruthy();
    expect(ev.type).toBe("click");
    expect(ev.defaultPrevented).toBe(false);

    function test(event) {
      ev = event;
      waiter.resolve(null);
    }

    vm.sel.select("p").remove();
  });

  test("model function", async () => {
    var waiter = getWaiter(),
      vm = view({
        model: {
          $test: test
        }
      });
    await vm.mount(vm.viewElement('<div><p d3-on="$test()">Bla</p></div>'));

    var sel = vm.sel.select("p");

    expect(sel.attr("d3-on")).toBe(null);
    var d = sel.directives().all[0];
    expect(d).toBeTruthy();
    expect(d.name).toBe("d3-on");

    trigger(sel.node(), "click");
    await waiter.promise;

    function test() {
      expect(this.parent).toBe(vm.model);
      expect(this.isolated).toBe(false);
      waiter.resolve();
    }
  });
});
