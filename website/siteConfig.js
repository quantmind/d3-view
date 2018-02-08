

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
                sidebarToggle: "https://fluidily-public.s3.amazonaws.com/d3-view/images/d3view.svg",
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
                    },
                    {
                        name: "API",
                        icon: "package",
                        items: [
                            {
                                name: "Reactive model",
                                href: "/docs/model"
                            },
                            {
                                name: "Base prototype",
                                href: "/docs/base"
                            },
                            {
                                name: "Components",
                                href: "/docs/component"
                            },
                            {
                                name: "Directives",
                                href: "/docs/directives"
                            },
                            {
                                name: "Expressions",
                                href: "/docs/expressions"
                            },
                            {
                                name: "Tools",
                                href: "/docs/tools"
                            }
                        ]
                    },
                    {
                        name: "Extending",
                        items: [
                            {
                                name: "Getting started",
                                href: "/docs/plugins"
                            },
                            {
                                name: "Examples",
                                href: "/docs/providers"
                            },
                            {
                                name: "Development",
                                href: "/docs/forms"
                            }
                        ]
                    },
                    {
                        name: "Addons",
                        items: [
                            {
                                name: "View require",
                                href: "/docs/require"
                            }
                        ]
                    }
                ]
            },
            {
                slug: "",
                path: "site",
                template: "topnav",
                navigationRight: [
                    {
                        href: "/docs",
                        name: "docs"
                    }
                ]
            }
        ],
        plugins: {
        }
    }
};
