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
            type: "submit",
            label: "Login",
            name: "login"
        }
    ]
});
