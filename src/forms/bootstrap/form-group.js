const groupTpl = `<div class="form-group" :class="bootstrapStatus()">
<slot></slot>
<p ng-if="error" class="text-danger error-block" d3-html="error"></p>
</div>`;


export default function (el, formEl) {
    var tname = formEl.node().tagName;
    if (tname === 'INPUT' || tname === 'TEXTAREA')
        formEl.classed('form-control', true);
    return this.wrapTemplate(el, groupTpl);
}
