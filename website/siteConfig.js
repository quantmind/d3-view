

module.exports = {
    title: "d3-view - d3 plugin for building interactive data-driven web interfaces",
    github: "quantmind/d3-view",
    algolia: {
        apiKey: process.env.ALGOLIA_API_KEY
    },
    markdown: {
        paths: [
            {
                slug: "docs",
                path: "docs/",
                template: "sidenav",
                context: {

                }
            },
            {
                slug: "",
                path: "/",
                template: "topnav"
            }
        ],
        plugins: {
        }
    }
};
