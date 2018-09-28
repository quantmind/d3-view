export default function(field, wrappedEl) {
  var data = field.props;
  return field.wrapTemplate(wrappedEl, labelTpl(data));
}

function labelTpl(data) {
  var label = data.label || data.name;

  return `<label for=${
    data.id
  } class="control-label" d3-class="[srOnly ? 'sr-only' : null]">${label}</label>
<slot></slot>`;
}
