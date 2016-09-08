export default function (el) {
    var theme = this.field.structure.theme || 'default';
    el.classed('btn', true);
    el.classed(`btn-${theme}`, true);
}
