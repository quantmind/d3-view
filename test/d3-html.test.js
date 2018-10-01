import view, { nextTick, sleep } from "./utils";

describe("d3-html", () => {
  test("transition", async () => {
    var vm = view({
        model: {
          test: "This is a test"
        }
      }),
      el = vm.select("body").append("div");

    el.append("p")
      .attr("d3-html", "test")
      .attr("data-transition-duration", 100)
      .html("Bla");
    await vm.mount(el);

    expect(vm.sel.html()).toBe(
      '<p data-transition-duration="100">This is a test</p>'
    );

    vm.model.test = "test reactivity";
    expect(vm.sel.select("p").html()).toBe("This is a test");
    await nextTick();
    expect(vm.sel.select("p").html()).toBe("This is a test");
    await sleep(300);
    expect(vm.sel.select("p").html()).toBe("test reactivity");
    // test with number
    vm.model.test = 11;
    await sleep(300);
    expect(vm.sel.select("p").html()).toBe("11");
    //
    var event = vm.model.$events.get("test"),
      p = vm.sel.select("p"),
      dir = p.directives().all[0],
      callback = event.on(`change.${dir.uid}`);
    expect(dir.name).toBe("d3-html");
    expect(callback).toBeTruthy();
    //
    // Remove the element
    // p.remove();
    //
    //while (callback) {
    //  await nextTick();
    //  callback = event.on(`change.${dir.uid}`);
    //}
    //vm.destroy();
  });

  test("nested one level", async () => {
    var vm = view({
      model: {
        messages: {
          msg1: "This is a test"
        }
      }
    });
    await vm.mount(vm.viewElement('<div d3-html="messages.msg1"></div>'));
    await nextTick();
    expect(vm.sel.html()).toBe("This is a test");

    vm.model.messages.msg1 = "test reactivity";
    expect(vm.sel.html()).toBe("This is a test");
    await nextTick();
    expect(vm.sel.html()).toBe("test reactivity");
  });

  test("nested two levels", async () => {
    var vm = view({
      model: {
        messages: {
          next: {
            msg1: "This is a test"
          }
        }
      }
    });
    await vm.mount(vm.viewElement('<div d3-html="messages.next.msg1"></div>'));
    await nextTick();
    expect(vm.sel.html()).toBe("This is a test");

    vm.model.messages.next.msg1 = "test reactivity";
    vm.model.messages.next.msg1 = "test reactivity2";
    expect(vm.sel.html()).toBe("This is a test");
    await nextTick();
    expect(vm.sel.html()).toBe("test reactivity2");
  });

  test("html mount", async () => {
    var vm = view({
      model: {
        html: "simple"
      },
      components: {
        boom() {
          return this.viewElement("<p>Boom!</p>");
        }
      }
    });
    await vm.mount(vm.viewElement('<div d3-html="html"></div>'));
    await nextTick();
    expect(vm.sel.html()).toBe("simple");
    vm.model.html = "<boom></boom>";
    await nextTick();
    expect(vm.sel.html()).toBe("<p>Boom!</p>");
  });
});
