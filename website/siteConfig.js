
module.exports = {
    algolia: {
        apiKey: process.env.ALGOLIA_API_KEY
    },
    markdown: {
        paths: [
            {
                slug: "docs",
                path: "docs/"
            },
            {
                slug: "",
                path: "/"
            }
        ],
        plugins: {
        }
    }
};
