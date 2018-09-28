import { viewForms } from "../index";
import jsonform from "./fixtures/jsonform";
import jsonform2 from "./fixtures/jsonform2";
import jsonform3 from "./fixtures/jsonform3";
import view, { logger, nextTick, trigger } from "./utils";

describe("form submit -", () => {
  test("disabled", async () => {
    var messages = [],
      vm = view({
        model: {
          $formMessage(data) {
            messages.push(data);
          }
        }
      }).use(viewForms);

    await vm.mount(
      vm.viewElement(`<div><d3form props='${jsonform2}'></d3form></div>`)
    );

    var form = vm.sel.select("form").model();
    expect(form.$isValid()).toBe(false);
    //
    var button = vm.sel.select("button");
    trigger(button.node(), "click");

    await nextTick();

    expect(button.property("disabled")).toBe(true);
    expect(messages.length).toBe(0);

    form.inputs.id.value = "vhcgdsv";
    form.inputs.token.value = "hsjdgvchgjdc";

    await nextTick();

    expect(form.$isValid()).toBe(true);

    expect(button.property("disabled")).toBe(false);
    trigger(button.node(), "click");
    await nextTick();

    expect(messages.length).toBe(1);
    expect(messages[0].level).toBe("info");
    expect(messages[0].response.status).toBe(200);
  });

  test("multipart/form-data", async () => {
    var messages = [],
      vm = view({
        model: {
          $formMessage(data) {
            messages.push(data);
          }
        }
      }).use(viewForms);

    await vm.mount(
      vm.viewElement(`<div><d3form props='${jsonform3}'></d3form></div>`)
    );
    var form = vm.sel.select("form").model(),
      button = vm.sel.select("button");

    form.inputs.foo.value = "vhcgdsv";
    form.inputs.token.value = "hsjdgvchgjdc";
    await nextTick();
    expect(form.$isValid()).toBe(true);
    trigger(button.node(), "click");
    await nextTick();
    expect(messages.length).toBe(1);
    expect(messages[0].level).toBe("error");
    expect(messages[0].response.status).toBe(405);
    //
    // test the redirect
    var submit = button.model();
    expect(submit.props.endpoint.method).toBe("PUT");
    submit.props.endpoint.method = "POST";
    trigger(button.node(), "click");
    await nextTick();
    expect(messages.length).toBe(1);
    expect(vm.providers.location.href).toBe("/");
  });

  test("no url", async () => {
    var vm = view().use(viewForms);

    await vm.mount(
      vm.viewElement(`<div><d3form props='${jsonform}'></d3form></div>`)
    );
    logger.pop();
    var button = vm.sel.select("button");
    trigger(button.node(), "click");
    expect(logger.pop(1)[0]).toBe(
      "[d3-form-submit] No url, cannot submit form"
    );
  });

  test("error", async () => {
    var messages = [],
      vm = view({
        model: {
          $formMessage(data) {
            messages.push(data);
          }
        }
      }).use(viewForms);

    await vm.mount(
      vm.viewElement(`<div><d3form props='${jsonform3}'></d3form></div>`)
    );
    var form = vm.sel.select("form").model(),
      button = vm.sel.select("button");

    form.inputs.foo.value = "vhcgdsv";
    form.inputs.token.value = "hsjdgvchgjdc";
    await nextTick();
    expect(form.$isValid()).toBe(true);
    trigger(button.node(), "click");
    await nextTick();
    expect(messages.length).toBe(1);
    expect(messages[0].level).toBe("error");
    expect(messages[0].response.status).toBe(405);
    //
    // test the redirect
    var submit = button.model();
    submit.props.endpoint.url = "/error";
    trigger(button.node(), "click");
    await nextTick();
    expect(messages.length).toBe(2);
    expect(messages[1].level).toBe("error");
    expect(messages[1].response).toBe(undefined);
  });
});
