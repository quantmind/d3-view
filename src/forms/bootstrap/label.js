export default function (el) {
    return this.wrapTemplate(el, labelTpl(this.data));
}


function labelTpl(data) {
    var label = data.label || data.name;

    return `<label for=${data.id} class="control-label" :class="field.required">${label}</label>
<slot></slot>`;
}
