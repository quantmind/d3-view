(function () {


    var data = [
      ["", "Ford", "Volvo", "Toyota", "Honda"],
      ["2016", 10, 11, 12, 13],
      ["2017", 20, 11, 14, 13],
      ["2018", 30, 15, 12, 13]
    ];


    var table = {
        render () {
            return d3.viewElement(`<div id="table-${this.uid}"></div>`);
        },

        mounted () {
            this.table = new Handsontable(this.el, {
                data: data,
                rowHeaders: true,
                colHeaders: true
            });
        }
    };


    d3.view({

        components: {
            d3table: table
        }
    }).mount('#page');

}());
