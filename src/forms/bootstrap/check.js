export default function(field, wrappedEl, fieldEl) {
  var data = field.props;
  fieldEl.classed("custom-control-input", true);
  return field.wrapTemplate(wrappedEl, groupTpl(data));
}

function groupTpl(data) {
  return `
        <div class="custom-control custom-checkbox">
            <slot></slot>
            <label class="custom-control-label" for="${data.id}">${
    data.label
  }</label>
        </div>
    `;
}
