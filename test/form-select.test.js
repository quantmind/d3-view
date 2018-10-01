import { isObject } from "d3-let";
import { viewForms } from "../index";
import view, { nextTick } from "./utils";

describe("json form -", () => {
  var form = {
    type: "form",
    action: "/login",
    resultHandler: "redirect",
    children: [
      {
        name: "testselect",
        type: "select",
        options: ["o1", ["o2", "option 2"], "o3"]
      }
    ]
  };

  test("select field", async () => {
    var vm = view({
      props: {
        $selectForm: form
      }
    }).use(viewForms);
    await vm.mount(
      vm.viewElement(`<div><d3form props='$selectForm'></d3form></div>`)
    );
    var fv = vm.sel.select("form").view();
    var model = fv.model;
    expect(isObject(model.inputs)).toBe(true);
    await nextTick();

    var inp = model.inputs.testselect;
    expect(inp.isDirty).toBe(false);
    var options = vm.sel.selectAll("option").nodes();
    expect(options.length).toBe(3);
    expect(vm.select(options[0]).attr("value")).toBe("o1");
    expect(vm.select(options[0]).html()).toBe("o1");
    expect(vm.select(options[1]).attr("value")).toBe("o2");
    expect(vm.select(options[1]).html()).toBe("option 2");

    inp.options.push("o4");
    inp.$change("options");
    await nextTick();
    options = vm.sel.selectAll("option");
    expect(options.size()).toBe(4);
  });
});
