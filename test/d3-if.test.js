import { viewUid } from "../index";
import view, { nextTick, sleep } from "./utils";

describe("d3-if", () => {
  test("block", async () => {
    var uid = "test" + viewUid(),
      vm = view({
        model: {
          foo: false
        }
      });

    vm.select("body")
      .append("div")
      .attr("id", uid)
      .html('<p d3-if="foo">Hi</p>');

    await vm.mount(`#${uid}`);

    expect(vm.sel.selectAll("p").size()).toBe(1);
    var p = vm.sel.select("p");

    expect(p.style("display")).toBe("none");
    vm.model.foo = true;
    expect(p.style("display")).toBe("none");
    await nextTick();
    expect(p.style("display")).toBe("block");
    vm.sel.remove();
  });

  test("inline", async () => {
    var uid = "test" + viewUid(),
      vm = view({
        model: {
          foo: false
        }
      });

    vm.select("body")
      .append("div")
      .attr("id", uid)
      .html('<p d3-if="foo" style="display: inline">Hi there</p>');

    await vm.mount(`#${uid}`);

    expect(vm.sel.selectAll("p").size()).toBe(1);
    var p = vm.sel.select("p");
    expect(p.style("display")).toBe("none");
    vm.model.foo = true;
    expect(p.style("display")).toBe("none");
    await nextTick();
    expect(p.style("display")).toBe("inline");
    vm.sel.remove();
  });

  test("transition", async () => {
    var vm = view({
        model: {
          foo: false
        }
      }),
      el = vm.select("body").append("div");

    el.append("p")
      .attr("d3-if", "foo")
      .attr("data-transition-duration", 100)
      .html("Bla");
    await vm.mount(el);
    var p = vm.sel.select("p");
    expect(p.size()).toBe(1);
    expect(p.style("display")).toBe("none");
    expect(p.style("opacity")).toBe("0");
    vm.model.foo = true;
    await nextTick();
    expect(p.style("display")).toBe("block");
    expect(p.style("opacity")).toBe("0");
    await sleep(150);
    expect(p.style("display")).toBe("block");
    expect(p.style("opacity")).toBe("1");
    vm.model.foo = false;
    await nextTick();
    expect(p.style("display")).toBe("block");
    expect(p.style("opacity")).toBe("1");
    await sleep(150);
    expect(p.style("display")).toBe("none");
    expect(p.style("opacity")).toBe("0");
  });
});
