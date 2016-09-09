export default function (el, formEl) {
    var ig = this.data['group'];
    if (!ig) return el;
    var gid = `g${formEl.attr('id')}`;
    formEl.attr('aria-describedby', gid);
    return this.wrapTemplate(el, groupTpl(gid, ig));
}


function groupTpl(gid, group) {
    return `<div class="input-group" :class="bootstrapStatus()">
<span class="input-group-addon" id="${gid}">${group}</span>
<slot></slot>
</div>`;
}
