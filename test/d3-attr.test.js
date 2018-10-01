import view, { nextTick } from "./utils";

describe("d3-attr -", function() {
  test("simple", async () => {
    var vm = view({
      model: {
        test: "This is a test"
      }
    });
    await vm.mount(vm.viewElement('<div d3-attr-foo="test">Bla</div>'));

    expect(vm.sel.attr("foo")).toBe("This is a test");
    vm.model.test = "test reactivity";
    expect(vm.sel.attr("foo")).toBe("This is a test");

    await nextTick();
    expect(vm.sel.attr("foo")).toBe("test reactivity");
  });

  test("class", async () => {
    var vm = view({
      model: {
        test: "bright"
      }
    });
    await vm.mount(vm.viewElement('<div d3-class="test">Bla</div>'));

    expect(vm.sel.classed("bright")).toBe(true);
    vm.model.test = "dark foo";
    expect(vm.sel.classed("bright")).toBe(true);
    expect(vm.sel.classed("dark")).toBe(false);
    expect(vm.sel.classed("foo")).toBe(false);
    await nextTick();

    expect(vm.sel.classed("bright")).toBe(false);
    expect(vm.sel.classed("dark")).toBe(true);
    expect(vm.sel.classed("foo")).toBe(true);
  });

  test("class complex", async () => {
    var vm = view({
      model: {
        test: true,
        test2: false
      }
    });
    await vm.mount(
      vm.viewElement(
        `<div d3-class="[['bright', test],['kappa', test2]]">Bla</div>`
      )
    );

    expect(vm.sel.classed("bright")).toBe(true);
    expect(vm.sel.classed("kappa")).toBe(false);
    vm.model.test2 = true;
    await nextTick();
    expect(vm.sel.classed("bright")).toBe(true);
    expect(vm.sel.classed("kappa")).toBe(true);
    vm.model.test = false;
    await nextTick();
    expect(vm.sel.classed("bright")).toBe(false);
    expect(vm.sel.classed("kappa")).toBe(true);
  });

  test("errors", async () => {
    let vm = view({
      model: {
        test: "bright"
      }
    });
    vm.providers.logger.pop();
    await vm.mount(vm.viewElement('<div d3-attr="test">Bla</div>'));
    expect(vm.providers.logger.pop().length).toBe(1);
    vm = view({
      model: {
        test: ["bright", "foo"]
      }
    });
    vm.providers.logger.pop();
    await vm.mount(vm.viewElement('<div d3-attr-placeholder="test">Bla</div>'));
    expect(vm.providers.logger.pop().length).toBe(1);
  });
});
