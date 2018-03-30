export default JSON.stringify({
    type: "form",
    action: "/login",
    children: [
        {
            type: "email",
            required: true,
            name: "email",
            group: "@"
        },
        {
            type: "number",
            name: "age",
            required: true,
            minimum: 18,
            maximum: 35
        },
        {
            type: "submit",
            label: "Login",
            name: "login"
        }
    ]
});
