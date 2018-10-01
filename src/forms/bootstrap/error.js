export default (field, wrappedEl) => {
  return field.wrapTemplate(
    wrappedEl,
    `<slot></slot><div class="invalid-feedback" d3-html="error"></div>`
  );
};
