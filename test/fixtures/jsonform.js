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
                    maxlength: 32,
                    minlength: 32,
                    label: "Application ID",
                    required: true,
                    name: "id"
                },
                {
                    type: "password",
                    maxlength: 32,
                    minlength: 32,
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
            tag: "button"
        }
    ]
});
