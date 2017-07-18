export default function (field, wrappedEl, fieldEl) {
    var data = field.data;
    fieldEl.classed('form-check-input', true);
    return field.wrapTemplate(wrappedEl, groupTpl(data.label));
}

function groupTpl(label) {
    return `<div class="form-check">
<label class="form-check-label">
<slot></slot>
${label}
</label>
</div>`;
}
