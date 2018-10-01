import { viewElement } from "../index";
import view, { getWaiter, numDefComponents, trigger } from "./utils";

describe("Components -", () => {
  var year = {
    render() {
      var date = new Date();
      return this.createElement("span")
        .attr("class", "year")
        .text(date.getFullYear());
    }
  };

  var text = {
    model: {
      text: "Hi!"
    },
    render() {
      return `
                <p d3-html='text'/>
            `;
    }
  };

  test("simple - no binding", async () => {
    var vm = view({
      components: {
        year: year
      }
    });
    // API pre-mount
    expect(vm.components.size).toBe(numDefComponents + 1);
    expect(vm.components.get("year")).toBeTruthy();
    expect(vm.components.get("year").prototype.isd3).toBe(true);
    // mount
    await vm.mount(viewElement('<div id="test1"><year></year></div>'));
    expect(vm.el.tagName).toBe("DIV");

    var span = vm.sel.select("span");
    expect(span.attr("class")).toBe("year");
    expect(+span.text()).toBeGreaterThan(2015);
    var c = span.model();
    expect(c).toBeTruthy();
    expect(c.parent).toBe(vm.model);
  });

  test("simple - sandwiched between standard elements", async () => {
    var vm = view({
      components: {
        year: year
      }
    });
    await vm.mount(
      viewElement(
        '<div id="test1"><h1>This Year</h1><year></year><p>Hi there</p></div>'
      )
    );
    var div = vm.el;
    expect(div.tagName).toBe("DIV");
    expect(div.children.length).toBe(3);
    expect(div.children[0].tagName).toBe("H1");
    expect(div.children[1].tagName).toBe("SPAN");
    expect(div.children[2].tagName).toBe("P");
    expect(vm.select(div.children[1]).model()).toBeTruthy();
    expect(vm.select(div.children[1]).model().parent).toBe(vm.model);
    expect(vm.select(div.children[0]).model()).toBe(vm.model);
    expect(vm.select(div.children[2]).model()).toBe(vm.model);
  });

  test("with model", async () => {
    var vm = view({
      components: {
        text: text
      }
    });
    expect(vm.components.size).toBe(numDefComponents + 1);

    await vm.mount(viewElement('<div id="test1"><text></text></div>'));
    expect(vm.el.tagName).toBe("DIV");
    var p = vm.sel.select("p");
    var model = p.model();
    expect(model).toBeTruthy();
    expect(model.parent).toBe(vm.model);
    expect(model.root).toBe(vm.model);
  });

  test("component function", async () => {
    var vm = view({
      components: {
        bla() {
          return "<p>bla bla</p>";
        }
      }
    });
    expect(vm.components.size).toBe(numDefComponents + 1);

    await vm.mount(viewElement("<div><bla></bla></div>"));
    var p = vm.sel.select("p");
    expect(p.size()).toBe(1);
    expect(p.html()).toBe("bla bla");
  });

  test("renderFromUrl", async () => {
    var vm = view({
      components: {
        bla() {
          return this.renderFromUrl("/test");
        }
      }
    });
    expect(vm.components.size).toBe(numDefComponents + 1);
    await vm.mount(vm.viewElement("<div><bla></bla></div>"));
    var p = vm.sel.select("p");
    expect(p.size()).toBe(1);
    expect(p.html()).toBe("This is a test");
    expect(vm.cache.has("/test")).toBe(true);
    var el = await vm.renderFromUrl("/test");
    expect(el.tagName).toBe("P");
  });

  test("inner html", async () => {
    let count_created = 0,
      count_mount = 0,
      count_mounted = 0;

    var vm = view({
      components: {
        bla(el) {
          return this.createElement("div")
            .classed("bla", true)
            .html(this.select(el).html());
        },
        year: year,
        remote() {
          return this.renderFromUrl("/test");
        }
      }
    });
    vm.events
      .on("created.test", _created)
      .on("mount.test", _mount)
      .on("mounted.test", _mounted);

    expect(vm.components.size).toBe(numDefComponents + 3);
    await vm.mount(
      vm.viewElement("<div><bla><year></year><remote></remote></bla></div>")
    );
    var b = vm.sel.select("div.bla").node();
    expect(b).toBeTruthy();
    expect(b.children.length).toBe(2);
    expect(b.children[0].tagName).toBe("SPAN");
    expect(b.children[1].tagName).toBe("P");
    expect(vm.select(b.children[1]).html()).toBe("This is a test");
    expect(count_created).toBe(3);
    expect(count_mount).toBe(4);
    expect(count_mounted).toBe(4);

    function _created(arg) {
      count_created += 1;
      expect(arg).toBeTruthy();
      expect(arg.model).toBeTruthy();
    }

    function _mount(arg, el) {
      count_mount += 1;
      expect(arg).toBeTruthy();
      expect(el).toBeTruthy();
    }

    function _mounted(arg) {
      count_mounted += 1;
      expect(arg).toBeTruthy();
    }
  });

  test("Test on method", async () => {
    var vm = view(),
      el = vm.createElement("div"),
      waiter = getWaiter();

    vm.on(el, "click.test", testOn);

    trigger(el.node(), "click");

    await waiter.promise;

    function testOn(event) {
      waiter.resolve();
      expect(event).toBeTruthy();
      expect(event.type).toBe("click");
    }
  });

  test("renderFromDist", async () => {
    var vm = view({
      components: {
        bla() {
          return this.renderFromDist("fake", "/test");
        }
      }
    });
    expect(vm.components.size).toBe(numDefComponents + 1);
    await vm.mount(vm.viewElement("<div><bla></bla></div>"));
    var p = vm.sel.select("p");
    expect(p.size()).toBe(1);
    expect(p.html()).toBe("This is a test");
    expect(vm.cache.has("https://unpkg.com/fake/test")).toBe(true);
    var el = await vm.renderFromUrl("/test");
    expect(el.tagName).toBe("P");
  });

  test("multiple element", async () => {
    var vm = view({
        components: {
          multi() {
            return `<div class="a"></div><div class="b"></div>`;
          }
        }
      }),
      logger = vm.providers.logger;
    logger.pop();
    await vm.mount(vm.viewElement("<div><multi /></div>"));
    var logs = logger.pop();
    expect(logs.length).toBe(1);
    expect(logs[0]).toBe(
      "[d3-view] viewElement function should return one root element only, got 2"
    );
  });
});
