export default function (field, wrappedEl, fieldEl) {
    var data = field.model.data;
    fieldEl.classed('form-control', true).attr('d3-class',
        `[${data.required || false} ? "form-control-required" : null, showError ? "form-control-danger" : null]`
    );
    return field.wrapTemplate(wrappedEl, groupTpl(data));
}


function groupTpl () {
    return `<div class="form-group" d3-class='showError ? "has-danger" : null'>
<slot></slot>
<p d3-if="showError" class="text-danger error-block" d3-html="error"></p>
</div>`;
}
