import view, { nextTick, numDefComponents } from "./utils";

describe("Component data -", () => {
  var append = {
      refresh: function(model, html) {
        var sel = this.sel.selectAll(`#${this.uid}`).data([0]);
        sel
          .enter()
          .append("span")
          .attr("id", this.uid)
          .merge(sel)
          .html("" + html);
      }
    },
    sidebar = {
      // static properties
      props: {
        brand: "sidebar",
        brandUrl: "/"
      },
      // reactive properties
      model() {
        return {
          sidebarContent: "",
          primaryItems: [],
          secondaryItems: []
        };
      },
      render(el) {
        this.model.sidebarContent = this.select(el).html();
        return this.renderFromUrl("/sidebar", this.props);
      }
    };

  let vm;

  beforeEach(() => {
    vm = view({
      model: {
        sidebarItems: [
          {
            url: "#",
            name: "link1"
          },
          {
            url: "#",
            name: "link2"
          }
        ]
      },
      components: {
        sidebar: sidebar
      },
      directives: {
        append: append
      }
    });
  });

  test("properties", async () => {
    // API pre-mount
    expect(vm.components.size).toBe(numDefComponents + 1);
    expect(vm.components.get("sidebar")).toBeTruthy();
    //
    await vm.mount(
      vm.viewElement(`
            <div>
                <sidebar id="bang" data-brand="Big bang" data-brand-url='/big' data-primary-items="sidebarItems">
                    <p id="innerBang">bla bla bla</p>
                </sidebar>
            </div>
        `)
    );
    var bar = vm.sel.selectAll("#bang");
    expect(bar.size()).toBe(1);
    var model = bar.model();
    expect(model.parent).toBe(vm.model);
    expect(model.primaryItems).toBe(vm.model.sidebarItems);

    var link = bar.selectAll(".sidebar-brand");
    expect(link.html()).toBe("Big bang");
    expect(link.attr("href")).toBe("/big");
    var items = bar.selectAll(".list-group-item-primary");
    expect(items.size()).toBe(2);
    items.each(function(d, idx) {
      expect(
        vm
          .select(this)
          .select("span")
          .html()
      ).toBe(vm.model.sidebarItems[idx].name);
    });

    vm.model.sidebarItems = [
      {
        url: "gggg",
        name: "link3"
      }
    ];
    await nextTick();
    items = bar.selectAll(".list-group-item-primary");
    expect(items.size()).toBe(1);
    items.each(function(d, idx) {
      expect(vm.select(this).attr("href")).toBe(vm.model.sidebarItems[idx].url);
      expect(
        vm
          .select(this)
          .select("span")
          .html()
      ).toBe(vm.model.sidebarItems[idx].name);
    });
  });

  test("same property name", async () => {
    vm.model.secondaryItems = [
      {
        url: "/fooo",
        name: "second1"
      }
    ];
    await vm.mount(
      vm.viewElement(
        `<div><sidebar id="bang2"
data-brand="Test" data-brand-url='/big'
data-primary-items="sidebarItems"
data-secondary-items="secondaryItems">
<p id="innerBang">bla bla bla</p></sidebar>
</div>`
      )
    );
    var bar = vm.sel.selectAll("#bang2");
    expect(bar.size()).toBe(1);
    var model = bar.model();
    expect(model.parent).toBe(vm.model);
    expect(model.primaryItems).toBe(vm.model.sidebarItems);
    expect(model.secondaryItems).toBe(vm.model.secondaryItems);
    let items = bar.selectAll(".list-group-item-secondary");
    expect(items.size()).toBe(1);
    //
    // we should not be able to set the property on the model
    vm.providers.logger.pop();
    model.secondaryItems = [];
    expect(vm.providers.logger.pop().length).toBe(1);
    await nextTick();
    items = vm.sel.selectAll(".list-group-item-secondary");
    expect(items.size()).toBe(1);
  });
});
