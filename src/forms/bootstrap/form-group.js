const groupTpl = `<div class="form-group" d3-class='showError ? "has-danger" : null'>
<slot></slot>
<p d3-if="showError" class="text-danger error-block" d3-html="error"></p>
</div>`;


export default function (el, formEl) {
    var tname = formEl.node().tagName;
    if (tname === 'INPUT' || tname === 'TEXTAREA')
        formEl.classed('form-control', true).attr('d3-class', 'showError ? "form-control-danger" : null');
    return this.wrapTemplate(el, groupTpl);
}
