

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
                        section: "Overview",
                        items: [
                            {
                                name: "Getting started",
                                href: "getting-started"
                            },
                            {
                                name: "Examples",
                                href: "examples"
                            },
                            {
                                name: "Development",
                                href: "develop"
                            }
                        ]
                    },
                    {
                        section: "API",
                        items: [
                            {
                                name: "Reactive model",
                                href: "model"
                            },
                            {
                                name: "Base prototype",
                                href: "base"
                            },
                            {
                                name: "Components",
                                href: "component"
                            },
                            {
                                name: "Directives",
                                href: "directives"
                            },
                            {
                                name: "Expressions",
                                href: "expressions"
                            },
                            {
                                name: "Tools",
                                href: "tools"
                            }
                        ]
                    },
                    {
                        section: "Extending",
                        items: [
                            {
                                name: "Getting started",
                                href: "plugins"
                            },
                            {
                                name: "Examples",
                                href: "providers"
                            },
                            {
                                name: "Development",
                                href: "forms"
                            }
                        ]
                    },
                    {
                        section: "Addons",
                        items: [
                            {
                                name: "View require",
                                href: "require"
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
