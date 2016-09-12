(function () {

    var simpleform = {
        children: [
            {
                "type": "text",
                "name": "fullname",
                "label": "Your name"
            },
            {
                "type": "text",
                "name": "username",
                "label": "username",
                "group": "@"
            },
            {
                "type": "textarea",
                "name": "bio",
                "label": "Brief biography"
            },
            {
                "type": "submit",
                "name": "submit"
            }
        ]
    };


    var vm = d3.view({
        model: {
            $simpleform: simpleform
        }
    });

    vm.use(d3.viewForms).use(d3.viewBootstrapForms).mount('#page');

}());
