export default function (field, wrappedEl) {
    return field.wrapTemplate(wrappedEl, labelTpl(field.data));
}


function labelTpl(data) {
    var label = data.label || data.name;

    return `<label for=${data.id} class="control-label" d3-class="[required, labelSrOnly ? 'sr-only' : null]">${label}</label>
<slot></slot>`;
}
