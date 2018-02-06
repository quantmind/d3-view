

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
                path: "docs",
                template: "sidenav",
                title: "Documentation",
                highlightTheme: "androidstudio",
                navigation: [
                    {
                        name: "Overview",
                        icon: "file-text",
                        items: [
                            {
                                name: "Getting started",
                                href: "/docs/getting-started"
                            },
                            {
                                name: "Examples",
                                href: "/docs/examples"
                            },
                            {
                                name: "Development",
                                href: "/docs/develop"
                            }
                        ]
                    }
                ]
            },
            {
                slug: "",
                path: "site",
                template: "topnav"
            }
        ],
        plugins: {
        }
    }
};
