import { isArray, isFunction, isObject } from "d3-let";
import { viewBootstrapForms, viewElement, viewForms } from "../index";
import jsonform from "./fixtures/jsonform";
import view from "./utils";

describe("Bootstrap plugin -", () => {
  let el;

  beforeEach(() => {
    el = viewElement(`<div><d3form props='${jsonform}'></d3form></div>`);
  });

  test("viewBootstrapForms", () => {
    expect(isObject(viewBootstrapForms)).toBe(true);
    expect(isFunction(viewBootstrapForms.install)).toBe(true);
  });

  test("install", () => {
    var vm = view()
      .use(viewForms)
      .use(viewBootstrapForms);
    expect(isArray(vm.$formExtensions)).toBe(true);
    expect(vm.$formExtensions.length).toBe(1);
  });

  test("mount empty form", async () => {
    var vm = view()
      .use(viewForms)
      .use(viewBootstrapForms);
    await vm.mount(viewElement("<div><d3form></d3form></div>"));
  });

  test("form model", async () => {
    var vm = view()
      .use(viewForms)
      .use(viewBootstrapForms);
    await vm.mount(el);
    var fv = vm.sel.select("form").view();
    var model = fv.model;
    expect(isObject(model.inputs)).toBe(true);
    expect(isObject(model.actions)).toBe(true);
    expect(model.formSubmitted).toBe(false);
    expect(model.formPending).toBe(false);
  });

  test("dynamic mount", async () => {
    var vm = view()
      .use(viewForms)
      .use(viewBootstrapForms);
    await vm.mount(vm.viewElement("<div>/<div>"));
    //
    await vm.sel.html("<d3form></d3form").mount(JSON.parse(jsonform));
    var fv = vm.sel.select("form").view(),
      model = fv.model;

    expect(model.inputs.id).toBeTruthy();
    expect(model.inputs.token).toBeTruthy();
  });

  test("small form", async () => {
    var vm = view()
        .use(viewForms)
        .use(viewBootstrapForms),
      schema = JSON.parse(jsonform);
    schema.size = "sm";
    await vm.mount(viewElement("<div>/<div>"));
    //
    await vm.sel.html("<d3form></d3form").mount(schema);
    var inputs = vm.sel.select("form").selectAll(".form-control-sm");
    expect(inputs.size()).toBe(4);
    inputs = vm.sel.select("form").selectAll(".form-control");
    expect(inputs.size()).toBe(4);
  });

  test("help", async () => {
    var vm = view()
      .use(viewForms)
      .use(viewBootstrapForms);
    await vm.mount(el);
    var nodes = vm.sel
      .select("form")
      .selectAll(".form-control")
      .nodes();
    expect(nodes.length).toBe(4);
    var txt = vm.select(nodes[3]);
    var id = txt.attr("id");
    expect(vm.sel.select(`#help-${id}`).size()).toBe(1);
  });

  test("warning", () => {
    var vm = view();
    vm.providers.logger.pop();
    vm.use(viewBootstrapForms);
    expect(vm.providers.logger.pop().length).toBe(1);
  });
});
