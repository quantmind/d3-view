export default JSON.stringify({
    type: "form",
    action: "/login",
    resultHandler: "redirect",
    children: [
        {
            type: "fieldset",
            labelSrOnly: true,
            children: [
                {
                    type: "text",
                    id: "fooId",
                    maxLength: 32,
                    minLength: 2,
                    label: "Application ID",
                    required: true,
                    name: "foo",
                    attributes: {
                        "d3-color": {
                            react1: "ciao",
                            react2: "fooo"
                        },
                        "d3-attr-disabled": "!root.showId",
                        "data-config": {
                            entry1: "ciao",
                            entry2: "fooo"
                        }
                    }
                },
                {
                    type: "password",
                    maxLength: 32,
                    minLength: 8,
                    label: "Application Token",
                    required: true,
                    name: "token"
                }
            ]
        },
        {
            type: "submit",
            label: "Login",
            name: "login",
            disabled: "!form.$isValid()",
            endpoint: {
                url: '/submitTest',
                contentType: 'multipart/form-data',
                method: 'PUT'
            }
        }
    ]
});
