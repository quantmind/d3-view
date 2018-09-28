import { isEmail } from "validator";
import { viewBootstrapForms, viewElement, viewForms } from "../index";
import jsonform4 from "./fixtures/jsonform4";
import view, { nextTick } from "./utils";

describe("Form validation -", () => {
  let el;

  viewForms.validators.set("email", {
    validate(el, value) {
      if (el.attr("type") === "email" && !isEmail(value))
        return "not a valid email address";
    }
  });

  beforeEach(() => {
    el = viewElement(`<div><d3form props='${jsonform4}'></d3form></div>`);
  });

  test("email", async () => {
    var vm = view()
      .use(viewForms)
      .use(viewBootstrapForms);
    await vm.mount(el);
    var form = vm.sel.select("form").model();
    form.inputs.email.value = "bjhbdfjhv";
    form.inputs.age.value = 20;
    await nextTick();
    expect(form.$isValid()).toBe(false);
    form.inputs.email.value = "bla@foo.com";
    await nextTick();
    expect(form.$isValid()).toBe(true);
  });

  test("number min - max", async () => {
    var vm = view()
      .use(viewForms)
      .use(viewBootstrapForms);
    await vm.mount(el);
    var form = vm.sel.select("form").model();
    form.inputs.email.value = "bla@foo.com";
    form.inputs.age.value = 17;
    await nextTick();
    expect(form.$isValid()).toBe(false);
    form.inputs.age.value = 40;
    await nextTick();
    expect(form.$isValid()).toBe(false);
    form.inputs.age.value = 30;
    await nextTick();
    expect(form.$isValid()).toBe(true);
  });
});
