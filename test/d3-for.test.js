import view, { logger, nextTick } from "./utils";

describe("d3-for -", () => {
  test("bad template", async () => {
    logger.pop();
    var vm = view();
    await vm.mount(vm.viewElement('<div><p d3-for="foo bo bla"></p></div>'));

    expect(vm.isMounted).toBe(true);
    expect(logger.pop()[0]).toBe(
      '[d3-for] directive requires "item in expression" template, got "foo bo bla"'
    );
  });

  test("paragraph", async () => {
    logger.pop();
    var text = ["blaaaaaa", "foooooooo"],
      vm = view({
        model: {
          bla: text
        }
      });
    await vm.mount(
      vm.viewElement('<div><p d3-for="foo in bla" d3-html="foo"></p></div>')
    );

    expect(vm.isMounted).toBe(true);
    var paragraphs = vm.sel.selectAll("p");
    expect(paragraphs.size()).toBe(2);
    paragraphs.select(function(txt, i) {
      expect(txt).toBe(text[i]);
      expect(this.innerHTML).toBe(txt);
    });
    expect(logger.pop().length).toBe(0);
  });

  test("refresh", async () => {
    var text = ["blaaaaaa", "foooooooo"],
      vm = view({
        model: {
          bla: text
        }
      });
    await vm.mount(
      vm.viewElement('<div><p d3-for="foo in bla" d3-html="foo"></p></div>')
    );

    expect(vm.isMounted).toBe(true);
    var paragraphs = vm.sel.selectAll("p");
    expect(paragraphs.size()).toBe(2);
    vm.model.bla.push("a new entry");
    vm.model.$change("bla");
    paragraphs = vm.sel.selectAll("p");
    expect(paragraphs.size()).toBe(2);
    await nextTick();
    paragraphs = vm.sel.selectAll("p");
    expect(paragraphs.size()).toBe(3);
  });

  test("update", async () => {
    var text = ["blaaaaaa", "foooooooo"],
      newText = ["whaatt", "kaput"],
      vm = view({
        model: {
          bla: text
        }
      });
    await vm.mount(
      vm.viewElement('<div><p d3-for="foo in bla" d3-html="foo"></p></div>')
    );

    expect(vm.isMounted).toBe(true);
    var paragraphs = vm.sel.selectAll("p");
    expect(paragraphs.size()).toBe(2);
    vm.model.bla = newText;
    paragraphs = vm.sel.selectAll("p");
    expect(paragraphs.size()).toBe(2);
    await nextTick();
    paragraphs = vm.sel.selectAll("p");
    expect(paragraphs.size()).toBe(2);
    paragraphs.each(function(d, i) {
      expect(d).toBe(newText[i]);
      expect(vm.select(this).html()).toBe(newText[i]);
    });
  });

  test("update object", async () => {
    var data = [
        {
          text: "blaaaaaa",
          active: true
        },
        {
          text: "foooooooo"
        }
      ],
      vm = view({
        model: {
          bla: data
        }
      });
    await vm.mount(
      vm.viewElement(
        `<div><p d3-for="foo in bla" d3-html="foo.text" d3-class="foo.active ? 'active' : null"></p></div>`
      )
    );

    expect(vm.isMounted).toBe(true);
    var paragraphs = vm.sel.selectAll("p");
    expect(paragraphs.size()).toBe(2);
    var bla = [
      {
        text: "foooo",
        active: true
      },
      {
        text: "kaput",
        active: true
      },
      {
        text: "ciao"
      }
    ];
    vm.model.bla = bla;
    paragraphs = vm.sel.selectAll("p");
    expect(paragraphs.size()).toBe(2);
    await nextTick();
    paragraphs = vm.sel.selectAll("p");
    expect(paragraphs.size()).toBe(3);
    paragraphs.each(function(d, i) {
      expect(d.text).toBe(bla[i].text);
      expect(vm.select(this).html()).toBe(bla[i].text);
      expect(vm.select(this).classed("active")).toBe(bla[i].active || false);
    });
  });

  test("nested", async () => {
    var data = [
        {
          text: "blaaaaaa",
          items: ["a", "b", "c", "d"]
        },
        {
          text: "foooooooo",
          items: ["e", "f"]
        },
        {
          text: "foooooooo",
          items: ["g"]
        }
      ],
      vm = view({ model: { data } });
    await vm.mount(
      vm.viewElement(
        `<ul id="nested-first">
                    <li d3-for="d in data">
                        <a href="#" d3-html="d.text"></a>
                        <ul class="nested-second">
                            <li d3-for="item in d.items">
                                <a href="#" d3-html="item"></a>
                            </li>
                        </ul>
                    </li>
                </ul>
            `
      )
    );
    // vm.select('body').append(() => vm.el);
    expect(vm.el.children.length).toBe(3);
    for (let i = 0; i < vm.el.children.length; ++i) {
      var ul = vm.select(vm.el.children[i]).select("ul");
      expect(ul.node().children.length).toBe(data[i].items.length);
    }
  });
});
