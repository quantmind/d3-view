import view from "./utils";

describe("Cache -", () => {
  test("operations", () => {
    var vm = view();
    expect(vm.cache.get("foo")).toBe(undefined);
    expect(vm.cache.has("foo")).toBe(false);
    expect(vm.cache.delete("foo")).toBe(false);
    expect(vm.cache.set("foo", "test")).toBe(undefined);
    expect(vm.cache.has("foo")).toBe(true);
    expect(vm.cache.delete("foo")).toBe(true);
    expect(vm.cache.get("foo")).toBe(undefined);
    expect(vm.cache.set("foo", "test")).toBe(undefined);
    expect(vm.cache.get("foo")).toBe("test");
    vm.cache.clear();
    expect(vm.cache.get("foo")).toBe(undefined);
  });

  test("not active", () => {
    var vm = view();
    expect(vm.cache.set("foo", "test")).toBe(undefined);
    vm.cache.active = false;
    expect(vm.cache.get("foo")).toBe(undefined);
    expect(vm.cache.has("foo")).toBe(false);
    expect(vm.cache.set("bee", "test2")).toBe(undefined);
    expect(vm.cache.get("bee")).toBe(undefined);
    expect(vm.cache.has("bee")).toBe(false);
    vm.cache.active = true;
    expect(vm.cache.get("foo")).toBe("test");
    expect(vm.cache.get("bee")).toBe(undefined);
  });
});
