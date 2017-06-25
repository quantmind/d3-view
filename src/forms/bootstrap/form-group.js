const groupTpl = `<div class="form-group" d3-class='showError ? "has-danger" : null'>
<slot></slot>
<p d3-if="showError" class="text-danger error-block" d3-html="error"></p>
</div>`;


export default function (field, wrappedEl, fieldEl) {
    fieldEl.classed('form-control', true).attr('d3-class', 'showError ? "form-control-danger" : null');
    return field.wrapTemplate(wrappedEl, groupTpl);
}
