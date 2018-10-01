export default function(field, wrappedEl, fieldEl) {
  var data = field.props;
  if (data.help) {
    fieldEl.attr("aria-describedby", `help-${data.id}`);
    return field.wrapTemplate(wrappedEl, helpTpl(data));
  } else return wrappedEl;
}

function helpTpl(data) {
  return `<slot></slot><small id="help-${
    data.id
  }" class="form-text text-muted">${data.help}</small>`;
}
