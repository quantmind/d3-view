import view from "./utils";

describe("view meta -", () => {
  let el;

  beforeEach(() => {
    el = document.createElement("div");
  });

  test("transition", async () => {
    var vm = view();
    await vm.mount(el);
    vm.sel.attr("data-transition-duration", 250);
    expect(vm.transitionDuration()).toBe(250);
  });
});
