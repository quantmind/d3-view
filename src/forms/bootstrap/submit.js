const groupTpl = `<div class="form-group">
<slot></slot>
</div>`;

export default function(field, wrappedEl, fieldEl) {
  var data = field.props,
    theme = data.theme || "primary";
  fieldEl.classed("btn", true).classed(`btn-${theme}`, true);
  return field.wrapTemplate(wrappedEl, groupTpl);
}
