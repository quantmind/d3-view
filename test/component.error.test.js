import view from "./utils";

describe("Component Errors -", () => {
  let count, logs, vm;

  function handle(cm) {
    count += 1;
    expect(cm.name).toBe("testing");
  }

  beforeEach(() => {
    count = 0;
    vm = view();
    vm.providers.logger.pop();
    vm.events.on("error.test", handle);
  });

  test("error", async () => {
    vm.addComponent("testing", function() {
      throw new Error("a synchronous crash");
    });
    await vm.mount(vm.viewElement("<div><testing /></div>"));
    expect(count).toBe(1);
    expect(vm.sel.html()).toBe("<testing></testing>");
    logs = vm.providers.logger.pop();
    expect(logs.length).toBe(2);
    vm.mount("#foo");
    logs = vm.providers.logger.pop();
    expect(logs.length).toBe(1);
  });

  test("no element", async () => {
    vm.addComponent("testing", function() {});
    await vm.mount(vm.viewElement("<div><testing /></div>"));
    expect(count).toBe(1);
    expect(vm.sel.html()).toBe("<testing></testing>");
    logs = vm.providers.logger.pop();
    expect(logs.length).toBe(2);
  });

  test("multiple elements", async () => {
    vm.addComponent("testing", function() {
      var d = this.select(this.viewElement("<div><p>a</p><p>b</p></div>"));
      return d.selectAll("p");
    });
    await vm.mount(vm.viewElement("<div><testing /></div>"));
    expect(count).toBe(0);
    expect(vm.sel.html()).toBe("<p>a</p>");
    logs = vm.providers.logger.pop();
    expect(logs.length).toBe(1);
  });
});
