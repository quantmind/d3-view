export default function(field, wrappedEl, fieldEl) {
  var data = field.props,
    ig = data.group;
  if (!ig) return wrappedEl;
  var gid = `g${fieldEl.attr("id")}`;
  fieldEl.attr("aria-describedby", gid);
  return field.wrapTemplate(wrappedEl, groupTpl(gid, ig));
}

function groupTpl(gid, group) {
  return `
        <div class="input-group">
            <div class="input-group-prepend">
                <span class="input-group-text" id="${gid}">${group}</span>
            </div>
            <slot></slot>
        </div>
    `;
}
