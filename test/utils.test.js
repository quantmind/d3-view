import {
  viewDebounce,
  viewProviders,
  viewReady,
  viewSelect,
  viewSlugify
} from "../index";
import maybeJson from "../src/utils/maybeJson";
import view from "./utils";

describe("Utils -", () => {
  const nextTick = viewDebounce();

  it("maybeJson", () => {
    expect(maybeJson("foo")).toBe("foo");
  });

  test("viewReady", async () => {
    var cbs = viewProviders.readyCallbacks,
      called = 0;

    viewReady(ready);
    expect(cbs.length).toBe(0);
    expect(called).toBe(0);

    await nextTick();
    expect(called).toBe(1);

    function ready() {
      called += 1;
    }
  });

  test("viewMount", async () => {
    var vm = view({
      components: {
        msg: {
          model: {
            message: "Hi there!"
          },
          render() {
            return this.viewElement('<p d3-html="message"></p>');
          }
        }
      }
    });
    var el = vm.viewElement("<div></div>");
    await vm.mount(el);
    await vm.sel.append("msg").mount({ message: "test message" });
    expect(vm.sel.select("p").html()).toBe("test message");

    var cm = vm.sel.select("p").view();
    expect(cm.model.message).toBe("test message");
    cm.model.message = "Bye";
    await nextTick();
    expect(vm.sel.select("p").html()).toBe("Bye");
  });

  test("viewSlugify", async () => {
    expect(viewSlugify("ABC")).toBe("abc");
    expect(viewSlugify("A c")).toBe("a-c");
    expect(viewSlugify("how are you??")).toBe("how-are-you");
    expect(viewSlugify("???")).toBe("");
  });

  test("viewDebounce", async () => {
    var debounced = viewDebounce((a, b) => {
      return a + b;
    });
    expect(debounced.promise()).toBe(null);
    expect(debounced(3, 4)).toBe(debounced(5, 6));
    expect(debounced.promise()).toBe(debounced(7, 8));
    var result = await debounced(10, 20);
    expect(result).toBe(30);
  });

  test("viewSelect", () => {
    const vm = view();
    var el = vm.createElement("div");
    expect(viewSelect(el)).toBe(el);
  });

  test("selectAll", () => {
    const vm = view();
    expect(vm.selectAll("div")).toBeTruthy();
  });
});
