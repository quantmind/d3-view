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
                    maxLength: 32,
                    minLength: 2,
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
                }
            ]
        },
        {
            type: "submit",
            label: "Login",
            name: "login",
            disabled: "!form.$isValid()",
            endpoint: {
                url: '/submitTest'
            }
        }
    ]
});
