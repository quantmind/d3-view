export default JSON.stringify({
    type: "form",
    action: "/login",
    children: [
        {
            type: "fieldset",
            labelSrOnly: true,
            children: [
                {
                    type: "text",
                    maxLength: 32,
                    minLength: 32,
                    label: "Application ID",
                    required: true,
                    name: "id"
                },
                {
                    type: "password",
                    maxLength: 32,
                    minLength: 8,
                    label: "Application Token",
                    required: true,
                    name: "token"
                },
                {
                    type: "checkbox",
                    label: "Remember me",
                    name: "remember"
                },
                {
                    type: "textarea",
                    label: "Notes",
                    name: "notes",
                    help: "write anything you like"
                }
            ]
        },
        {
            type: "submit",
            label: "Login",
            name: "login"
        }
    ]
});
