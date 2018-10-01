import { isFunction, isObject } from "d3-let";
import { viewForms } from "../index";
import jsonform from "./fixtures/jsonform";
import jsonform3 from "./fixtures/jsonform3";
import view, { logger, nextTick } from "./utils";

describe("form meta", () => {
  it("viewForms", () => {
    expect(isObject(viewForms)).toBe(true);
    expect(isFunction(viewForms.install)).toBe(true);
  });

  it("install plugin", () => {
    var vm = view().use(viewForms);
    expect(vm.components.get("d3form")).toBeTruthy();
  });

  test("mount empty form", async () => {
    var vm = view().use(viewForms);
    await vm.mount(vm.viewElement("<div><d3form></d3form></div>"));
  });

  test("remote schema", async () => {
    var vm = view().use(viewForms);
    await vm.mount(
      vm.viewElement('<div><d3form url="/jsonform"></d3form></div>')
    );
    var form = vm.sel.select("form").model();
    expect(Object.keys(form.inputs).length).toBe(4);
  });
});

describe("json form -", () => {
  let el, vm;

  beforeEach(() => {
    vm = view().use(viewForms);
    el = vm.viewElement(`<div><d3form props='${jsonform}'></d3form></div>`);
  });

  test("form model", async () => {
    await vm.mount(el);
    var fv = vm.sel.select("form").view();
    var model = fv.model;
    expect(isObject(model.inputs)).toBe(true);
    expect(isObject(model.actions)).toBe(true);
    expect(model.formSubmitted).toBe(false);
    expect(model.formPending).toBe(false);
  });

  test("maxLength - minLength validation", async () => {
    await vm.mount(el);
    var fv = vm.sel.select("form").view();
    var model = fv.model;
    var token = model.inputs.token;

    expect(token.isDirty).toBe(null);
    expect(token.error).toBe("");
    expect(token.showError).toBe(false);
    await nextTick();

    token.value = "xxy";
    expect(token.isDirty).toBe(false);
    expect(token.error).toBe("required");
    expect(token.showError).toBe(false);

    await nextTick();
    expect(token.isDirty).toBe(true);
    expect(token.error).toBe("too short - 8 characters or more expected");
    expect(token.showError).toBe(true);

    token.value = "xxyabcabc";
    await nextTick();
    expect(token.isDirty).toBe(true);
    expect(token.error).toBe("");
    expect(token.showError).toBe(false);

    token.value = "";
    await nextTick();
    expect(token.isDirty).toBe(true);
    expect(token.error).toBe("required");
    expect(token.showError).toBe(true);
  });

  test("children errors", async () => {
    await vm.mount(el);

    var form = vm.sel.select("form");

    expect(form.node()).toBeTruthy();
    var fv = form.view();
    expect(fv.parent).toBe(vm);
    var formModel = fv.model;
    expect(Object.keys(formModel.inputs).length).toBe(4);
    var id = formModel.inputs.id,
      token = formModel.inputs.token,
      remember = formModel.inputs.remember;
    expect(id).toBeTruthy();
    expect(token).toBeTruthy();
    expect(remember).toBeTruthy();

    expect(id.showError).toBe(false);
    expect(token.showError).toBe(false);

    await nextTick();

    expect(id.showError).toBe(false);
    expect(id.isDirty).toBe(false);
    expect(token.showError).toBe(false);
    expect(token.isDirty).toBe(false);

    var valid = formModel.$setSubmit();

    expect(valid).toBe(false);

    expect(formModel.formSubmitted).toBe(true);

    await nextTick();

    expect(id.showError).toBe(true);
    expect(token.showError).toBe(true);
  });

  test("invalid children", async () => {
    logger.pop();
    var schema = JSON.stringify({ type: "form", children: {} });
    el = vm.viewElement(`<div><d3form props='${schema}'></d3form></div>`);
    await vm.mount(el);
    var logs = logger.pop();
    expect(logs.length).toBe(1);
  });

  test("no field name", async () => {
    logger.pop();
    var schema = JSON.stringify({
      type: "form",
      children: [{ type: "input" }]
    });
    el = vm.viewElement(`<div><d3form props='${schema}'></d3form></div>`);
    await vm.mount(el);
    var logs = logger.pop();
    expect(logs.length).toBe(1);
    expect(logs[0]).toBe("[d3-form-input] Input field without a name");
  });
});

describe("json form 3 -", () => {
  let el, vm;

  beforeEach(() => {
    vm = view({
      model: {
        showId: true
      }
    }).use(viewForms);
    el = vm.viewElement(`<div><d3form props='${jsonform3}'></d3form></div>`);
  });

  test("attributes", async () => {
    await vm.mount(el);

    var form = vm.sel.select("form"),
      fel = vm.sel.selectAll("#fooId"),
      model = form.model(),
      foo = model.inputs.foo;
    expect(foo).toBeTruthy();
    expect(fel.size()).toBe(1);
    expect(fel.property("disabled")).toBe(false);
    vm.model.showId = false;
    await nextTick();
    expect(fel.property("disabled")).toBe(true);
  });
});
