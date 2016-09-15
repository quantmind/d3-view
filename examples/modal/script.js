(function () {

    var modalTpl = `<div class="modal fade" d3-class="show ? 'in': null" tabindex="-1" role="dialog" aria-hidden="true" d3-show="show">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" d3-on-click="$show(false)" aria-label="Close">
          <span aria-hidden="true">&times</span>
        </button>
        <h4 class="modal-title" d3-html="header"></h4>
      </div>
      <div class="modal-body" d3-html="body"></div>
      <div class="modal-footer" d3-if="footer" d3-html="footer"></div>
    </div>
  </div>
</div>`;

    var modal = {
        model: {
            show: false,
            header: 'Default header',
            body: 'Default body',
            footer: '',
            $show () {
                this.show = arguments.length === 0 ? true : arguments[0];
            }
        },
        render () {
            return d3.viewElement(modalTpl);
        }
    };


    d3.view({
        methods: {
            showModal (selector) {
                var model = this.$select(selector);
                if (model) model.show = true;
            }
        },

        components: {
            d3modal: modal
        }
    }).mount('#page');

}());
