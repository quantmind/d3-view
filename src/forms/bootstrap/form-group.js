const groupTpl = `<div class="form-group" d3-class='error ? "has-danger" : null'>
<slot></slot>
<p ng-if="error" class="text-danger error-block" d3-html="error"></p>
</div>`;


export default function (el, formEl) {
    var tname = formEl.node().tagName;
    if (tname === 'INPUT' || tname === 'TEXTAREA')
        formEl.classed('form-control', true).attr('d3-class', 'error ? "form-control-danger" : null');
    return this.wrapTemplate(el, groupTpl);
}
