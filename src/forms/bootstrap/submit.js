export default function (el, formEl) {
    var theme = this.data.theme || 'primary';
    formEl.classed('btn', true).classed(`btn-${theme}`, true);
    return el;
}
