export default function (field, wrappedEl, fieldEl) {
    var data = field.props,
        size = data.size !== undefined ? data.size : data.form.props.size,
        fc = size ? `form-control form-control-${size}` : 'form-control';
    fieldEl.classed(fc, true).attr('d3-class',
        `[${data.required || false} ? "form-control-required" : null, showError ? "is-invalid" : null]`
    );
    return field.wrapTemplate(wrappedEl, groupTpl(data));
}


function groupTpl () {
    return `<div class="form-group">
<slot></slot>
<div class="invalid-feedback" d3-html="error"></div>
</div>`;
}
