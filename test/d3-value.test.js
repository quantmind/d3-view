import view, { nextTick, trigger } from "./utils";

describe("d3-value -", () => {
  test("textarea", async () => {
    var vm = new view(),
      el = vm.viewElement(
        '<textarea d3-value="foo">Initial text value</textarea>'
      );

    await vm.mount(el);
    var model = vm.model;

    expect(model.foo).toBe("Initial text value");

    // Model => DOM binding
    model.foo = "a new value";
    expect(model.foo).toBe("a new value");
    expect(vm.sel.property("value")).toBe("Initial text value");
    await nextTick();
    expect(vm.sel.property("value")).toBe("a new value");
    // DOM => Model binding
    vm.sel.property("value", "ciao");
    trigger(vm.el, "change");
    expect(model.foo).toBe("a new value");
    await nextTick();
    expect(model.foo).toBe("ciao");
  });
});
